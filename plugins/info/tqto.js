module.exports = {
  name: 'tqto',
  category: 'info',
  aliases: ['thanks', 'credit'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    let txt = `╔══════════════════════════════════════╗
║        🙏  *THANKS TO*  🙏
╚══════════════════════════════════════╝\n\n`;

    if (config.tqto?.contributors?.length) {
      config.tqto.contributors.forEach((c, i) => {
        const nama = typeof c === 'string' ? c : (c.name || 'Unknown');
        txt += `  ${i + 1}. ${nama}\n`;
      });
    }
    txt += `\n🌐 ${config.website}`;
    await sock.sendMessage(from, { text: txt });
  },
};