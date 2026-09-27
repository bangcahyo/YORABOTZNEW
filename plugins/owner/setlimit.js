module.exports = {
  name: 'setlimit', category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from, mentioned, updateUser, isSenderOwner } = ctx;
    if (!isSenderOwner()) return;
    if (!mentioned || mentioned.length === 0) return;
    const t = mentioned[0];
    const amt = parseInt(args[1]);
    if (isNaN(amt)) return;
    updateUser(t, { limit: amt });
    await sock.sendMessage(from, { text: `✅ Limit @${t.split('@')[0]} = ${amt}`, mentions: [t] }, { quoted: msg });
  }
};