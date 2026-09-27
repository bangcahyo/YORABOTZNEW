module.exports = {
  name: 'group', category: 'info', aliases: ['grup','grupresmi'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    await sock.sendMessage(from, {
      text: `🔗 *GRUP RESMI*\n\n📛 ${config.officialGroup.name}\n📝 ${config.officialGroup.desc}\n\nLink:\n${config.officialGroup.link}\n\n👑 Owner: ${config.ownerName}\n🌐 Website: ${config.website}`
    }, { quoted: msg });
  }
};