const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const poll = require('../plugins/group/poll');
const qr = require('../plugins/tools/qr');
const ship = require('../plugins/fun/ship');
const hd = require('../plugins/tools/hd');
const hdvideo = require('../plugins/tools/hdvideo');
const unreg = require('../plugins/ekonomi/unreg');
const daftar = require('../plugins/ekonomi/daftar');
const ttt = require('../plugins/game/ttt');
const mute = require('../plugins/group/mute');
const unmute = require('../plugins/group/unmute');
const { handleTttInput } = require('../lib/ttt-game');
const sharp = require('sharp');
const { validateAiDimensions } = require('../lib/ai-upscaler');
const { executeWithProcessingReaction, shouldReactToProcessing } = require('../lib/processing-reaction');

const hasFfmpeg = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;

test('.poll sends a native single-choice group poll', async () => {
  let sent;
  await poll.execute({
    sendMessage: async (to, message, options) => { sent = { to, message, options }; },
  }, { key: 'quoted' }, ['Makan', '|', 'Nasi', '|', 'Mie'], {
    from: 'group@g.us',
    isGroup: () => true,
  });

  assert.equal(sent.to, 'group@g.us');
  assert.deepEqual(sent.message.poll, { name: 'Makan', values: ['Nasi', 'Mie'], selectableCount: 1 });
});

test('.poll rejects private chats and invalid option counts', async () => {
  const responses = [];
  const sock = { sendMessage: async (_to, message) => { responses.push(message.text); } };
  await poll.execute(sock, {}, ['Question', '|', 'A', '|', 'B'], {
    from: 'user@s.whatsapp.net',
    isGroup: () => false,
  });
  await poll.execute(sock, {}, ['Question', '|', 'Only one'], {
    from: 'group@g.us',
    isGroup: () => true,
  });

  assert.match(responses[0], /hanya bisa dibuat di dalam grup/);
  assert.match(responses[1], /2–12 opsi/);
});

test('.qr creates a local PNG image without an external service', async () => {
  let sent;
  await qr.execute({
    sendMessage: async (_to, message) => { sent = message; },
  }, {}, ['https://example.com'], { from: 'user@s.whatsapp.net' });

  assert.equal(sent.image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.match(sent.caption, /secara lokal/);
});

test('.ship is deterministic and order-independent', async () => {
  const responses = [];
  const sock = { sendMessage: async (_to, message) => { responses.push(message.text); } };
  const context = { from: 'user@s.whatsapp.net' };
  await ship.execute(sock, {}, ['Rani', '|', 'Bima'], context);
  await ship.execute(sock, {}, ['Bima', '|', 'Rani'], context);

  assert.equal(responses[0], responses[1]);
  assert.match(responses[0], /\d+%/);
});

test('.hd upscales and sharpens a quoted image locally', async () => {
  const input = await sharp({ create: { width: 80, height: 60, channels: 3, background: '#777777' } }).png().toBuffer();
  let sent;
  await hd.execute({
    sendMessage: async (_to, message) => { sent = message; },
  }, {
    key: { remoteJid: 'group@g.us' },
    message: { extendedTextMessage: { contextInfo: { stanzaId: 'image-id', quotedMessage: { imageMessage: {} } } } },
  }, [], {
    from: 'group@g.us',
    downloadMediaMessage: async fullMessage => {
      assert.equal(fullMessage.key.id, 'image-id');
      return input;
    },
  });

  const metadata = await sharp(sent.image).metadata();
  assert.equal(metadata.width, 160);
  assert.equal(metadata.height, 120);
  assert.equal(sent.mimetype, 'image/jpeg');
  assert.match(sent.caption, /detail yang tidak ada/);
});

test('.hdvideo upscales and sharpens a quoted video separately', { skip: !hasFfmpeg }, async () => {
  const clip = spawnSync('ffmpeg', [
    '-hide_banner', '-loglevel', 'error',
    '-f', 'lavfi', '-i', 'testsrc=size=160x120:rate=10',
    '-t', '1', '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-movflags', 'frag_keyframe+empty_moov', '-f', 'mp4', 'pipe:1',
  ], { maxBuffer: 4 * 1024 * 1024 });
  assert.equal(clip.status, 0, clip.stderr.toString());

  const sentMessages = [];
  await hdvideo.execute({
    sendMessage: async (_to, message) => { sentMessages.push(message); },
  }, {
    key: { remoteJid: 'group@g.us', id: 'command-id' },
    message: { extendedTextMessage: { contextInfo: { stanzaId: 'video-id', quotedMessage: { videoMessage: { seconds: 1 } } } } },
  }, [], {
    from: 'group@g.us',
    downloadMediaMessage: async fullMessage => {
      assert.equal(fullMessage.key.id, 'video-id');
      return clip.stdout;
    },
  });

  const sent = sentMessages.find(message => message.video);
  const reactions = sentMessages.filter(message => message.react).map(message => message.react.text);
  assert.equal(sent.mimetype, 'video/mp4');
  assert.equal(sent.video.subarray(4, 8).toString(), 'ftyp');
  assert.match(sent.caption, /selesai diproses dan dikompres untuk kualitas HD/);
  assert.deepEqual(reactions, []);
});

test('media processing commands receive automatic start, success, and failure reactions', async () => {
  const sentMessages = [];
  const sock = { sendMessage: async (_to, message) => { sentMessages.push(message); } };
  const msg = { key: { remoteJid: 'user@s.whatsapp.net', id: 'process-id' } };
  assert.equal(shouldReactToProcessing({ name: 'sticker', category: 'sticker' }), true);
  assert.equal(shouldReactToProcessing({ name: 'tiktok', category: 'download' }), true);
  assert.equal(shouldReactToProcessing({ name: 'menu', category: 'menu' }), false);

  await executeWithProcessingReaction(sock, msg.key.remoteJid, msg, { name: 'sticker', category: 'sticker' }, async () => 'done');
  await assert.rejects(executeWithProcessingReaction(
    sock,
    msg.key.remoteJid,
    msg,
    { name: 'hdvideo', category: 'tools' },
    async () => { throw new Error('processing failed'); },
  ), /processing failed/);

  assert.deepEqual(sentMessages.map(message => message.react.text), ['⏳', '✅', '⏳', '❌']);
});

test('.unreg clears registration but preserves progress and prevents bonus farming', async () => {
  const user = {
    registered: true,
    name: 'Pengguna',
    registeredAt: 123,
    registrationBonusClaimed: false,
    limit: 12,
    money: 1400,
    point: 8,
  };
  const updates = [];
  const responses = [];
  const ctx = {
    from: 'user@s.whatsapp.net',
    sender: 'user@s.whatsapp.net',
    senderNumber: '628123456789',
    user,
    config: { prefix: '.', botName: 'Yora Botz' },
    formatMoney: amount => `Rp ${amount}`,
    updateUser: (_sender, changes) => {
      updates.push(changes);
      Object.assign(user, changes);
    },
  };
  const sock = { sendMessage: async (_to, message) => { responses.push(message.text); } };

  await unreg.execute(sock, {}, [], ctx);
  assert.equal(user.registered, false);
  assert.equal(user.name, null);
  assert.equal(user.registeredAt, null);
  assert.equal(user.limit, 12);
  assert.equal(user.money, 1400);
  assert.equal(user.point, 8);

  await daftar.execute(sock, {}, ['Nama', 'Baru'], ctx);
  assert.equal(user.registered, true);
  assert.equal(user.limit, 12);
  assert.equal(user.money, 1400);
  assert.equal(updates[1].registrationBonusClaimed, true);
  assert.match(responses[0], /Saldo, poin, limit, dan progres tetap tersimpan/);
});

test('.ttt challenges a mentioned player and accepts bare-number moves', async () => {
  const firstPlayer = '1111111111@s.whatsapp.net';
  const secondPlayer = '2222222222@s.whatsapp.net';
  const users = {
    [firstPlayer]: { registered: true, money: 1000, point: 0 },
    [secondPlayer]: { registered: true, money: 1000, point: 0 },
  };
  const gameState = {};
  const timers = new Map();
  const sentMessages = [];
  const sock = { sendMessage: async (_to, message) => { sentMessages.push(message); } };
  const commandMessage = {
    key: { remoteJid: 'test@g.us', participant: firstPlayer, id: 'ttt-command' },
    message: { extendedTextMessage: { contextInfo: { mentionedJid: [secondPlayer] } } },
  };
  const createContext = sender => ({
    from: 'test@g.us',
    sender,
    mentioned: [secondPlayer],
    isGroup: () => true,
    user: users[sender],
    getUser: jid => users[jid],
    updateUser: (jid, updates) => Object.assign(users[jid], updates),
    gameState,
    setGameTimeout: (room, callback) => timers.set(room, callback),
    clearGameTimeout: room => timers.delete(room),
    formatMoney: amount => `Rp ${amount}`,
    config: { prefix: '.' },
  });

  await ttt.execute(sock, commandMessage, [], createContext(firstPlayer));
  assert.equal(gameState['test@g.us'].game, 'ttt-pending');
  assert.equal(users[firstPlayer].money, 1000);
  assert.equal(users[secondPlayer].money, 1000);

  await handleTttInput(sock, commandMessage, createContext(firstPlayer), 'terima');
  assert.equal(gameState['test@g.us'].game, 'ttt-pending', 'only the challenged user may accept');
  await handleTttInput(sock, commandMessage, createContext(secondPlayer), 'terima');
  assert.equal(gameState['test@g.us'].game, 'ttt');
  assert.equal(users[firstPlayer].money, 500);
  assert.equal(users[secondPlayer].money, 500);

  for (const [sender, move] of [
    [firstPlayer, '1'], [secondPlayer, '4'], [firstPlayer, '2'],
    [secondPlayer, '5'], [firstPlayer, '3'],
  ]) {
    await handleTttInput(sock, commandMessage, createContext(sender), move);
  }

  assert.equal(gameState['test@g.us'], undefined);
  assert.equal(users[firstPlayer].money, 1500);
  assert.equal(users[firstPlayer].point, 5);
  assert.equal(users[secondPlayer].money, 500);
  assert.ok(sentMessages.some(message => message.text?.includes('TIC TAC TOE')));
});

test('.mute applies an admin-controlled timed mute and .unmute clears it', async () => {
  const admin = '1111111111@s.whatsapp.net';
  const member = '2222222222@s.whatsapp.net';
  const bot = '3333333333@s.whatsapp.net';
  const spamTracker = {};
  const responses = [];
  const sock = {
    user: { id: bot },
    groupMetadata: async () => ({ participants: [
      { id: admin, admin: 'admin' },
      { id: member, admin: null },
      { id: bot, admin: 'admin' },
    ] }),
    sendMessage: async (_to, message) => { responses.push(message); },
  };
  const msg = { key: { remoteJid: 'test@g.us', participant: admin } };
  const ctx = {
    from: 'test@g.us',
    sender: admin,
    mentioned: [member],
    isGroup: () => true,
    isSenderOwner: () => false,
    spamTracker,
  };

  await mute.execute(sock, msg, ['10m'], ctx);
  assert.ok(spamTracker[member].manualMutedUntil > Date.now());
  assert.match(responses[0].text, /10 menit/);

  await unmute.execute(sock, msg, [], ctx);
  assert.equal(spamTracker[member].manualMutedUntil, 0);
  assert.equal(spamTracker[member].mutedUntil, 0);
});

test('AI super-resolution enforces CPU-safe image dimensions', () => {
  assert.doesNotThrow(() => validateAiDimensions(512, 512));
  assert.throws(() => validateAiDimensions(513, 512), /dibatasi ke foto maksimal/);
  assert.throws(() => validateAiDimensions(0, 100), /Dimensi foto tidak valid/);
});