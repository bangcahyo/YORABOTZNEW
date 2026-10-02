const pkg = require('../../package.json');

module.exports = {
  name: 'statusbot',
  category: 'tools',
  aliases: ['botstatus', 'health'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const uptime = process.uptime();
    const jam = Math.floor(uptime / 3600);
    const menit = Math.floor((uptime % 3600) / 60);
    const detik = Math.floor(uptime % 60);
    const mem = process.memoryUsage();

    const status = `⚙️ *STATUS BOT*\n\n` +
      `📦 Versi      : *${pkg.version}*\n` +
      `🟢 Node.js    : *${process.version}*\n` +
      `💻 Platform  : *${process.platform}*\n` +
      `⏱️ Uptime    : *${jam}h ${menit}m ${detik}s*\n` +
      `🧠 RAM       : *${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB*\n` +
      `📊 Heap total: *${(mem.heapTotal / 1024 / 1024).toFixed(1)} MB*`;

    await sock.sendMessage(from, { text: status });
  },
};
