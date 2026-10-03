const assert = require('node:assert/strict');
const test = require('node:test');
const { assertProductName } = require('../lib/license-guard');

test('license guard allows the original product name', () => {
  assert.equal(assertProductName('Yora Botz'), undefined);
});

test('license guard rejects a renamed product', () => {
  assert.throws(() => assertProductName('My WhatsApp Bot'), /botName harus "Yora Botz"/);
  assert.throws(() => assertProductName('yora botz'), /botName harus "Yora Botz"/);
});
