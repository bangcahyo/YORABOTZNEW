module.exports = {
  name: 'botinfo', category: 'owner', aliases: ['info'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const uptime = process.uptime();
    const jam = Math.floor(uptime / 3600);
    const menit = Math.floor((uptime % 3600) / 60);
    await sock.sendMessage(from, {
      text: `ℹ️ *INFO BOT*\n\n🤖 ${config.botName}\n📞 ${config.botNumber}\n👑 ${config.ownerName}\n📞 ${config.ownerNumber}\n🌐 ${config.website}\n📌 Mode: ${config.botMode.toUpperCase()}\n⏱️ Uptime: ${jam}j ${menit}m\n💾 Session: ./${config.sessionName}/`
    }, { quoted: msg });
  }
};