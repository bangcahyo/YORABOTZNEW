const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const poll = require('../plugins/group/poll');
const qr = require('../plugins/tools/qr');
const ship = require('../plugins/fun/ship');
const hd = require('../plugins/tools/hd');
const hdvideo = require('../plugins/tools/hdvideo');
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

test('AI super-resolution enforces CPU-safe image dimensions', () => {
  assert.doesNotThrow(() => validateAiDimensions(512, 512));
  assert.throws(() => validateAiDimensions(513, 512), /dibatasi ke foto maksimal/);
  assert.throws(() => validateAiDimensions(0, 100), /Dimensi foto tidak valid/);
});