module.exports = {
  name: 'daily', category: 'ekonomi',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, random, formatMoney, isPremium } = ctx;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const lastDaily = Number(user.lastDaily) || 0;
    const elapsed = now - lastDaily;
    if (lastDaily && elapsed < oneDay) {
      const remaining = oneDay - elapsed;
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      return sock.sendMessage(from, { text: `⏳ Daily sudah diambil!\n\nTunggu *${hours}j ${minutes}m* lagi.` }, { quoted: msg });
    }
    const graceHours = Math.max(24, Number(config.dailyStreak?.graceHours) || 48);
    const streakContinues = lastDaily && elapsed <= graceHours * 60 * 60 * 1000;
    const dailyStreak = streakContinues ? Math.max(0, Number(user.dailyStreak) || 0) + 1 : 1;
    const baseLimit = random([5, 10, 15, 20]);
    const baseMoney = random([500, 1000, 1500, 2000]);
    const moneyMultiplier = isPremium() ? Math.max(1, Number(config.premium?.dailyMoneyMultiplier) || 1) : 1;
    const milestones = config.dailyStreak?.milestones || {};
    const milestone = milestones[dailyStreak] || {};
    const milestoneMoney = Math.max(0, Number(milestone.money) || 0) * moneyMultiplier;
    const milestoneLimit = Math.max(0, Number(milestone.limit) || 0);
    const bonusLimit = baseLimit + milestoneLimit;
    const bonusMoney = baseMoney * moneyMultiplier;
    const totalMoney = bonusMoney + milestoneMoney;
    const nextMilestone = Object.keys(milestones).map(Number).filter((day) => day > dailyStreak).sort((a, b) => a - b)[0];
    updateUser(sender, {
      limit: user.limit + bonusLimit,
      money: user.money + totalMoney,
      lastDaily: now,
      dailyStreak,
    });
    const multiplierNote = moneyMultiplier > 1 ? ` (${moneyMultiplier}x premium)` : '';
    const milestoneText = milestoneMoney || milestoneLimit
      ? `\n🏆 *Milestone ${dailyStreak} hari!*\n+${milestoneLimit} Limit\n+${formatMoney(milestoneMoney)} bonus uang`
      : '';
    const nextText = nextMilestone
      ? `\n🎯 Milestone berikutnya: *${nextMilestone} hari* (${nextMilestone - dailyStreak} klaim lagi)`
      : '\n🏅 Semua milestone saat ini tercapai. Pertahankan streak!';
    const resetText = user.dailyStreak && lastDaily && !streakContinues
      ? '\n↻ Streak sebelumnya terputus; kamu memulai streak baru.'
      : '';
    await sock.sendMessage(from, {
      text: `🎁 *DAILY REWARD*\n🔥 Streak: *${dailyStreak} hari*${resetText}\n\n+${bonusLimit} Limit\n+${formatMoney(bonusMoney)}${multiplierNote}${milestoneText}${nextText}`,
    }, { quoted: msg });
  }
};