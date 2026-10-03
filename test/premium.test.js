const assert = require('node:assert/strict');
const test = require('node:test');
const { getShopItems } = require('../lib/shop');
const shopPlugin = require('../plugins/ekonomi/shop');
const buyPlugin = require('../plugins/ekonomi/buy');

const config = {
  prefix: '.',
  premium: { enabled: true, shopDiscount: 20 },
};

test('shop prices apply configured Premium discount consistently', () => {
  const freePrices = getShopItems(config, false);
  const premiumPrices = getShopItems(config, true);

  assert.equal(freePrices.find(item => item.key === 'limit booster').finalPrice, 10000);
  assert.equal(premiumPrices.find(item => item.key === 'limit booster').finalPrice, 8000);
  assert.equal(premiumPrices.find(item => item.key === 'vip').finalPrice, 40000);
});

test('shop display and purchase receipt use the same Premium price', async () => {
  let shopText;
  await shopPlugin.execute(
    { sendMessage: async (_jid, message) => { shopText = message.text; } },
    {},
    [],
    {
      config,
      from: 'test@s.whatsapp.net',
      formatMoney: value => `Rp ${Number(value).toLocaleString('id-ID')}`,
      isPremium: () => true,
    },
  );
  assert.match(shopText, /Rp 10\.000/);
  assert.match(shopText, /Rp 8\.000/);

  const user = { money: 10000, limit: 5 };
  let receipt;
  await buyPlugin.execute(
    { sendMessage: async (_jid, message) => { receipt = message.text; } },
    {},
    ['limit', 'booster'],
    {
      config,
      from: 'test@s.whatsapp.net',
      sender: 'test@s.whatsapp.net',
      user,
      updateUser: (_jid, updates) => Object.assign(user, updates),
      formatMoney: value => `Rp ${Number(value).toLocaleString('id-ID')}`,
      isPremium: () => true,
    },
  );

  assert.equal(user.money, 2000);
  assert.equal(user.limit, 55);
  assert.match(receipt, /Harga: Rp 8\.000/);
  assert.match(receipt, /Diskon premium: 20%/);
  assert.match(receipt, /Saldo tersisa: Rp 2\.000/);
});

test('free members pay the undiscounted item price', async () => {
  const user = { money: 10000, limit: 5 };
  let receipt;
  await buyPlugin.execute(
    { sendMessage: async (_jid, message) => { receipt = message.text; } },
    {},
    ['limit', 'booster'],
    {
      config,
      from: 'test@s.whatsapp.net',
      sender: 'test@s.whatsapp.net',
      user,
      updateUser: (_jid, updates) => Object.assign(user, updates),
      formatMoney: value => `Rp ${Number(value).toLocaleString('id-ID')}`,
      isPremium: () => false,
    },
  );

  assert.equal(user.money, 0);
  assert.equal(user.limit, 55);
  assert.match(receipt, /Harga: Rp 10\.000/);
  assert.doesNotMatch(receipt, /Diskon premium/);
});
