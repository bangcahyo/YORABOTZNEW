module.exports = {
  name: 'restartbot',
  category: 'owner',
  aliases: ['restart', 'reboot'],
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner, flushDatabase } = ctx;

    let isOwner = false;
    try { isOwner = isSenderOwner && isSenderOwner(); } catch {}
    if (!isOwner) return;

    await sock.sendMessage(from, {
      text: `🔄 *RESTART BOT*\n\nBot akan restart dalam 5 detik...\n\n⚠️ Kalau panel tidak auto-restart, buka Pterodactyl & klik Start manual.`,
    });

    console.log('\n🔄 RESTART DIMINTA OLEH OWNER\n');
    setTimeout(async () => {
      try {
        if (typeof flushDatabase === 'function') await flushDatabase();
        process.exit(0);
      } catch (err) {
        console.error('❌ Database flush sebelum restart gagal:', err.message);
        await sock.sendMessage(from, { text: `❌ Restart dibatalkan karena database gagal disimpan: ${err.message}` });
      }
    }, 5000);
  },
};