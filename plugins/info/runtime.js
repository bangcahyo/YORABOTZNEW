const os = require('os');

module.exports = {
  name: 'runtime',
  category: 'info',
  aliases: ['uptime', 'rt'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;

    const uptime = process.uptime();
    const hari = Math.floor(uptime / 86400);
    const jam = Math.floor((uptime % 86400) / 3600);
    const menit = Math.floor((uptime % 3600) / 60);
    const detik = Math.floor(uptime % 60);

    let uptimeStr = '';
    if (hari > 0) uptimeStr += `${hari} hari `;
    if (jam > 0) uptimeStr += `${jam} jam `;
    if (menit > 0) uptimeStr += `${menit} menit `;
    uptimeStr += `${detik} detik`;

    const totalMem = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const freeMem = (os.freemem() / (1024 ** 3)).toFixed(2);
    const usedMem = (totalMem - freeMem).toFixed(2);
    const memPercent = ((usedMem / totalMem) * 100).toFixed(1);
    const barLength = 10;
    const filled = Math.round((memPercent / 100) * barLength);
    const memBar = '█'.repeat(filled) + '░'.repeat(barLength - filled);

    const text = `╔══════════════════════════════════╗
║      ⏱️ *BOT RUNTIME*
╚══════════════════════════════════╝

🟢 *Status*  : Online
⏱️ *Uptime*  : *${uptimeStr}*

💻 *SYSTEM*
🖥️ OS     : ${os.platform()}
⚙️ Arch   : ${os.arch()}
🟢 Node   : ${process.version}
🔥 CPU    : ${os.cpus().length} cores

💾 *MEMORY*
📦 Total : ${totalMem} GB
✅ Free  : ${freeMem} GB
🔥 Used  : ${usedMem} GB
 [${memBar}] ${memPercent}%

🤖 *${config.botName}*
📞 ${config.botNumber}
👑 ${config.ownerName}`;

    await sock.sendMessage(from, { text });
  },
};