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
  'Kesuksesan bukan tentang seberapa cepat, tapi seberapa konsisten.',
  'Jangan pernah malu untuk belajar, malu itu hanya untuk orang yang tidak mau berubah.',
  'Kesabaran adalah kunci dari semua pintu yang tertutup.',
  'Kejujuran adalah harta yang tidak bisa dibeli dengan uang.',
  'Jangan menilai orang dari penampilannya, tapi dari hatinya.',
  'Waktu yang berlalu tidak akan pernah kembali, gunakan sebaik mungkin.',
  'Ilmu yang bermanfaat adalah amal yang tidak akan pernah putus.',
  'Rendah hati bukan berarti rendah diri.',
  'Jangan menunggu sempurna untuk memulai, mulailah untuk menjadi sempurna.',
  'Keberanian terbesar adalah mengakui kesalahan sendiri.',
  'Hidup bukan tentang menunggu badai berlalu, tapi belajar menari di tengah hujan.',
  'Orang bijak belajar dari kesalahan orang lain, orang bodoh belajar dari kesalahannya sendiri.',
  'Kekayaan sejati bukan harta, tapi hati yang tenang dan pikiran yang damai.',
  'Jangan pernah meremehkan kebaikan kecil, karena bisa jadi itu penyelamat.',
  'Senyuman adalah sedekah paling murah yang bisa kamu berikan.',
  'Berhenti menyalahkan keadaan, mulailah memperbaiki diri.',
  'Kesuksesan datang pada mereka yang tidak pernah berhenti mencoba.',
  'Jangan takut menjadi berbeda, karena yang berbeda itulah yang berharga.',
  'Kata-kata yang baik adalah obat bagi hati yang lelah.',
  'Bersyukurlah atas apa yang kamu miliki, maka kamu akan mendapatkan lebih banyak.',
];
module.exports = {
  name: 'katabijak', category: 'fun', aliases: ['kata','bijak'],
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    await sock.sendMessage(from, { text: `🌟 *KATA BIJAK* (${KATA.length})\n\n_"${random(KATA)}"_` }, { quoted: msg });
  }
};
