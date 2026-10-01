module.exports = {
  name: 'menulevel',
  category: 'menu',
  async execute(sock, msg, args, ctx) {
    const { config, from, formatMoney } = ctx;

    const menuText = `╔══════════════════════════════════════╗
║        📊  *LEVEL MENU*  📊
╚══════════════════════════════════════╝

╭─────────────────────────────────────╮
│  📊  *LEVEL SYSTEM*                  │
╰─────────────────────────────────────╯

  ◈  📊  ${config.prefix}level
  ◈  🏆  ${config.prefix}rank
  ◈  🥇  ${config.prefix}leaderboard

╭─────────────────────────────────────╮
│  ⚡  *CARA NAIK LEVEL*               │
╰─────────────────────────────────────╯

  ◆  Kirim pesan di grup
  ◆  +${config.levelSystem?.expPerMessage || 10} EXP per pesan
  ◆  Cooldown ${Math.floor((config.levelSystem?.expCooldown || 30000) / 1000)} detik

╭─────────────────────────────────────╮
│  🎁  *HADIAH NAIK LEVEL*             │
╰─────────────────────────────────────╯

  ◆  💰  +${formatMoney(config.levelSystem?.rewardPerLevelUp?.money || 500)}
  ◆  ⭐  +${config.levelSystem?.rewardPerLevelUp?.point || 5} Point
  ◆  🎫  +${config.levelSystem?.rewardPerLevelUp?.limit || 1} Limit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚡  _${config.botName} — Level Menu_
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(from, { text: menuText });
  },
};