const performanceStats = require('../../lib/performance-stats');

function formatDuration(milliseconds) {
  if (milliseconds >= 1000) return `${(milliseconds / 1000).toFixed(2)} s`;
  return `${milliseconds.toFixed(1)} ms`;
}

module.exports = {
  name: 'perf',
  category: 'info',
  aliases: ['performance'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const stats = performanceStats.getStats().slice(0, 10);
    let text = `╔══════════════════════════════════════╗
║       ⚡  *PERFORMA COMMAND*  ⚡
╚══════════════════════════════════════╝

Data sejak bot aktif · command download tidak dihitung.
`;

    if (!stats.length) {
      text += '\nBelum ada data eksekusi command.';
    } else {
      text += '\n' + stats.map((item, index) =>
        `${index + 1}. *${item.command}*\n` +
        `   Rata-rata: ${formatDuration(item.averageDurationMs)} · Maks: ${formatDuration(item.maxDurationMs)}\n` +
        `   Eksekusi: ${item.count} · Error: ${item.errors}`,
      ).join('\n\n');
    }

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};