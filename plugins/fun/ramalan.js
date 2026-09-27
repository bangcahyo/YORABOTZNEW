module.exports = {
  name: 'ramalan', category: 'fun',
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    const list = [
      'Hari ini kamu akan mendapatkan keberuntungan tak terduga.',
      'Hati-hati dengan orang yang diam-diam tidak menyukaimu.',
      'Rezeki sedang mengalir ke arahmu.',
      'Cinta sejati sedang mendekat. Buka hatamu!',
      'Jangan ambil keputusan besar minggu ini.',
      'Kabar baik akan datang dalam 3 hari.',
    ];
    await sock.sendMessage(from, { text: `🔮 *RAMALAN*\n\n${random(list)}` }, { quoted: msg });
  }
};