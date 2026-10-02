const pkg = require('../../package.json');

module.exports = {
  name: 'about',
  category: 'info',
  aliases: ['botinfo', 'profilebot', 'tentang'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const uptime = process.uptime();
    const jam = Math.floor(uptime / 3600);
    const menit = Math.floor((uptime % 3600) / 60);
    const detik = Math.floor(uptime % 60);

    const text = `╔══════════════════════════════════════╗
║      🤖  *ABOUT ${config.botName.toUpperCase()}*  🤖
╚══════════════════════════════════════╝

  ◆  🧩  Versi      : *${pkg.version}*
  ◆  👤  Owner      : *${config.ownerName}*
  ◆  📞  Nomor      : *${config.ownerNumber}*
  ◆  🌐  Website    : ${config.website}
  ◆  ⏱️  Uptime     : *${jam}h ${menit}m ${detik}s*
  ◆  🧠  Fitur      : *148 command valid*
  ◆  🛡️  Status     : *Online & stable*

  ${config.botName} adalah bot WhatsApp multipurpose yang dirancang untuk membantu komunitas dengan fitur game, ekonomi, grup, tools, dan premium system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✨ *Rapi, stabil, dan siap dipakai*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(from, { text });
  },
};
