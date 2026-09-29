module.exports = {
  name: 'ping',
  category: 'info',
  aliases: ['p'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const start = Date.now();
    await sock.sendMessage(from, { text: '🏓 *Pong!*' });
    const latency = Date.now() - start;
    await sock.sendMessage(from, { text: `⚡ Latency: *${latency}ms*` });
  },
};