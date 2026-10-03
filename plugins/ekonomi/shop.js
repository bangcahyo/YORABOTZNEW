const { getShopItems } = require('../../lib/shop');

module.exports = {
  name: 'shop', category: 'ekonomi',
  async execute(sock, msg, args, ctx) {
    const { config, from, formatMoney, isPremium } = ctx;
    const items = getShopItems(config, isPremium());
    let txt = '🛒 *TOKO ITEM*\n\n';
    items.forEach((it, i) => {
      const priceText = it.discountPercent
        ? `~${formatMoney(it.price)}~ → *${formatMoney(it.finalPrice)}* (diskon ${it.discountPercent}%)`
        : `*${formatMoney(it.finalPrice)}*`;
      txt += `${i + 1}. *${it.name}*\n   ${priceText} · ${it.description}\n\n`;
    });
    if (!isPremium() && config.premium?.enabled) {
      txt += `💎 Member premium mendapat diskon ${config.premium.shopDiscount}%.\n\n`;
    }
    txt += `Beli: *${config.prefix}buy <nama>*`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  }
};