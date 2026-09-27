module.exports = {
  name: 'menuekonomi', category: 'menu', aliases: ['menueco'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    await sock.sendMessage(from, { text: `╭━━━「 💰 *MENU EKONOMI* 」━━━\n\n╭─「 👤 *PROFIL* 」\n│ 👤 ${config.prefix}profile\n│ 🎫 ${config.prefix}limit\n│ ⭐ ${config.prefix}point\n│ 💰 ${config.prefix}uang\n╰━━━━━━━━━━━━━━━━━━━━\n\n╭─「 🎁 *REWARD* 」\n│ 🎁 ${config.prefix}daily\n│ 💸 ${config.prefix}transfer @user <jumlah>\n╰━━━━━━━━━━━━━━━━━━━━\n\n╭─「 🛒 *SHOP* 」\n│ 🛒 ${config.prefix}shop\n│ 🛍️ ${config.prefix}buy <item>\n╰━━━━━━━━━━━━━━━━━━━━\n\n╭─「 ℹ️ *INFO* 」\n│ 💬 ${config.prefix}group\n│ 👑 ${config.prefix}owner\n│ 🙏 ${config.prefix}tqto\n╰━━━━━━━━━━━━━━━━━━━━` }, { quoted: msg });
  }
};