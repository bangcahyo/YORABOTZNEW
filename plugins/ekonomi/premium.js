module.exports = {
  name: 'premium',
  category: 'ekonomi',
  aliases: ['prem', 'buypremium', 'belipremium', 'cekpremium'],
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, formatMoney, isPremium, premiumRemainingDays, addPremium } = ctx;
    const P = config.premium || {};
    const sub = (args[0] || '').toLowerCase();

    // ===== CEK STATUS =====
    if (sub === 'cek' || sub === 'status' || sub === 'info') {
      const aktif = isPremium();
      let txt = '╔══════════════════════════════════╗\n';
      txt += '║      🅟 *STATUS PREMIUM*         ║\n';
      txt += '╚══════════════════════════════════╝\n\n';
      txt += '👤 Nama   : *' + (user.name || ctx.pushName) + '\n';
      txt += '💎 Status : ' + (aktif ? '*PREMIUM AKTIF* ✅' : '*FREE USER* ⬜') + '\n';
      if (aktif) txt += '⏳ Sisa   : *' + premiumRemainingDays() + ' hari*\n';
      txt += '🅛 Limit  : *' + user.limit + '*\n\n';
      if (!aktif) txt += '📝 Ketik *' + config.prefix + 'premium buy* untuk upgrade!\n\n';
      txt += '_' + config.botName + '_';
      return sock.sendMessage(from, { text: txt }, { quoted: msg });
    }

    // ===== BELI PREMIUM =====
    if (sub === 'buy' || sub === 'beli' || sub === 'upgrade') {
      if (!P.enabled) return sock.sendMessage(from, { text: '❌ Sistem premium sedang dinonaktifkan.' }, { quoted: msg });
      if (isPremium()) {
        return sock.sendMessage(from, { text: '✅ Kamu sudah premium!\n\n⏳ Sisa: *' + premiumRemainingDays() + ' hari*' }, { quoted: msg });
      }
      const harga = P.price || 50000;
      if (user.money < harga) {
        return sock.sendMessage(from, {
          text: '💸 *Uang tidak cukup!*\n\n' +
            '🅟 Harga premium : *' + formatMoney(harga) + '*\n' +
            '💳 Uang kamu     : *' + formatMoney(user.money) + '*\n' +
            '➖ Kurang        : *' + formatMoney(harga - user.money) + '*\n\n' +
            'Kumpulkan uang dari game & daily dulu ya!\n\n' +
            '_' + config.botName + '_',
        }, { quoted: msg });
      }
      const days = P.durationDays || 30;
      updateUser(sender, { money: user.money - harga });
      const until = addPremium(sender, days);
      const d = new Date(until);
      return sock.sendMessage(from, {
        text: '╔══════════════════════════════════╗\n' +
          '║   🎉 *PREMIUM BERHASIL DIBELI*   ║\n' +
          '╚══════════════════════════════════╝\n\n' +
          '💎 Durasi  : *' + days + ' hari*\n' +
          '💸 Dibayar : *' + formatMoney(harga) + '*\n' +
          '📅 Aktif s/d: *' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '*\n\n' +
          '✅ Terima kasih! Nikmati semua fitur premium 🅟\n\n' +
          '_' + config.botName + '_',
      }, { quoted: msg });
    }

    // ===== INFO PREMIUM (default) =====
    const aktif = isPremium();
    let txt = '╔══════════════════════════════════╗\n';
    txt += '║       🅟 *PREMIUM MEMBER*        ║\n';
    txt += '╚══════════════════════════════════╝\n\n';
    txt += '💎 *Keuntungan Premium:*\n\n';
    txt += '  🅟 Buka semua fitur download\n';
    txt += '     (YouTube, TikTok, Instagram)\n';
    txt += '  🅛 Limit harian *' + (P.dailyLimit || 100) + '* (free: ' + config.defaultLimit + ')\n';
    txt += '  💰 Hadiah daily *' + (P.dailyMoneyMultiplier || 2) + 'x* lipat\n';
    txt += '  ⭐ EXP per pesan *' + (P.expMultiplier || 2) + 'x* lipat\n';
    txt += '  🛒 Diskon shop *' + (P.shopDiscount || 20) + '%*\n';
    txt += '  🚀 Bebas limit hingga *' + (P.maxLimit || 9999) + '*\n\n';
    txt += '━━━━━━━━━━━━━━━━━━━━━━\n';
    txt += '💵 Harga   : *' + formatMoney(P.price || 50000) + '*\n';
    txt += '⏳ Durasi  : *' + (P.durationDays || 30) + ' hari*\n';
    txt += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
    if (aktif) {
      txt += '✅ Status kamu: *PREMIUM AKTIF*\n';
      txt += '⏳ Sisa: *' + premiumRemainingDays() + ' hari*\n\n';
    } else {
      txt += '📝 Beli dengan uang bot:\n';
      txt += '    *' + config.prefix + 'premium buy*\n\n';
      txt += 'Atau hubungi owner:\n';
      txt += '👑 ' + config.ownerName + '\n📞 ' + config.ownerNumber + '\n\n';
    }
    txt += '_' + config.botName + '_';
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
