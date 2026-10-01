module.exports = {
  name: 'daftar',
  category: 'ekonomi',
  aliases: ['register', 'reg'],
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, senderNumber, user, updateUser, formatMoney } = ctx;

    // Sudah terdaftar?
    if (user.registered) {
      return sock.sendMessage(from, {
        text: `✅ *Kamu sudah terdaftar!*\n\n👤 Nama  : *${user.name || '-'}*\n📞 Nomor : *${senderNumber}*\n📅 Sejak : ${user.registeredAt ? new Date(user.registeredAt).toLocaleString('id-ID') : '-'}\n\n💡 Ketik *${config.prefix}profile* untuk lihat profilmu.`,
      }, { quoted: msg });
    }

    // Ambil nama dari argumen
    const nama = args.join(' ').trim();

    if (!nama) {
      return sock.sendMessage(from, {
        text: `📝 *REGISTRASI*\n\nFormat: *${config.prefix}daftar <namamu>*\n\nContoh:\n*${config.prefix}daftar ${ctx.pushName || 'Budi'}*\n\n⚠️ Nama minimal 3 huruf & maksimal 25 huruf.`,
      }, { quoted: msg });
    }

    if (nama.length < 3 || nama.length > 25) {
      return sock.sendMessage(from, {
        text: '❌ *Nama tidak valid!*\n\nNama harus *3 - 25 huruf*.',
      }, { quoted: msg });
    }

    // Simpan data registrasi + bonus pendaftaran
    const bonusLimit = 5;
    const bonusMoney = 500;

    updateUser(sender, {
      name: nama,
      registered: true,
      registeredAt: Date.now(),
      limit: (user.limit || 0) + bonusLimit,
      money: (user.money || 0) + bonusMoney,
    });

    await sock.sendMessage(from, {
      text: `╔══════════════════════════════════╗\n║      ✅  *REGISTRASI BERHASIL*    ║\n╚══════════════════════════════════╝\n\n👤 Nama  : *${nama}*\n📞 Nomor : *${senderNumber}*\n\n╭──────────────────────────────────╮\n│  🎁  *BONUS PENDAFTARAN*          │\n╰──────────────────────────────────╯\n\n  ◆  🎫  +${bonusLimit} Limit\n  ◆  💰  +${formatMoney(bonusMoney)}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✅ Sekarang kamu bisa akses *semua fitur* bot!\n\n💡 Coba: *${config.prefix}menu* | *${config.prefix}daily* | *${config.prefix}profile*\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n  ⚡  _${config.botName}_`,
    }, { quoted: msg });
  },
};
