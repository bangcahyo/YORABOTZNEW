module.exports = {
  name: 'leaderboard', category: 'level', aliases: ['lb','top'],
  async execute(sock, msg, args, ctx) {
    const { from, loadDB, getLevelFromExp } = ctx;
    const db = loadDB();
    const users = Object.entries(db)
      .map(([jid, data]) => ({ jid, name: jid.split('@')[0].replace(/[^0-9]/g, ''), exp: data.exp || 0, level: getLevelFromExp(data.exp || 0) }))
      .sort((a, b) => b.exp - a.exp)
      .slice(0, 10);
    if (users.length === 0) return sock.sendMessage(from, { text: 'Belum ada user.' }, { quoted: msg });
    let txt = `🏆 *LEADERBOARD TOP 10*\n\n`;
    const medals = ['🥇', '🥈', '🥉'];
    users.forEach((u, i) => {
      const medal = i < 3 ? medals[i] : `${i + 1}.`;
      txt += `${medal} @${u.name}\n   Lv.${u.level} | ${u.exp} EXP\n\n`;
    });
    await sock.sendMessage(from, { text: txt, mentions: users.map(u => u.jid) }, { quoted: msg });
  }
};