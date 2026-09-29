module.exports = {
  name: 'menufun',
  category: 'menu',
  aliases: ['menuhiburan'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;

    const menuText = `╔══════════════════════════════════╗
║      🎭 *MENU HIBURAN*
╚══════════════════════════════════╝

🎭 *PUISI & PANTUN*
${config.prefix}pantun
${config.prefix}puisi

💬 *MOTIVASI*
${config.prefix}quote
${config.prefix}motivasi
${config.prefix}katabijak

🔮 *RAMALAN*
${config.prefix}ramalan
${config.prefix}kapankahnikah
${config.prefix}jodoh @user
${config.prefix}sifat <nama>

💬 *TRUTH OR DARE*
${config.prefix}truth`;

    await sock.sendMessage(from, { text: menuText });
  },
};