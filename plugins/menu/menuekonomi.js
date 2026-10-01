module.exports = {
  name: 'menuekonomi',
  category: 'menu',
  aliases: ['menueco'],
  async execute(sock, msg, args, ctx) {
    const { config, from, formatMoney } = ctx;
    const P = config.premium || {};

    const menuText = `╔══════════════════════════════════════╗
║        💰  *EKONOMI MENU*  💰
╚══════════════════════════════════════╝

╭─────────────────────────────────────╮
│  👤  *PROFIL & REGISTRASI*           │
╰─────────────────────────────────────╯

  ◈  📝  ${config.prefix}daftar <nama>
  ◈  👤  ${config.prefix}profile
  ◈  🅛  ${config.prefix}limit
  ◈  🅛  ${config.prefix}limit info
  ◈  ⭐  ${config.prefix}point
  ◈  💰  ${config.prefix}uang

╭─────────────────────────────────────╮
│  🅟  *PREMIUM*                       │
╰─────────────────────────────────────╯

  ◈  🅟  ${config.prefix}premium
  ◈  💎  ${config.prefix}premium buy
  ◈  🔍  ${config.prefix}premium cek

  💵 Harga  : *${formatMoney(P.price || 50000)}*
  ⏳ Durasi : *${P.durationDays || 30} hari*
  🅛 Limit  : *${P.dailyLimit || 100}* (free: ${config.defaultLimit})

╭─────────────────────────────────────╮
│  🎁  *REWARD*                        │
╰─────────────────────────────────────╯

  ◈  🎁  ${config.prefix}daily
  ◈  💸  ${config.prefix}transfer @user <jml>

╭─────────────────────────────────────╮
│  🛒  *SHOP*                          │
╰─────────────────────────────────────╯

  ◈  🛒  ${config.prefix}shop
  ◈  🛍️  ${config.prefix}buy <item>

  💎 Diskon premium: *${P.shopDiscount || 20}%* 🅟

╭─────────────────────────────────────╮
│  💎  *ITEM SHOP*                     │
╰─────────────────────────────────────╯

  ◆  👑  VIP           — ${formatMoney(50000)}
  ◆  🅛  Limit Boost   — ${formatMoney(10000)}
  ◆  💰  Money Boost   — ${formatMoney(15000)}
  ◆  ⭐  Point Boost   — ${formatMoney(20000)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🅟 = Fitur Premium   🅛 = Pakai Limit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚡  _${config.botName} — Economy Menu_
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(from, { text: menuText });
  },
};
