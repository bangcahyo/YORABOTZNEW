module.exports = {
  name: 'menuowner',
  category: 'menu',
  aliases: ['menuown'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;

    let isOwner = false;
    try { isOwner = ctx.isSenderOwner && ctx.isSenderOwner(); } catch {}

    if (!isOwner) {
      return sock.sendMessage(from, {
        text: `❌ *AKSES DITOLAK*\n\n👑 ${config.ownerName}\n📞 ${config.ownerNumber}`,
      });
    }

    const menuText = `╔══════════════════════════════════╗
║      👑 *MENU OWNER*
╚══════════════════════════════════╝

👥 *KELOLA USER*
${config.prefix}addlimit @user
${config.prefix}addmoney @user
${config.prefix}addpoint @user
${config.prefix}resetuser @user

📢 *KOMUNIKASI*
${config.prefix}broadcast <teks>

🔒 *MODE BOT*
${config.prefix}self
${config.prefix}public
${config.prefix}mode

⚙️ *SYSTEM*
${config.prefix}runtime
${config.prefix}ping`;

    await sock.sendMessage(from, { text: menuText });
  },
};