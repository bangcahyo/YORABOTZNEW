module.exports = {
  name: 'rank', category: 'level', aliases: ['peringkat'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, loadDB, user, getLevelFromExp, getExpProgress } = ctx;
    const db = loadDB();
    const users = Object.entries(db)
      .map(([jid, data]) => ({ jid, exp: data.exp || 0, level: getLevelFromExp(data.exp || 0) }))
      .sort((a, b) => b.exp - a.exp);
    const userRank = users.findIndex(u => u.jid === sender) + 1;
    if (userRank === 0) return sock.sendMessage(from, { text: '❌ Kamu belum terdaftar. Chat dulu di grup!' }, { quoted: msg });
    const info = getExpProgress(user.exp || 0);
    await sock.sendMessage(from, { text: `🏆 *PERINGKAT KAMU*\n\n🥇 Rank: *#${userRank}* dari ${users.length}\n🎖️ Level: ${info.level}\n✨ EXP: ${user.exp || 0}` }, { quoted: msg });
  }
};