module.exports = {
  name: 'tqto',
  category: 'info',
  aliases: ['thanks', 'credit'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;

    let txt = `╔══════════════════════════════════╗
║      🙏 *THANKS TO*
╚══════════════════════════════════╝

`;

    if (config.tqto?.contributors?.length) {
      config.tqto.contributors.forEach((c, i) => {
        txt += `${i + 1}. ${c}\n`;
      });
    }

    txt += `\n🌐 ${config.website}`;
    await sock.sendMessage(from, { text: txt });
  },
};