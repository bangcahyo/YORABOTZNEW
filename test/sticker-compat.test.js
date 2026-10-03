const assert = require('node:assert/strict');
const test = require('node:test');
const sharp = require('sharp');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

test('sticker formatter converts image buffers with patched file-type and current sharp', async () => {
  const input = await sharp(Buffer.from(
    '<svg width="64" height="64"><rect width="64" height="64" fill="#c4a66a"/></svg>',
  )).png().toBuffer();
  const output = await new Sticker(input, {
    pack: 'Yora Test',
    author: 'Test',
    type: StickerTypes.FULL,
    quality: 70,
  }).toBuffer();
  const metadata = await sharp(output).metadata();

  assert.equal(metadata.format, 'webp');
  assert.equal(metadata.width, 512);
  assert.equal(metadata.height, 512);
});
