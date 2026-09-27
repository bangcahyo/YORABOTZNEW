module.exports = {
  name: 'daily', category: 'ekonomi',
  async execute(sock, msg, args, ctx) {
    const { from, sender, user, updateUser, random, formatMoney } = ctx;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (user.lastDaily && now - user.lastDaily < oneDay) {
      const remaining = oneDay - (now - user.lastDaily);
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      return sock.sendMessage(from, { text: `⏳ Daily sudah diambil!\n\nTunggu *${hours}j ${minutes}m* lagi.` }, { quoted: msg });
    }
    const bonusLimit = random([5, 10, 15, 20]);
    const bonusMoney = random([500, 1000, 1500, 2000]);
    updateUser(sender, { limit: user.limit + bonusLimit, money: user.money + bonusMoney, lastDaily: now });
    await sock.sendMessage(from, { text: `🎁 *DAILY REWARD*\n\n+${bonusLimit} Limit\n+${formatMoney(bonusMoney)}` }, { quoted: msg });
  }
};