const assert = require('node:assert/strict');
const test = require('node:test');
const poll = require('../plugins/group/poll');
const qr = require('../plugins/tools/qr');
const ship = require('../plugins/fun/ship');

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