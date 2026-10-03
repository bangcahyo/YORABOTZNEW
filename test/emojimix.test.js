const assert = require('node:assert/strict');
const test = require('node:test');
const sharp = require('sharp');
const config = require('../config');
const plugin = require('../plugins/sticker/emojimix');

test('emojimix falls back to an available Emoji Kitchen dataset without an API key', async () => {
  const originalFetch = global.fetch;
  const requests = [];
  const image = await sharp(Buffer.from(
    '<svg width="64" height="64"><circle cx="32" cy="32" r="30" fill="#ff8a00"/></svg>',
  )).png().toBuffer();
  let sent;

  global.fetch = async url => {
    requests.push(String(url));
    if (String(url).includes('/20230810/')) {
      return new Response('', { status: 404 });
    }
    return new Response(image, {
      status: 200,
      headers: { 'content-type': 'image/png' },
    });
  };

  try {
    await plugin.execute(
      { sendMessage: async (_jid, message) => { sent = message; } },
      { key: { id: 'test' } },
      ['😀+🔥'],
      { config, from: 'test@s.whatsapp.net' },
    );
  } finally {
    global.fetch = originalFetch;
  }

  assert.equal(requests.length, 2);
  assert.ok(requests[0].includes('/20230810/'));
  assert.ok(requests[1].includes('/20201001/'));
  assert.ok(Buffer.isBuffer(sent.sticker));
  assert.equal((await sharp(sent.sticker).metadata()).format, 'webp');
});

test('emojimix reports unsupported combinations clearly', async () => {
  const originalFetch = global.fetch;
  let sent;
  global.fetch = async () => new Response('', { status: 404 });

  try {
    await plugin.execute(
      { sendMessage: async (_jid, message) => { sent = message; } },
      { key: { id: 'test' } },
      ['😀+😎'],
      { config, from: 'test@s.whatsapp.net' },
    );
  } finally {
    global.fetch = originalFetch;
  }

  assert.match(sent.text, /Kombinasi emoji ini tidak tersedia/);
  assert.match(sent.text, /😀\+🔥/);
});
