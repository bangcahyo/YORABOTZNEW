module.exports = {
  name: 'reloadplugins',
  category: 'owner',
  aliases: ['reloadp', 'reload'],
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner, reloadPlugins } = ctx;

    let isOwner = false;
    try { isOwner = isSenderOwner && isSenderOwner(); } catch {}
    if (!isOwner) return;

    await sock.sendMessage(from, { text: '🔄 Reloading plugins...' });

    try {
      if (typeof reloadPlugins !== 'function') throw new Error('Plugin loader tidak tersedia.');
      const result = reloadPlugins();
      await sock.sendMessage(from, {
        text: `${result.applied ? '✅ *RELOAD SELESAI*' : '⚠️ *RELOAD DIBATALKAN*'}\n\n📦 Plugin aktif: ${result.loaded}\n❌ Gagal dimuat: ${result.failed}\n\n${result.applied ? 'Perubahan command sudah diterapkan.' : 'Daftar plugin sebelumnya tetap aktif; periksa error di console sebelum mencoba lagi.'}`,
      });
    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Error: ${e.message}` });
    }
  },
};