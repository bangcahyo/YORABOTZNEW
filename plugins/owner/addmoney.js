module.exports = {
  name: 'addmoney',
  category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from, mentioned, getUser, updateUser, formatMoney, isSenderOwner } = ctx;
    if (!isSenderOwner()) return;
    if (!mentioned || mentioned.length === 0) return;
    const t = mentioned[0];
    const amt = parseInt(args[1]);
    if (!amt || amt <= 0) return sock.sendMessage(from, { text: '❌ Jumlah tidak valid!' });
    const tu = getUser(t);
    updateUser(t, { money: tu.money + amt });
    await sock.sendMessage(from, {
      text: `✅ +${formatMoney(amt)} untuk @${t.split('@')[0]}\nTotal: ${formatMoney(tu.money + amt)}`,
      mentions: [t]
    }, { quoted: msg });
  }
};