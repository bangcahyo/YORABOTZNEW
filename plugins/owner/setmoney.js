module.exports = {
  name: 'setmoney', category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from, mentioned, updateUser, formatMoney, isSenderOwner } = ctx;
    if (!isSenderOwner()) return;
    if (!mentioned || mentioned.length === 0) return;
    const t = mentioned[0];
    const amt = parseInt(args[1]);
    if (isNaN(amt)) return;
    updateUser(t, { money: amt });
    await sock.sendMessage(from, { text: `✅ Uang @${t.split('@')[0]} = ${formatMoney(amt)}`, mentions: [t] }, { quoted: msg });
  }
};