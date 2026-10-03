const os = require('os');

module.exports = {
  name: 'runtime',
  category: 'info',
  aliases: ['uptime', 'rt'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;

    const cpuStart = process.cpuUsage();
    const sampleStart = process.hrtime.bigint();
    await new Promise(resolve => setTimeout(resolve, 250));
    const cpuUsed = process.cpuUsage(cpuStart);
    const sampleMicroseconds = Number(process.hrtime.bigint() - sampleStart) / 1000;
    const cpuPercent = ((cpuUsed.user + cpuUsed.system) / sampleMicroseconds * 100).toFixed(1);
    const eventLoopLag = Math.max(0, sampleMicroseconds / 1000 - 250).toFixed(1);
    const processMemory = process.memoryUsage();
    const rss = (processMemory.rss / (1024 ** 2)).toFixed(1);
    const heapUsed = (processMemory.heapUsed / (1024 ** 2)).toFixed(1);
    const heapTotal = (processMemory.heapTotal / (1024 ** 2)).toFixed(1);

    const uptime = process.uptime();
    const hari = Math.floor(uptime / 86400);
    const jam = Math.floor((uptime % 86400) / 3600);
    const menit = Math.floor((uptime % 3600) / 60);
    const detik = Math.floor(uptime % 60);

    let upStr = '';
    if (hari > 0) upStr += `${hari}h `;
    if (jam > 0) upStr += `${jam}j `;
    if (menit > 0) upStr += `${menit}m `;
    upStr += `${detik}s`;

    const totalMem = (os.totalmem() / (1024 ** 3)).toFixed(2);
    const freeMem = (os.freemem() / (1024 ** 3)).toFixed(2);
    const usedMem = (totalMem - freeMem).toFixed(2);
    const memPercent = ((usedMem / totalMem) * 100).toFixed(1);
    const filled = Math.round((memPercent / 100) * 10);
    const memBar = '█'.repeat(filled) + '░'.repeat(10 - filled);

    await sock.sendMessage(from, {
      text: `╔══════════════════════════════════════╗
║       ⏱️  *BOT RUNTIME*  ⏱️
╚══════════════════════════════════════╝

  ◆  🟢  Status  : *Online*
  ◆  ⏱️  Uptime  : *${upStr}*

╭─────────────────────────────────────╮
│  🤖  *BOT PROCESS*                   │
╰─────────────────────────────────────╯

  ◈  📦  RSS       : ${rss} MB
  ◈  🧠  Heap      : ${heapUsed} / ${heapTotal} MB
  ◈  ⚙️  CPU       : ${cpuPercent}% (1 core, sampel 250 ms)
  ◈  ⏱️  Event-loop: ${eventLoopLag} ms (estimasi)

╭─────────────────────────────────────╮
│  💻  *SYSTEM*                        │
╰─────────────────────────────────────╯

  ◈  🖥️  OS     : ${os.platform()}
  ◈  ⚙️  Arch   : ${os.arch()}
  ◈  🟢  Node   : ${process.version}
  ◈  🔥  CPU    : ${os.cpus().length} cores

╭─────────────────────────────────────╮
│  💾  *MEMORY*                        │
╰─────────────────────────────────────╯

  ◈  📦  Total : ${totalMem} GB
  ◈  ✅  Free  : ${freeMem} GB
  ◈  🔥  Used  : ${usedMem} GB

  [${memBar}] ${memPercent}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🤖  ${config.botName}
  📞  ${config.botNumber}
  👑  ${config.ownerName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    });
  },
};