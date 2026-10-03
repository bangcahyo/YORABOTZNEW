const ITEMS = [
  {
    key: 'vip',
    name: 'Paket VIP',
    price: 50000,
    description: '+100 limit, +Rp 50.000, +500 point',
    effect: { limit: 100, money: 50000, point: 500 },
  },
  {
    key: 'limit booster',
    name: 'Limit Booster',
    price: 10000,
    description: '+50 limit',
    effect: { limit: 50 },
  },
  {
    key: 'money booster',
    name: 'Money Booster',
    price: 15000,
    description: '+Rp 25.000',
    effect: { money: 25000 },
  },
  {
    key: 'point booster',
    name: 'Point Booster',
    price: 20000,
    description: '+100 point',
    effect: { point: 100 },
  },
];

function getShopItems(config, isPremium) {
  const discountPercent = isPremium
    ? Math.max(0, Math.min(100, Number(config.premium?.shopDiscount) || 0))
    : 0;

  return ITEMS.map(item => ({
    ...item,
    effect: { ...item.effect },
    discountPercent,
    finalPrice: Math.floor(item.price * (100 - discountPercent) / 100),
  }));
}

module.exports = { getShopItems };
