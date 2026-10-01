module.exports = {
  name: 'addpremium',
  category: 'owner',
  aliases: ['setpremium', 'givepremium'],
  async execute(sock, msg, args, ctx) {
    const { config, from, mentioned, addPremium, isSenderOwner, formatDate, pushName } = ctx;
    if (!isSenderOwner()) return;

    // Target: mention atau reply
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant
      || msg.message?.extendedTextMessage?.contextInfo?.participantAlt;
    let target = (mentioned && mentioned[0]) || quoted;
    if (!target) {
      return sock.sendMessage(from, {
        text: '📝 *CARA PAKAI*\n\n' +
          config.prefix + 'addpremium @user <hari>\n' +
          'atau reply pesan user lalu:\n' +
          config.prefix + 'addpremium <hari>\n\n' +
          'Contoh: ' + config.prefix + 'addpremium @user 30',
      }, { quoted: msg });
    }

    // Cari angka hari (args bisa [@user, 30] atau [30])
    let days = 0;
    for (const a of args) {
      const n = parseInt(a.replace(/[^0-9]/g, ''));
      if (n > 0) { days = n; break; }
    }
    if (!days) days = config.premium?.durationDays || 30;

    const until = addPremium(target, days);
    await sock.sendMessage(from, {
      text: '✅ *PREMIUM DITAMBAHKAN*\n\n' +
        '👤 User   : @' + target.split('@')[0] + '\n' +
        '💎 Durasi : *' + days + ' hari*\n' +
        '📅 Aktif s/d: *' + formatDate(until) + '*',
      mentions: [target],
    }, { quoted: msg });
  },
};
