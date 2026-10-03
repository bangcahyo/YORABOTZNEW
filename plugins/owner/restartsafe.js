module.exports = {
  name: 'restartsafe',
  category: 'owner',
  aliases: ['safe restart', 'safe-restart', 'restartsafebot', 'restartsafe'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner, flushDatabase } = ctx;

    if (!isSenderOwner || !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Hanya owner yang bisa menjalankan restart aman.' }, { quoted: msg });
    }

    const reason = (args.join(' ') || 'maintenance').trim();
    const delay = Number(args[0]) || 5;

    await sock.sendMessage(from, {
      text: `🔄 *SAFE RESTART INITIATED*\n\n` +
        `⏱️ Delay     : *${delay} detik*\n` +
        `📝 Reason    : *${reason}*\n\n` +
        `⚠️ Bot akan restart setelah delay selesai.\n` +
        `✅ Proses berlangsung aman dan terkontrol.`,
    }, { quoted: msg });

    console.log(`\n🔄 SAFE RESTART DIMINTA OLEH OWNER | delay=${delay}s | reason=${reason}\n`);
    setTimeout(async () => {
      try {
        if (typeof flushDatabase === 'function') await flushDatabase();
        process.exit(0);
      } catch (err) {
        console.error('❌ Database flush sebelum restart gagal:', err.message);
        await sock.sendMessage(from, { text: `❌ Restart dibatalkan karena database gagal disimpan: ${err.message}` });
      }
    }, Math.max(1, delay) * 1000);
  },
};
