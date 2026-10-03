const { getShopItems } = require('../../lib/shop');

module.exports = {
  name: 'buy', category: 'ekonomi',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, formatMoney, isPremium } = ctx;
    const itemName = args.join(' ').toLowerCase().replace(/\s+/g, ' ').trim();
    const item = getShopItems(config, isPremium()).find(entry => entry.key === itemName);
    if (!item) return sock.sendMessage(from, { text: '❌ Item tidak ditemukan!' }, { quoted: msg });
    if (user.money < item.finalPrice) {
      return sock.sendMessage(from, {
        text: `❌ Uang tidak cukup!\n\nHarga ${item.name}: ${formatMoney(item.finalPrice)}\nSaldo kamu: ${formatMoney(user.money)}${item.discountPercent ? `\n💎 Harga sudah termasuk diskon premium ${item.discountPercent}%.` : ''}`,
      }, { quoted: msg });
    }
    const balanceAfter = user.money - item.finalPrice;
    const newData = { money: user.money - item.finalPrice };
    for (const [k, v] of Object.entries(item.effect)) newData[k] = (user[k] || 0) + v;
    updateUser(sender, newData);
    await sock.sendMessage(from, {
      text: `✅ *PEMBELIAN BERHASIL!*\n\nItem: ${item.name}\nHarga: ${formatMoney(item.finalPrice)}${item.discountPercent ? `\n💎 Diskon premium: ${item.discountPercent}%` : ''}\nSaldo tersisa: ${formatMoney(balanceAfter)}`,
    }, { quoted: msg });
  }
};