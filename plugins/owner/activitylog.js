module.exports = {
  name: 'activitylog',
  category: 'owner',
  aliases: ['log', 'botlog', 'activity'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner } = ctx;
    if (!isSenderOwner || !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Hanya owner yang bisa melihat log aktivitas bot.' }, { quoted: msg });
    }

    const sub = (args[0] || '').toLowerCase();
    if (sub === 'clear') {
      ctx.clearActivityLog();
      return sock.sendMessage(from, { text: '✅ Log aktivitas bot berhasil direset.' }, { quoted: msg });
    }

    const logs = ctx.loadActivityLog() || [];
    if (!logs.length) {
      return sock.sendMessage(from, {
        text: '📜 *LOG AKTIVITAS BOT KOSONG*\n\nBelum ada event yang tercatat.',
      }, { quoted: msg });
    }

    const recent = logs.slice(0, 10);
    const lines = recent.map((log) => {
      const type = (log.type || 'event').toUpperCase();
      const user = log.senderNumber || log.user || 'unknown';
      const time = new Date(log.timestamp || Date.now()).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
      const commandText = log.command ? ` • ${log.command}` : '';
      const status = log.success === false ? 'FAILED' : 'OK';
      return `• [${time}] ${type}${commandText}\n  👤 ${user}\n  status: *${status}*`;
    }).join('\n\n');

    const text = `📜 *LOG AKTIVITAS BOT*\n\n` +
      `Menampilkan 10 aktivitas terakhir:\n\n` +
      lines + '\n\n' +
      `🧹 Reset log: *${config.prefix}activitylog clear*`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
