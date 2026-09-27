module.exports = {
  name: 'buy', category: 'ekonomi',
  async execute(sock, msg, args, ctx) {
    const { from, sender, user, updateUser, formatMoney } = ctx;
    const itemName = args.join(' ').toLowerCase();
    const items = {
      'vip': { price: 50000, effect: { limit: 100, money: 50000, point: 500 } },
      'limit booster': { price: 10000, effect: { limit: 50 } },
      'money booster': { price: 15000, effect: { money: 25000 } },
      'point booster': { price: 20000, effect: { point: 100 } },
    };
    const item = items[itemName];
    if (!item) return sock.sendMessage(from, { text: '❌ Item tidak ditemukan!' }, { quoted: msg });
    if (user.money < item.price) return sock.sendMessage(from, { text: `❌ Uang tidak cukup! Harga: ${formatMoney(item.price)}` }, { quoted: msg });
    const newData = { money: user.money - item.price };
    for (const [k, v] of Object.entries(item.effect)) newData[k] = (user[k] || 0) + v;
    updateUser(sender, newData);
    await sock.sendMessage(from, { text: `✅ *PEMBELIAN BERHASIL!*\n\nItem: ${itemName}\nHarga: ${formatMoney(item.price)}` }, { quoted: msg });
  }
};