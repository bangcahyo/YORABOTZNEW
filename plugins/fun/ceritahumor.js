const CERITA = [
  '😄 *Dokter vs Pasien*\n\nPasien: "Dok, kalau saya minum kopi, mata saya jadi susah tidur."\nDokter: "Coba minumnya pagi-pagi."\nPasien: "Sudah, Dok. Masalahnya saya jadi susah bangun."\nDokter: "..."',
  '😄 *Guru & Murid*\n\nGuru: "Budi, kenapa PR-mu sama persis dengan punya Andi?"\nBudi: "Karena kami mengerjakan bersama, Bu."\nGuru: "Tapi jawabannya salah semua."\nBudi: "Ya iyalah, kami sama-sama tidak tahu."',
  '😄 *Suami Istri*\n\nIstri: "Mas, kamu lebih cinta aku atau HP?"\nSuami: "Ya jelas kamu, Sayang."\nIstri: "Buktikan, taruh HP-nya."\nSuami: "HP-ku tidak bisa ditaruh, dia sedang di-charge."\nIstri: "Jadi aku kalah sama charger?"',
  '😄 *Di Kantor*\n\nBos: "Kenapa kamu datang terlambat?"\nKaryawan: "Karena jam di rumah saya lambat, Pak."\nBos: "Kalau begitu, jam di rumahmu juga lambat bayar gaji."\nKaryawan: "Pak, saya datang lebih awal besok!"',
  '😄 *Ibu & Anak*\n\nAnak: "Bu, aku dapat nilai 100 di ujian!"\nIbu: "Wah hebat! Pelajaran apa?"\nAnak: "Ujian matematika, Bu. Soalnya ada 100, saya jawab semua salah."\nIbu: "..."',
  '😄 *Tukang Parkir*\n\nTukang parkir: "Pak, mobilnya mau diparkir berapa lama?"\nSaya: "Sebentar saja, Pak."\nTukang parkir: "Sebentar itu berapa jam?"\nSaya: "Tergantung, Pak. Sebentar bagi saya bisa 5 jam."',
  '😄 *Percakapan WA*\n\nA: "Kamu di mana?"\nB: "Di rumah."\nA: "Aku di depan rumahmu, kok sepi?"\nB: "Rumah yang mana dulu? Aku punya 3."\nA: "..."',
  '😄 *Dokter Gigi*\n\nDokter: "Jangan takut, cabut gigi itu tidak sakit."\nPasien: "Saya tidak takut, Dok."\nDokter: "Bagus. Itu gigi saya yang copot, bukan gigi Anda."\nPasien: "APA?!"',
  '😄 *Murid Telat*\n\nGuru: "Kenapa kamu telat lagi?"\nMurid: "Saya bermimpi, Bu. Mimpinya panjang sekali."\nGuru: "Lalu?"\nMurid: "Di mimpi saya, saya sudah sampai sekolah. Jadi saya pikir tidak perlu datang."',
  '😄 *Warung*\n\nPembeli: "Bu, ini nasi gorengnya kok tidak ada nasinya?"\nPenjual: "Itu namanya telur goreng, Nak."\nPembeli: "Loh, kok bisa?"\nPenjual: "Karena kamu pesan nasi goreng tanpa nasi."',
  '😄 *Anak Sekolah*\n\nGuru: "Sebutkan 5 hewan yang hidup di laut!"\nMurid: "Ikan 1, ikan 2, ikan 3, ikan 4, ikan 5."\nGuru: "Itu semua ikan."\nMurid: "Kan saya cuma disuruh sebutkan 5."',
  '😄 *Suami Malas*\n\nIstri: "Mas, tolong buang sampah."\nSuami: "Nanti saja, masih capek."\nIstri: "Kamu dari tadi cuma rebahan."\nSuami: "Iya, rebahan itu melelahkan, Sayang."',
  '😄 *Teman Sekolah*\n\nA: "Kamu pintar banget, nilai kamu selalu tinggi."\nB: "Ah, biasa aja."\nA: "Rahasianya apa?"\nB: "Belajar."\nA: "Hah, ada rahasia lain?"\nB: "Belajar lebih lama."',
  '😄 *Di Restoran*\n\nPelayan: "Pak, mau pesan apa?"\nSaya: "Yang murah dan enak."\nPelayan: "Silakan lihat menunya."\nSaya: "Yang murah tidak enak, yang enak tidak murah."\nPelayan: "Kalau begitu, pesan air putih saja."',
  '😄 *Ibu & Anak*\n\nAnak: "Bu, aku lapar."\nIbu: "Di kulkas ada makanan."\nAnak: "Sudah aku lihat, Bu."\nIbu: "Lalu kenapa?"\nAnak: "Aku cuma bilang lapar, bukan mau masak sendiri."',
];

module.exports = {
  name: 'ceritahumor',
  category: 'fun',
  aliases: ['humor', 'ceritalucu', 'jokes', 'lucu'],
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    await sock.sendMessage(from, { text: `${random(CERITA)}\n\n_— Cerita Humor ${CERITA.length}_` }, { quoted: msg });
  },
};
