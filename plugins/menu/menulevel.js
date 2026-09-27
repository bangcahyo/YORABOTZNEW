module.exports = {
  name: 'menulevel', category: 'menu',
  async execute(sock, msg, args, ctx) {
    const { config, from, formatMoney } = ctx;
    await sock.sendMessage(from, { text: `╭━━━「 📊 *MENU LEVEL* 」━━━\n\n╭─「 📊 *LEVEL* 」\n│ 📊 ${config.prefix}level\n│ 🏆 ${config.prefix}rank\n│ 🥇 ${config.prefix}leaderboard\n╰━━━━━━━━━━━━━━━━━━━━\n\n⚡ Naik level tiap kirim pesan\n➕ +${config.levelSystem?.expPerMessage || 10} EXP per pesan\n⏱️ Cooldown ${Math.floor((config.levelSystem?.expCooldown || 30000) / 1000)} detik\n\n🎁 Hadiah naik level:\n💰 +${formatMoney(config.levelSystem?.rewardPerLevelUp?.money || 500)}\n⭐ +${config.levelSystem?.rewardPerLevelUp?.point || 5} Point\n🎫 +${config.levelSystem?.rewardPerLevelUp?.limit || 1} Limit` }, { quoted: msg });
  }
};