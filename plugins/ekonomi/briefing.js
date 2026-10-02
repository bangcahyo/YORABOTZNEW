function formatCountdown(milliseconds) {
  const totalMinutes = Math.ceil(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}j ${minutes}m` : `${minutes}m`;
}

module.exports = {
  name: 'briefing',
  category: 'ekonomi',
  aliases: ['dailybrief', 'ringkasan'],
  async execute(sock, msg, args, ctx) {
    const { config, from, pushName, user, getExpProgress, formatMoney, isPremium, premiumRemainingDays } = ctx;
    const now = Date.now();
    const progress = getExpProgress(user.exp || 0);
    const dailyCooldown = 24 * 60 * 60 * 1000;
    const dailyRemaining = user.lastDaily ? dailyCooldown - (now - user.lastDaily) : 0;
    const dailyStatus = dailyRemaining > 0
      ? `⏳ Bisa diambil lagi dalam *${formatCountdown(dailyRemaining)}*`
      : `🎁 Reward siap diklaim lewat *${config.prefix}daily*`;
    const premiumStatus = isPremium()
      ? `💎 Premium aktif, sisa *${premiumRemainingDays()} hari*`
      : '🔓 Status Free';
    const progressBar = '█'.repeat(Math.max(0, Math.min(10, Math.floor(progress.percent / 10)))) +
      '░'.repeat(10 - Math.max(0, Math.min(10, Math.floor(progress.percent / 10))));

    const text = `╭━━━〔 ✨ *DAILY BRIEFING* 〕━━━╮
│ 👤 *${user.name || pushName || 'User'}*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📈 *PROGRES*
• Level: *${progress.level}*
• EXP: *${user.exp || 0}* / ${progress.nextLevelExp}
• ${progressBar} *${progress.percent}%*

💰 *EKONOMI*
• Uang: *${formatMoney(user.money || 0)}*
• Limit: *${user.limit || 0}*
• Point: *${user.point || 0}*

${dailyStatus}
${premiumStatus}

⚡ _Ringkasan personal dari ${config.botName}_`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};