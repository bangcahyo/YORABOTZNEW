module.exports = {
  name: 'uang', category: 'ekonomi', aliases: ['money'],
  async execute(sock, msg, args, ctx) {
    const { from, user, formatMoney } = ctx;
    await sock.sendMessage(from, { text: `💰 *UANG KAMU*\n\nSaldo: *${formatMoney(user.money)}*` }, { quoted: msg });
  }
};