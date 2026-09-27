module.exports = {
  name: 'menu',
  category: 'menu',
  aliases: ['help'],
  async execute(sock, msg, args, ctx) {
    const { config, from, user, formatMoney, sendVoiceNote, sendImageCaption } = ctx;

    let tqtoText = '';
    if (config.tqto?.contributors?.length > 0) {
      tqtoText += `\n🌟 *${config.tqto.title}*\n`;
      config.tqto.contributors.forEach((c, i) => {
        tqtoText += `${i + 1}. ${c.name}\n`;
      });
    }

    const menu = `
╭━━━「 🤖 *${config.botName}* 」━━━
┃ 📌 Mode    : ${config.botMode === 'self' ? '🏠 SELF' : '🌐 PUBLIC'}
┃ 👑 Owner   : ${config.ownerName}
┃ 📞 Nomor   : ${config.ownerNumber}
┃ 🌐 Website : ${config.website}
┃ 💬 Grup    : ${config.officialGroup.link}
╰━━━━━━━━━━━━━━━━━━━━

📂 *DAFTAR MENU*

🎮 ${config.prefix}menugame
🎭 ${config.prefix}menufun
💰 ${config.prefix}menuekonomi
📊 ${config.prefix}menulevel
🛡️ ${config.prefix}menugroup
👑 ${config.prefix}menuowner

╭─「 📊 *INFO KAMU* 」
│ 🎫 Limit : ${user.limit}
│ 💰 Uang  : ${formatMoney(user.money)}
│ ⭐ Point : ${user.point}
╰━━━━━━━━━━━━━━━━━━━━
${tqtoText}
    `.trim();

    const mode = config.sendMenuAs || 'both';
    if (mode === 'voice' || mode === 'both') {
      await sendVoiceNote(sock, from, config.voiceMenu, config.voiceMenuUrl, msg);
    }
    if (mode === 'text' || mode === 'both') {
      const ok = await sendImageCaption(sock, from, config.menuImage, config.menuImageUrl, menu, msg);
      if (!ok) await sock.sendMessage(from, { text: menu }, { quoted: msg });
    }
  }
};