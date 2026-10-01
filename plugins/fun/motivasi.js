const QUOTES = [
  { text: 'Jangan pernah menyerah, karena tempat jatuh adalah tempat belajar bangun yang paling baik.', author: 'Cahyo Store' },
  { text: 'Keberhasilan bukan milik orang yang pintar, tapi milik orang yang mau berusaha.', author: 'Anonymous' },
  { text: 'Kesuksesan adalah hasil dari persiapan dan kerja keras.', author: 'Colin Powell' },
  { text: 'Orang sukses adalah orang yang bermimpi, lalu bangun dan bekerja untuk mewujudkannya.', author: 'Anonymous' },
  { text: 'Bangunlah, karena setiap pagi adalah kesempatan baru untuk menang.', author: 'Anonymous' },
  { text: 'Rintangan adalah batu loncatan menuju kesuksesan.', author: 'Anonymous' },
  { text: 'Kamu tidak akan pernah tahu seberapa kuat dirimu sampai kuat menjadi satu-satunya pilihan.', author: 'Anonymous' },
  { text: 'Fokus pada tujuan, bukan pada rintangan.', author: 'Anonymous' },
  { text: 'Keringat hari ini adalah kesuksesan esok hari.', author: 'Anonymous' },
  { text: 'Jangan biarkan rasa takut menghentikan langkahmu.', author: 'Anonymous' },
  { text: 'Setiap usaha tidak akan pernah mengkhianati hasil.', author: 'Anonymous' },
  { text: 'Percayalah pada proses, hasil akan mengikuti.', author: 'Anonymous' },
  { text: 'Disiplin adalah jembatan antara mimpi dan kenyataan.', author: 'Jim Rohn' },
  { text: 'Jika kamu tidak bisa terbang, berlari. Jika tidak bisa berlari, berjalan. Jangan berhenti.', author: 'Martin Luther King Jr' },
  { text: 'Kamu lebih berani dari yang kamu percaya, lebih kuat dari yang terlihat.', author: 'Winnie the Pooh' },
  { text: 'Masa depanmu diciptakan oleh apa yang kamu lakukan hari ini, bukan besok.', author: 'Anonymous' },
  { text: 'Tidak ada jalan pintas menuju tempat yang layak dikunjungi.', author: 'Beverly Sills' },
  { text: 'Keberanian bukan berarti tidak takut, tapi tetap melangkah meski takut.', author: 'Anonymous' },
  { text: 'Kerjakan hari ini apa yang orang lain tidak mau, nikmati besok apa yang orang lain tidak bisa.', author: 'Anonymous' },
  { text: 'Sukses dimulai dari keberanian untuk mencoba.', author: 'Anonymous' },
  { text: 'Jangan hanya bermimpi, bangun dan wujudkan.', author: 'Anonymous' },
  { text: 'Semakin banyak kamu belajar, semakin banyak yang bisa kamu raih.', author: 'Anonymous' },
  { text: 'Lelah itu wajar, tapi menyerah bukan pilihan.', author: 'Anonymous' },
  { text: 'Kesempatan tidak datang dua kali, manfaatkan yang ada di depanmu.', author: 'Anonymous' },
  { text: 'Berhenti menunggu waktu yang tepat, buatlah waktu itu tepat.', author: 'Anonymous' },
  { text: 'Hal-hal besar tidak pernah datang dari zona nyaman.', author: 'Anonymous' },
  { text: 'Yakinlah, setiap doa yang tulus pasti akan dikabulkan pada waktu terbaik.', author: 'Anonymous' },
  { text: 'Kamu adalah penulis cerita hidupmu sendiri, buatlah yang terbaik.', author: 'Anonymous' },
  { text: 'Perubahan besar dimulai dari langkah kecil yang konsisten.', author: 'Anonymous' },
  { text: 'Jangan takut gagal, takutlah jika tidak pernah mencoba sama sekali.', author: 'Anonymous' },
];
module.exports = {
  name: 'motivasi', category: 'fun',
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    const q = random(QUOTES);
    await sock.sendMessage(from, { text: `🔥 *MOTIVASI* (${QUOTES.length})\n\n_"${q.text}"_\n\n— ${q.author}` }, { quoted: msg });
  }
};
