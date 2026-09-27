module.exports = {
  name: 'resetlevel', category: 'level',
  async execute(sock, msg, args, ctx) {
    const { from, mentioned, updateUser, isSenderOwner } = ctx;
    if (!isSenderOwner()) return;
    if (!mentioned || mentioned.length === 0) return;
    const t = mentioned[0];
    updateUser(t, { exp: 0, lastExpGain: 0 });
    await sock.sendMessage(from, { text: `✅ Level @${t.split('@')[0]} di-reset.`, mentions: [t] }, { quoted: msg });
  }
};