module.exports = {
  name: 'tqto', category: 'info', aliases: ['thanks','credit'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    if (!config.tqto) return;
    let txt = `*${config.tqto.title}*\n\n${config.tqto.subtitle}\n\n`;
    config.tqto.contributors.forEach((c, i) => {
      txt += `${i + 1}. *${c.name}*\n   ${c.role}\n`;
      if (c.contact) txt += `   ${c.contact}\n`;
      txt += `\n`;
    });
    txt += `_${config.tqto.footer}_\n\n${config.website}`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  }
};