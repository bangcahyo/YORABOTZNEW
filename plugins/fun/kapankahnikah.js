module.exports = {
  name: 'kapankahnikah', category: 'fun',
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    const list = [
      'Ramalan: *2 tahun lagi* nih!',
      'Kamu akan menikah *tahun depan*!',
      'Sabar ya, *3-5 tahun* lagi. Fokus dulu!',
      '*Jodohmu sedang dalam perjalanan.*',
      'Ramalan: *usia 27 tahun* bertemu jodohmu.',
    ];
    await sock.sendMessage(from, { text: `💍 *RAMALAN JODOH*\n\n${random(list)}` }, { quoted: msg });
  }
};