module.exports = {
  name: 'point', category: 'ekonomi',
  async execute(sock, msg, args, ctx) {
    const { from, user } = ctx;
    await sock.sendMessage(from, { text: `⭐ *POINT KAMU*\n\nPoint: *${user.point}*` }, { quoted: msg });
  }
};