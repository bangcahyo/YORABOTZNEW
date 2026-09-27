module.exports = {
  name: 'quiz', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, setGameTimeout, random } = ctx;
    const qs = [
      { q: 'Ibu kota Indonesia?', a: 'jakarta' },
      { q: 'Planet terdekat matahari?', a: 'merkurius' },
      { q: 'Hewan tercepat di darat?', a: 'cheetah' },
      { q: 'Presiden pertama Indonesia?', a: 'soekarno' },
      { q: 'Lambang kimia air?', a: 'h2o' },
      { q: 'Benua terbesar?', a: 'asia' },
    ];
    const q = random(qs);
    gameState[from] = { game: 'quiz', jawab: q.a, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${q.a}*\n\n_Ketik_ *${config.prefix}quiz* _untuk main lagi._` });
    });
    await sock.sendMessage(from, { text: `❓ *QUIZ*\n\n${q.q}\n\nJawab: *${config.prefix}jawabquiz <jawaban>*\nNyerah: *${config.prefix}nyerah*\n\n⏱️ Waktu: 60 detik\nHadiah: +10 Point, +Rp 1000` }, { quoted: msg });
  }
};