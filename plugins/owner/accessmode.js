const config = require('../../config');

module.exports = {
  name: 'accessmode',
  category: 'owner',
  aliases: ['access', 'botaccess', 'modeaccess'],
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner } = ctx;
    if (!isSenderOwner || !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Hanya owner yang bisa mengubah akses bot.' }, { quoted: msg });
    }

    const mode = (args[0] || '').toLowerCase();

    if (mode === 'self' || mode === 'private') {
      config.botMode = 'self';
      if (config.ownerAlerts?.enabled !== false && config.ownerAlerts?.onModeChange !== false && ctx.notifyOwner) {
        ctx.notifyOwner('🔒 *MODE BOT DIUBAH*\n\nStatus baru: *SELF*\nDiubah oleh: *' + senderNumber + '*');
      }
      return sock.sendMessage(from, { text: '🏠 *ACCESS MODE: SELF*\n\nBot hanya merespon owner.' }, { quoted: msg });
    }

    if (mode === 'public' || mode === 'all' || mode === 'global') {
      config.botMode = 'public';
      if (config.ownerAlerts?.enabled !== false && config.ownerAlerts?.onModeChange !== false && ctx.notifyOwner) {
        ctx.notifyOwner('🔓 *MODE BOT DIUBAH*\n\nStatus baru: *PUBLIC*\nDiubah oleh: *' + senderNumber + '*');
      }
      return sock.sendMessage(from, { text: '🌐 *ACCESS MODE: PUBLIC*\n\nBot merespon semua user.' }, { quoted: msg });
    }

    const current = (config.botMode || 'public').toUpperCase();
    const text = `🔐 *BOT ACCESS MODE*\n\n` +
      `Saat ini: *${current}*\n\n` +
      `Pilih:
• ${config.prefix}accessmode self
• ${config.prefix}accessmode public

Mode self = hanya owner.
Mode public = semua user bisa akses.`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
