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
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${soal.jawab}*` });
    });
    await sock.sendMessage(from, {
      text: `📝 *TEBAK KATA*\n\n❓ ${soal.soal}\n\n💬 *Ketik jawabanmu langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +Rp 750, +3 Point`
    });
  }
};