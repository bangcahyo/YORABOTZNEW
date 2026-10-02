const fs = require('fs');
const path = require('path');
const pkg = require('../../package.json');

function countPlugins() {
  try {
    const root = path.join(__dirname, '..');
    let total = 0;
    for (const cat of fs.readdirSync(root)) {
      const catPath = path.join(root, cat);
      if (!fs.statSync(catPath).isDirectory()) continue;
      for (const file of fs.readdirSync(catPath)) {
        if (file.endsWith('.js')) total++;
      }
    }
    return total;
  } catch {
    return 0;
  }
}

function countUsers() {
  try {
    const userFile = path.join(__dirname, '..', '..', 'database', 'users.json');
    if (!fs.existsSync(userFile)) return 0;
    const data = JSON.parse(fs.readFileSync(userFile, 'utf8'));
    return typeof data === 'object' ? Object.keys(data).length : 0;
  } catch {
    return 0;
  }
}

module.exports = {
  name: 'statusbot',
  category: 'tools',
  aliases: ['botstatus', 'health', 'bothealth', 'status'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const uptime = process.uptime();
    const jam = Math.floor(uptime / 3600);
    const menit = Math.floor((uptime % 3600) / 60);
    const detik = Math.floor(uptime % 60);
    const mem = process.memoryUsage();
    const totalPlugins = countPlugins();
    const totalUsers = countUsers();
    const connectionState = sock?.user?.id ? '✅ Connected' : '🟡 Starting';

    const status = `⚙️ *BOT STATUS REPORT*\n\n` +
      `📦 Versi          : *${pkg.version}*\n` +
      `🟢 Node.js        : *${process.version}*\n` +
      `💻 Platform      : *${process.platform}*\n` +
      `🔌 Connection    : *${connectionState}*\n` +
      `⏱️ Uptime        : *${jam}h ${menit}m ${detik}s*\n` +
      `🧠 RAM Used      : *${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB*\n` +
      `📊 Heap Total    : *${(mem.heapTotal / 1024 / 1024).toFixed(1)} MB*\n` +
      `🧩 Active Plugins: *${totalPlugins}*\n` +
      `👥 Registered Users: *${totalUsers}*\n` +
      `🗄️ DB State      : *${fs.existsSync(path.join(__dirname, '..', '..', 'database', 'users.json')) ? 'Ready' : 'Not Ready'}*\n\n` +
      `✅ Status: *Stable / Healthy*`;

    await sock.sendMessage(from, { text: status }, { quoted: msg });
  },
};
