const { getShopItems } = require('../../lib/shop');
const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menuekonomi',
  category: 'menu',
  aliases: ['menueco'],
  async execute(sock, msg, args, ctx) {
    const { config, from, formatMoney, pluginList } = ctx;
    const premium = config.premium || {};
    const standardItems = getShopItems(config, false);
    const premiumPrices = new Map(getShopItems(config, true).map(item => [item.key, item.finalPrice]));

    const menuText = renderMenu({
      botName: config.botName,
      title: 'EKONOMI & TOKO',
      prefix: config.prefix,
      pluginList,
      includeCategories: ['ekonomi'],
      sections: [
        {
          icon: '👤',
          title: 'AKUN & PROFIL',
          items: [
            `${config.prefix}daftar <nama> — daftar akun`,
            `${config.prefix}profile — lihat profil`,
            `${config.prefix}limit — cek sisa limit`,
            `${config.prefix}limit info — info penggunaan limit`,
            `${config.prefix}point — cek poin`,
            `${config.prefix}uang — cek saldo`,
          ],
        },
        {
          icon: '💎',
          title: 'PREMIUM',
          items: [
            `${config.prefix}premium — info dan status Premium`,
            `${config.prefix}premium buy — beli Premium`,
            `${config.prefix}premium cek — cek masa aktif`,
            `${config.prefix}premiumcard — kartu profil`,
            `${config.prefix}briefing — ringkasan akun`,
            `Harga: *${formatMoney(premium.price || 50000)}* · Masa aktif: *${premium.durationDays || 30} hari*`,
            `Limit harian: *${premium.dailyLimit || 100}* · Diskon toko: *${premium.shopDiscount || 20}%*`,
            `Bonus harian: *${premium.dailyMoneyMultiplier || 2}× uang* · EXP: *${premium.expMultiplier || 2}×*`,
          ],
        },
        {
          icon: '🎁',
          title: 'HADIAH & TRANSFER',
          items: [
            `${config.prefix}daily — klaim hadiah harian`,
            `${config.prefix}transfer @user <jumlah> — kirim uang`,
          ],
        },
        {
          icon: '🛒',
          title: 'TOKO',
          items: [
            `${config.prefix}shop — lihat produk dan harga`,
            `${config.prefix}buy <item> — beli produk`,
            ...standardItems.map(item =>
              `${item.name}: ${formatMoney(item.price)} · Premium: ${formatMoney(premiumPrices.get(item.key))}`,
            ),
          ],
        },
      ],
      footer: ['🅟 = Fitur Premium · 🅛 = Menggunakan limit'],
    });

    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};
