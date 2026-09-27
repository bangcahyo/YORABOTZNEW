const KATA = [
  'Hidup itu sederhana, kita yang membuatnya rumit.',
  'Jangan takut melangkah, karena jalan panjang dimulai dari satu langkah.',
  'Rezeki tidak akan tertukar, tapi usaha tetap harus maksimal.',
  'Orang yang berhenti belajar akan tertinggal oleh zaman.',
  'Berpikir positif, maka alam akan merespon dengan hal-hal positif juga.',
  'Setiap masalah punya solusi. Yang penting kita mau mencari.',
  'Sahabat sejati akan ada di saat susah, bukan hanya saat senang.',
  'Doa tanpa usaha itu sia-sia. Usaha tanpa doa itu sombong.',
  'Jangan bandingkan hidupmu dengan orang lain, karena kamu tidak tahu prosesnya.',
  'Kebahagiaan tidak datang dari harta, tapi dari hati yang bersyukur.',
];
module.exports = {
  name: 'katabijak', category: 'fun', aliases: ['kata','bijak'],
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    await sock.sendMessage(from, { text: `🌟 *KATA BIJAK*\n\n_"${random(KATA)}"_` }, { quoted: msg });
  }
};