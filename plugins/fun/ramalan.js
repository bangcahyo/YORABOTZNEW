module.exports = {
  name: 'ramalan', category: 'fun', aliases: ['ramal', 'fortune'],
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    const list = [
      'Hari ini kamu akan mendapatkan keberuntungan tak terduga.',
      'Hati-hati dengan orang yang diam-diam tidak menyukaimu.',
      'Rezeki sedang mengalir ke arahmu.',
      'Cinta sejati sedang mendekat. Buka hatamu!',
      'Jangan ambil keputusan besar minggu ini.',
      'Kabar baik akan datang dalam 3 hari.',
      'Kamu akan bertemu seseorang yang mengubah hidupmu.',
      'Ada peluang baru yang menantimu, jangan ragu mengambilnya.',
      'Kesehatanmu perlu dijaga, jangan lupa istirahat cukup.',
      'Usahamu akan membuahkan hasil dalam waktu dekat.',
      'Jangan terlalu percaya pada orang baru, kenali dulu.',
      'Keuanganmu akan membaik bulan depan.',
      'Ada pesan penting yang akan kamu terima hari ini.',
      'Seseorang sedang memikirkanmu saat ini.',
      'Perjalanan jauh akan membawa keberuntungan.',
      'Jangan menunda pekerjaan, hasilnya akan lebih baik jika segera.',
      'Kamu akan mendapat pujian atas kerja kerasmu.',
      'Ada rintangan kecil, tapi kamu pasti bisa melewatinya.',
      'Kebaikan yang kamu tanam akan berbuah manis.',
      'Waktu yang tepat untuk memulai sesuatu yang baru telah tiba.',
      'Kamu akan menemukan solusi dari masalah yang lama mengganggu.',
      'Hati-hati dalam berbicara, kata-katamu bisa berdampak besar.',
      'Seseorang akan meminta bantuanmu, bantulah dengan ikhlas.',
      'Keberuntungan berpihak padamu hari ini, manfaatkan!',
      'Ada kejutan menyenangkan yang menantimu.',
      'Jangan lupa bersyukur, rezekimu akan semakin lancar.',
      'Kamu akan bertemu teman lama yang membawa kabar baik.',
      'Fokus pada tujuanmu, jangan teralihkan oleh hal kecil.',
      'Ada kesempatan emas yang harus kamu raih sekarang.',
      'Hari ini cocok untuk memulai hal yang selama ini kamu tunda.',
    ];
    await sock.sendMessage(from, { text: `🔮 *RAMALAN* (${list.length})\n\n${random(list)}` }, { quoted: msg });
  }
};
