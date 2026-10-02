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

function countUsers() {
  try {
    const fp = path.join(__dirname, '..', '..', 'database', 'users.json');
    if (!fs.existsSync(fp)) return 0;
    const json = JSON.parse(fs.readFileSync(fp, 'utf8'));
    return typeof json === 'object' ? Object.keys(json).length : 0;
  } catch {
    return 0;
  }
}

function countGroups() {
  try {
    const fp = path.join(__dirname, '..', '..', 'database', 'groups.json');
    if (!fs.existsSync(fp)) return 0;
    const json = JSON.parse(fs.readFileSync(fp, 'utf8'));
    return typeof json === 'object' ? Object.keys(json).length : 0;
  } catch {
    return 0;
  }
}

module.exports = {
  name: 'systemaudit',
  category: 'owner',
  aliases: ['audit', 'sysaudit', 'diagnostic'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner } = ctx;
    if (!isSenderOwner || !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Hanya owner yang bisa membuka system audit.' }, { quoted: msg });
    }

    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const mins = Math.floor((uptime % 3600) / 60);
    const mem = process.memoryUsage();
    const pluginCount = countPlugins();
    const userCount = countUsers();
    const groupCount = countGroups();

    const text = `╔══════════════════════════════════════╗
║      🧪 *SYSTEM AUDIT*  🧪
╚══════════════════════════════════════╝

📦 Version         : *${pkg.version}*
🤖 Bot Name        : *${config.botName}*
🔐 Prefix          : *${config.prefix}*
📡 Mode            : *${(config.botMode || 'public').toUpperCase()}*
🧩 Plugin Count    : *${pluginCount}*
👥 User Data       : *${userCount}*
👥 Group Data      : *${groupCount}*
⏱️ Uptime          : *${hours}h ${mins}m*
🧠 RAM Used        : *${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB*
💾 DB State        : *${fs.existsSync(path.join(__dirname, '..', '..', 'database')) ? 'Ready' : 'Missing'}*
📍 Owner           : *${config.ownerName}*
📞 Owner Number    : *${config.ownerNumber}*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Recommended checks:
• ${config.prefix}statusbot
• ${config.prefix}security
• ${config.prefix}showconfig
• ${config.prefix}restartsafe 5 maintenance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Audit status: *bot dalam kondisi siap dipelihara*`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
