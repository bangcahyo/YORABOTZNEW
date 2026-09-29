module.exports = {
  name: 'menulevel',
  category: 'menu',
  async execute(sock, msg, args, ctx) {
    const { config, from, formatMoney } = ctx;

    const menuText = `╔══════════════════════════════════╗
║      📊 *MENU LEVEL*
╚══════════════════════════════════╝

📊 *LEVEL*
${config.prefix}level
${config.prefix}rank
${config.prefix}leaderboard

⚡ *CARA NAIK LEVEL*
Kirim pesan di grup
+${config.levelSystem?.expPerMessage || 10} EXP / pesan

🎁 *HADIAH NAIK LEVEL*
💰 +${formatMoney(config.levelSystem?.rewardPerLevelUp?.money || 500)}
⭐ +${config.levelSystem?.rewardPerLevelUp?.point || 5} Point`;

    await sock.sendMessage(from, { text: menuText });
  },
};