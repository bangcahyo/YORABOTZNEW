const QUOTES = [
  { text: 'Jangan pernah menyerah, karena tempat jatuh adalah tempat belajar bangun yang paling baik.', author: 'Cahyo Store' },
  { text: 'Keberhasilan bukan milik orang yang pintar, tapi milik orang yang mau berusaha.', author: 'Anonymous' },
  { text: 'Kesuksesan adalah hasil dari persiapan dan kerja keras.', author: 'Colin Powell' },
  { text: 'Orang sukses adalah orang yang bermimpi, lalu bangun dan bekerja untuk mewujudkannya.', author: 'Anonymous' },
];
module.exports = {
  name: 'motivasi', category: 'fun',
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    const q = random(QUOTES);
    await sock.sendMessage(from, { text: `🔥 *MOTIVASI*\n\n_"${q.text}"_\n\n— ${q.author}` }, { quoted: msg });
  }
};