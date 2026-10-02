module.exports = {
  name: 'commandstats',
  category: 'owner',
  aliases: ['cmdstats', 'statcommand'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner } = ctx;
    if (!isSenderOwner || !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Hanya owner yang bisa melihat statistik command.' }, { quoted: msg });
    }

    if ((args[0] || '').toLowerCase() === 'reset') {
      ctx.resetCommandStats();
      return sock.sendMessage(from, { text: '✅ Statistik penggunaan command berhasil direset.' }, { quoted: msg });
    }

    const stats = ctx.loadCommandStats();
    const entries = Object.entries(stats)
      .filter(([, value]) => value && Number(value.count) > 0)
      .sort((a, b) => Number(b[1].count) - Number(a[1].count) || a[0].localeCompare(b[0]));
    const total = entries.reduce((sum, [, value]) => sum + Number(value.count), 0);

    if (!entries.length) {
      return sock.sendMessage(from, {
        text: '📊 *STATISTIK COMMAND KOSONG*\n\nPemakaian command yang sukses akan mulai dihitung setelah fitur ini aktif.',
      }, { quoted: msg });
    }

    const ranking = entries.slice(0, 10).map(([name, value], index) => {
      return `${index + 1}. *${name}* — ${Number(value.count)} kali`;
    }).join('\n');
    const text = `📊 *STATISTIK PENGGUNAAN COMMAND*\n\n` +
      `Total pemakaian: *${total}*\n` +
      `Command digunakan: *${entries.length}*\n\n` +
      `🏆 *10 Teratas*\n${ranking}\n\n` +
      `Reset statistik: *${config.prefix}commandstats reset*`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};