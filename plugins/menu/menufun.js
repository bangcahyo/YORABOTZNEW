module.exports = {
  name: 'menufun', category: 'menu', aliases: ['menuhiburan'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    await sock.sendMessage(from, { text: `╭━━━「 🎭 *MENU HIBURAN* 」━━━\n\n╭─「 🎭 *PUISI & PANTUN* 」\n│ 🎭 ${config.prefix}pantun\n│ 📜 ${config.prefix}puisi\n│ 💕 ${config.prefix}puisi cinta\n│ 😢 ${config.prefix}puisi sedih\n│ 🔥 ${config.prefix}puisi semangat\n│ 🏔️ ${config.prefix}puisi alam\n│ 👥 ${config.prefix}puisi sahabat\n╰━━━━━━━━━━━━━━━━━━━━\n\n╭─「 💬 *MOTIVASI* 」\n│ 💬 ${config.prefix}quote\n│ 🔥 ${config.prefix}motivasi\n│ 🌟 ${config.prefix}katabijak\n╰━━━━━━━━━━━━━━━━━━━━\n\n╭─「 🔮 *RAMALAN* 」\n│ 🔮 ${config.prefix}ramalan\n│ 💍 ${config.prefix}kapankahnikah\n╰━━━━━━━━━━━━━━━━━━━━\n\n╭─「 💬 *TRUTH OR DARE* 」\n│ 💬 ${config.prefix}truth\n╰━━━━━━━━━━━━━━━━━━━━` }, { quoted: msg });
  }
};