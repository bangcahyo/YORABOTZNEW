module.exports = {
  name: 'resetuser', category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from, mentioned, loadDB, saveDB, isSenderOwner } = ctx;
    if (!isSenderOwner()) return;
    if (!mentioned || mentioned.length === 0) return;
    const t = mentioned[0];
    const db = loadDB();
    delete db[t];
    saveDB(db);
    await sock.sendMessage(from, { text: `✅ User @${t.split('@')[0]} di-reset.`, mentions: [t] }, { quoted: msg });
  }
};