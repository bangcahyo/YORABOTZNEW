module.exports = {
  name: 'shop', category: 'ekonomi',
  async execute(sock, msg, args, ctx) {
    const { config, from, formatMoney } = ctx;
    const items = [
      { name: 'VIP', price: 50000, desc: 'Akses semua fitur VIP' },
      { name: 'Limit Booster', price: 10000, desc: '+50 Limit' },
      { name: 'Money Booster', price: 15000, desc: '+Rp 25.000' },
      { name: 'Point Booster', price: 20000, desc: '+100 Point' },
    ];
    let txt = '🛒 *TOKO ITEM*\n\n';
    items.forEach((it, i) => { txt += `${i + 1}. *${it.name}*\n   ${formatMoney(it.price)} - ${it.desc}\n\n`; });
    txt += `Beli: *${config.prefix}buy <nama>*`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  }
};