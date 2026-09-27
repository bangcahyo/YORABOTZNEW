const QUOTES = [
  { text: 'Jangan pernah menyerah, karena tempat jatuh adalah tempat belajar bangun yang paling baik.', author: 'Cahyo Store' },
  { text: 'Keberhasilan bukan milik orang yang pintar, tapi milik orang yang mau berusaha.', author: 'Anonymous' },
  { text: 'Berbuat baiklah tanpa mengharapkan balasan.', author: 'Anonymous' },
  { text: 'Hari ini adalah kesempatan, esok adalah harapan, kemarin adalah pelajaran.', author: 'Cahyo Store' },
  { text: 'Sabar adalah kunci dari semua kesuksesan.', author: 'Anonymous' },
  { text: 'Kesuksesan adalah hasil dari persiapan dan kerja keras.', author: 'Colin Powell' },
  { text: 'Ilmu tanpa amal seperti pohon tanpa buah.', author: 'Anonymous' },
  { text: 'Waktu adalah uang. Jangan sia-siakan walau sedetik.', author: 'Anonymous' },
];
module.exports = {
  name: 'quote', category: 'fun',
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    const q = random(QUOTES);
    await sock.sendMessage(from, { text: `💬 *QUOTE*\n\n_"${q.text}"_\n\n— ${q.author}` }, { quoted: msg });
  }
};