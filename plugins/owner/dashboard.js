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
    const recentLogs = Array.isArray(logs) ? logs : [];
    const premiumUsers = ctx.listPremium ? ctx.listPremium() : [];
    const totalCommands = Object.values(stats).reduce((sum, value) => sum + (Number(value?.count) || 0), 0);
    const topEntry = Object.entries(stats)
      .filter(([, value]) => Number(value?.count) > 0)
      .sort((a, b) => Number(b[1].count) - Number(a[1].count) || a[0].localeCompare(b[0]))[0];

    const topCommand = topEntry ? `${topEntry[0]} (${topEntry[1].count})` : 'Belum ada';
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const mem = process.memoryUsage();
    const failedLogs = recentLogs.filter((entry) => entry?.success === false).length;
    const latestActivity = recentLogs[0]?.timestamp
      ? new Date(recentLogs[0].timestamp).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
      })
      : 'Belum ada';
    const uptimeText = `${days ? `${days} hari ` : ''}${hours}j ${minutes}m`;
    const healthText = failedLogs
      ? `⚠️ ${failedLogs} aktivitas gagal pada log tersimpan`
      : '✅ Tidak ada aktivitas gagal pada log tersimpan';

    const text = `╔══════════════════════════════════════╗
║      👑 *BOT DASHBOARD*  👑
╚══════════════════════════════════════╝

📦 Version         : *${pkg.version}*
🤖 Bot Name        : *${config.botName}*
🔐 Prefix          : *${config.prefix}*
📡 Mode            : *${(config.botMode || 'public').toUpperCase()}*
⏱️ Uptime          : *${uptimeText}*
🧩 Plugin Files    : *${countPlugins()}*
👥 User Data       : *${Object.keys(db).length}*
👥 Group Data      : *${Object.keys(groups).length}*
💎 Premium Aktif   : *${Array.isArray(premiumUsers) ? premiumUsers.length : 0}*
📊 Total Command   : *${totalCommands}*
🏆 Top Command     : *${topCommand}*
📜 Log Tersimpan   : *${recentLogs.length}* (maks. 200)
🕒 Aktivitas Baru  : *${latestActivity}*
🧠 Heap            : *${(mem.heapUsed / 1024 / 1024).toFixed(1)} / ${(mem.heapTotal / 1024 / 1024).toFixed(1)} MB*
💾 RSS             : *${(mem.rss / 1024 / 1024).toFixed(1)} MB*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ *Owner shortcuts:*
• ${config.prefix}systemaudit
• ${config.prefix}commandstats
• ${config.prefix}activitylog
• ${config.prefix}security
• ${config.prefix}restartsafe 5 maintenance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${healthText}`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
