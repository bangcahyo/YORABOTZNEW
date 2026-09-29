module.exports = {
  name: 'menu',
  category: 'menu',
  aliases: ['help', 'start'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const user = ctx.user || { limit: 0, money: 0, point: 0 };
    const pushName = ctx.pushName || 'User';
    const formatMoney = ctx.formatMoney || (a => 'Rp ' + a);

    let ownerTag = '';
    try { if (ctx.isSenderOwner && ctx.isSenderOwner()) ownerTag = ' 👑'; } catch {}

    const menuText = `╔══════════════════════════════════╗
║      ⚡ *${config.botName}* ⚡
╚══════════════════════════════════╝

Halo, *${pushName}*!${ownerTag}

📊 *Status Kamu*
🎫 Limit : *${user.limit}*
💰 Uang  : *${formatMoney(user.money)}*
⭐ Point : *${user.point}*

📂 *DAFTAR MENU*

🎮 ${config.prefix}menugame
🎭 ${config.prefix}menufun
💰 ${config.prefix}menuekonomi
📊 ${config.prefix}menulevel
🛡️ ${config.prefix}menugroup
👑 ${config.prefix}menuowner
⏱️ ${config.prefix}runtime
🛠️ ${config.prefix}menutools

📞 *Owner:* ${config.ownerName}
🌐 ${config.website}`;

    await sock.sendMessage(from, { text: menuText });
  },
};