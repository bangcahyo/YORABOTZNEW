module.exports = {
  name: 'ping',
  category: 'info',
  aliases: ['p'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const start = process.hrtime.bigint();
    await sock.sendMessage(from, { text: '🏓 *Pong!*' });
    const latency = (Number(process.hrtime.bigint() - start) / 1e6).toFixed(1);
    await sock.sendMessage(from, { text: `⚡ Latency: *${latency}ms*` });
  },
};