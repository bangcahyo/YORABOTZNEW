module.exports = {
  name: 'restartbot',
  category: 'owner',
  aliases: ['restart', 'reboot'],
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner } = ctx;

    let isOwner = false;
    try { isOwner = isSenderOwner && isSenderOwner(); } catch {}
    if (!isOwner) return;

    await sock.sendMessage(from, {
      text: `🔄 *RESTART BOT*\n\nBot akan restart dalam 5 detik...\n\n⚠️ Kalau panel tidak auto-restart, buka Pterodactyl & klik Start manual.`,
    });

    console.log('\n🔄 RESTART DIMINTA OLEH OWNER\n');
    setTimeout(() => process.exit(0), 5000);
  },
};