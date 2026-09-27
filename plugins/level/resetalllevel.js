module.exports = {
  name: 'resetalllevel', category: 'level',
  async execute(sock, msg, args, ctx) {
    const { from, loadDB, saveDB, isSenderOwner } = ctx;
    if (!isSenderOwner()) return;
    const db = loadDB();
    Object.keys(db).forEach(jid => { db[jid].exp = 0; db[jid].lastExpGain = 0; });
    saveDB(db);
    await sock.sendMessage(from, { text: '✅ Semua level di-reset.' }, { quoted: msg });
  }
};