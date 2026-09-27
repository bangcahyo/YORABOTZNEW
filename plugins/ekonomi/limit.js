module.exports = {
  name: 'limit', category: 'ekonomi',
  async execute(sock, msg, args, ctx) {
    const { from, user } = ctx;
    await sock.sendMessage(from, { text: `🎫 *LIMIT KAMU*\n\nLimit: *${user.limit}*` }, { quoted: msg });
  }
};