module.exports = {
  name: 'kapankahnikah', category: 'fun', aliases: ['kapanmenikah', 'kapanjodoh'],
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    const list = [
      'Ramalan: *2 tahun lagi* nih!',
      'Kamu akan menikah *tahun depan*!',
      'Sabar ya, *3-5 tahun* lagi. Fokus dulu!',
      '*Jodohmu sedang dalam perjalanan.*',
      'Ramalan: *usia 27 tahun* bertemu jodohmu.',
      'Tunggu sampai *kamu mapan* dulu ya!',
      'Ramalan: *1 tahun lagi* ada kabar baik!',
      'Jodohmu mungkin sudah dekat, *buka mata lebar-lebar*.',
      'Kamu akan menikah setelah *lulus & kerja* dulu.',
      'Ramalan: *usia 25 tahun* adalah tahun keberuntunganmu.',
      'Bersabarlah, *jodoh terbaik* datang di waktu terbaik.',
      'Ramalan: *6 bulan lagi* kamu bertemu seseorang istimewa.',
      'Jangan buru-buru, *usia 28-30* adalah waktu terbaikmu.',
      'Ramalan: *setelah mapan ekonomi*, jodohmu menghampiri.',
      'Kamu akan menikah dengan *seseorang dari masa lalumu*.',
      'Ramalan: *4 tahun lagi*, persiapkan dirimu!',
      'Jodohmu ada *di sekitar lingkunganmu* sekarang.',
      'Ramalan: *tahun ini* banyak yang mendekatimu, pilih dengan hati.',
      'Sabar, *jodohmu adalah orang yang sabar menunggumu*.',
      'Ramalan: *usia 26 tahun* kamu akan dilamar seseorang.',
    ];
    await sock.sendMessage(from, { text: `💍 *RAMALAN JODOH*\n\n${random(list)}` }, { quoted: msg });
  }
};
