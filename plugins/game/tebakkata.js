module.exports = {
  name: 'tebakkata', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, setGameTimeout, random } = ctx;
    const list = [
      { soal: 'Buah berwarna merah, sering dibuat jus', jawab: 'apel' },
      { soal: 'Hewan berkaki empat, raja hutan', jawab: 'singa' },
      { soal: 'Alat transportasi di laut', jawab: 'kapal' },
      { soal: 'Benda langit bersinar di siang hari', jawab: 'matahari' },
      { soal: 'Ibu kota Jepang', jawab: 'tokyo' },
      { soal: 'Pulau terbesar di Indonesia', jawab: 'kalimantan' },
    ];
    const soal = random(list);
    gameState[from] = { game: 'tebakkata', jawab: soal.jawab, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${soal.jawab}*\n\n_Ketik_ *${config.prefix}tebakkata* _untuk main lagi._` });
    });
    await sock.sendMessage(from, { text: `📝 *TEBAK KATA*\n\n❓ ${soal.soal}\n\nJawab: *${config.prefix}jawabkata <jawaban>*\nNyerah: *${config.prefix}nyerah*\n\n⏱️ 60 detik\nHadiah: +Rp 750, +3 Point` }, { quoted: msg });
  }
};