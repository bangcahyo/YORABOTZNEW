const fs = require('fs');
const path = require('path');
const pkg = require('../../package.json');

function countPlugins() {
  try {
    const root = path.join(__dirname, '..');
    let total = 0;
    for (const dir of fs.readdirSync(root)) {
      const dirPath = path.join(root, dir);
      if (!fs.statSync(dirPath).isDirectory()) continue;
      for (const file of fs.readdirSync(dirPath)) {
        if (file.endsWith('.js')) total++;
      }
    }
    return total;
  } catch {
    return 0;
  }
}

module.exports = {
  name: 'dashboard',
  category: 'owner',
  aliases: ['botdashboard', 'statsbot', 'panel'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner } = ctx;
    if (!isSenderOwner || !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Hanya owner yang bisa membuka dashboard bot.' }, { quoted: msg });
    }

    const db = ctx.loadDB ? ctx.loadDB() : {};
    const groups = ctx.loadGroups ? ctx.loadGroups() : {};
    const stats = ctx.loadCommandStats ? ctx.loadCommandStats() : {};
    const logs = ctx.loadActivityLog ? ctx.loadActivityLog() : [];
    const totalCommands = Object.values(stats).reduce((sum, value) => sum + (Number(value?.count) || 0), 0);
    const topEntry = Object.entries(stats)
      .filter(([, value]) => Number(value?.count) > 0)
      .sort((a, b) => Number(b[1].count) - Number(a[1].count) || a[0].localeCompare(b[0]))[0];

    const topCommand = topEntry ? `${topEntry[0]} (${topEntry[1].count})` : 'Belum ada';
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const mem = process.memoryUsage();

    const text = `╔══════════════════════════════════════╗
║      👑 *BOT DASHBOARD*  👑
╚══════════════════════════════════════╝

📦 Version         : *${pkg.version}*
🤖 Bot Name        : *${config.botName}*
🔐 Prefix          : *${config.prefix}*
📡 Mode            : *${(config.botMode || 'public').toUpperCase()}*
⏱️ Uptime          : *${hours}h ${minutes}m*
🧩 Plugin Count    : *${countPlugins()}*
👥 User Data       : *${Object.keys(db).length}*
👥 Group Data      : *${Object.keys(groups).length}*
📊 Total Command   : *${totalCommands}*
🏆 Top Command     : *${topCommand}*
📜 Recent Logs     : *${Array.isArray(logs) ? logs.length : 0}*
🧠 RAM Used        : *${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ *Owner shortcuts:*
• ${config.prefix}systemaudit
• ${config.prefix}commandstats
• ${config.prefix}activitylog
• ${config.prefix}security
• ${config.prefix}restartsafe 5 maintenance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Status: *bot berjalan dengan performa stabil*`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
