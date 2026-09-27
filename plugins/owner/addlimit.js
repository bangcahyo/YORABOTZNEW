module.exports = {
  name: 'addlimit', category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from, mentioned, getUser, updateUser, isSenderOwner } = ctx;
    if (!isSenderOwner()) return;
    if (!mentioned || mentioned.length === 0) return;
    const t = mentioned[0];
    const amt = parseInt(args[1]);
    if (!amt || amt <= 0) return sock.sendMessage(from, { text: '❌ Jumlah tidak valid!' });
    const tu = getUser(t);
    updateUser(t, { limit: tu.limit + amt });
    await sock.sendMessage(from, { text: `✅ +${amt} limit untuk @${t.split('@')[0]}\nTotal: ${tu.limit + amt}`, mentions: [t] }, { quoted: msg });
  }
};