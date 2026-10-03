module.exports = {
  name: 'alerts',
  category: 'owner',
  aliases: ['owneralerts', 'notify', 'notifikasi'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner } = ctx;
    if (!isSenderOwner || !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Hanya owner yang bisa mengatur notifikasi bot.' }, { quoted: msg });
    }

    const sub = (args[0] || '').toLowerCase();
    const ownerAlerts = config.ownerAlerts || {};

    if (sub === 'on' || sub === 'enable') {
      config.ownerAlerts = { ...ownerAlerts, enabled: true };
      return sock.sendMessage(from, { text: '✅ *OWNER ALERTS AKTIF.*\n\nNotifikasi akan dikirim ke owner saat event penting terjadi.' }, { quoted: msg });
    }

    if (sub === 'off' || sub === 'disable') {
      config.ownerAlerts = { ...ownerAlerts, enabled: false };
      return sock.sendMessage(from, { text: '❌ *OWNER ALERTS NONAKTIF.*\n\nOwner tidak akan menerima notifikasi otomatis.' }, { quoted: msg });
    }

    if (sub === 'test') {
      const ok = ctx.notifyOwner
        ? await ctx.notifyOwner('🧪 *TEST OWNER ALERT*\n\nNotifikasi berhasil dikirim dari bot.')
        : false;
      return sock.sendMessage(from, { text: ok ? '✅ Test notifikasi berhasil dikirim ke owner.' : '⚠️ Tidak dapat mengirim test notifikasi.' }, { quoted: msg });
    }

    const text = `🔔 *OWNER ALERTS*\n\n` +
      `Status: *${config.ownerAlerts?.enabled === false ? 'OFF' : 'ON'}*\n\n` +
      `Pengaturan:\n` +
      `• ${config.prefix}alerts on\n` +
      `• ${config.prefix}alerts off\n` +
      `• ${config.prefix}alerts test\n\n` +
      `Event yang akan dipantau:\n` +
      `• mode bot berubah\n` +
      `• whitelist berubah\n` +
      `• command tidak dikenal\n` +
      `• event keamanan penting`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
