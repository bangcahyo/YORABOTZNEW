module.exports = {
  name: 'nyerah',
  category: 'game',
  aliases: ['menyerah', 'giveup'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, clearGameTimeout } = ctx;
    if (!gameState[from]) {
      return sock.sendMessage(from, { text: '❌ Tidak ada game aktif.' }, { quoted: msg });
    }
    const g = gameState[from];
    if (g.sender && g.sender !== sender) {
      return sock.sendMessage(from, { text: '❌ Ini bukan game kamu!' }, { quoted: msg });
    }
    clearGameTimeout(from);

    let jawabanBenar = '';
    if (g.game === 'tebakangka') jawabanBenar = g.angka;
    else if (g.game === 'quiz') jawabanBenar = g.jawab;
    else if (g.game === 'tebakkata') jawabanBenar = g.jawab;
    else if (g.game === 'math') jawabanBenar = g.jawab;
    else if (g.game === 'hangman') jawabanBenar = g.kata;
    else if (g.game === 'tebakemoji') jawabanBenar = Array.isArray(g.jawab) ? g.jawab[0] : g.jawab;

    delete gameState[from];
    await sock.sendMessage(from, {
      text: `🏳️ *NYERAH!*\n\nJawaban yang benar: *${jawabanBenar}*\n\n_Jangan menyerah ya!_`
    }, { quoted: msg });
  }
};