const PUISI = {
  cinta: [
    'Cinta ini bagai embun pagi,\nHadir tanpa pernah diminta,\nMengisi hati yang sunyi,\nMembuat hidup terasa berbeda.',
    'Jika cinta adalah laut,\nMaka aku adalah perahunya,\nMengarungi takdir yang panjang,\nTanpa tahu kapan berlabuh.',
    'Kau datang seperti mentari,\nMenerangi gelapnya hati,\nSejak itu aku mengerti,\nArti cinta yang sejati.',
  ],
  sedih: [
    'Malam ini bulan bersembunyi,\nBintang pun enggan menemani,\nHatiku sedih tanpa mengerti,\nKenapa dunia terasa sepi.',
    'Air mata jatuh perlahan,\nSeperti hujan di musim kemarau,\nHati ini sungguh kecewa,\nTapi tetap berharap esok cerah.',
    'Rindu ini tak bertepi,\nSeperti ombak di lautan,\nKau pergi tanpa kembali,\nTinggalkan luka di hati.',
  ],
  semangat: [
    'Bangkitlah wahai jiwa muda,\nMasa depan menantimu,\nJangan takut jatuh dan gagal,\nKarena sukses menanti usahamu.',
    'Langkah kecil adalah awal,\nDari seribu langkah menuju puncak,\nJangan berhenti di tengah jalan,\nPercayalah, kau pasti bisa.',
    'Badai pasti akan berlalu,\nMentari kan kembali bersinar,\nJangan pernah menyerah dulu,\nKesuksesan sedang menanti.',
  ],
  alam: [
    'Gunung biru jauh menjulang,\nKabut putih memeluknya,\nSungai mengalir tanpa henti,\nItulah ciptaan Sang Pencipta.',
    'Padi menguning di sawah,\nPetani tersenyum bahagia,\nAlam adalah sahabat setia,\nJagalah agar tetap lestari.',
    'Ombak menari di tepi pantai,\nAngin berbisik lembut sekali,\nAlam ciptaan yang maha indah,\nWajib kita jaga selalu.',
  ],
  sahabat: [
    'Sahabat datang silih berganti,\nAda yang tinggal, ada yang pergi,\nTapi yang benar-benar sejati,\nAkan selalu ada hingga nanti.',
    'Terima kasih sahabatku,\nKau ada di saat susah maupun senang,\nKita bagi tawa dan air mata,\nSemoga persahabatan ini abadi.',
    'Bersamamu hari terasa ringan,\nTawa kita tak pernah habis,\nSahabat adalah anugerah,\nYang tak ternilai harganya.',
  ],
  rindu: [
    'Rindu ini bagai benang,\nMenghubungkan hati yang jauh,\nKau di sana, aku di sini,\nNamun hati tetap menyatu.',
    'Bulan di langit menjadi saksi,\nBetapa aku merindukanmu,\nSetiap detik terasa lama,\nMenanti dirimu kembali.',
  ],
  ibu: [
    'Doa ibu tak pernah putus,\nMengalir seperti sungai panjang,\nKasihnya tulus tanpa batas,\nTak terbalas oleh apapun.',
    'Peluhmu mengiringi langkahku,\nTangismu menyertai doaku,\nIbu, engkaulah pahlawan,\nYang tak pernah minta balasan.',
  ],
  perjuangan: [
    'Keringat menetes di jalan,\nTak ada yang mudah tuk diraih,\nNamun aku tak akan berhenti,\nHingga cita-cita tergapai.',
    'Meski jalan berbatu tajam,\nLangkahku tak akan goyah,\nAku berjuang demi mimpi,\nYang telah lama kudambakan.',
  ],
  sekolah: [
    'Pena menari di atas kertas,\nMenulis ilmu yang berguna,\nSekolah tempatku belajar,\nMeraih masa depan yang cerah.',
    'Bel berbunyi tanda belajar,\nGuru mengajar dengan sabar,\nIlmu ditimba tanpa lelah,\nDemi masa depan yang gemilang.',
  ],
  hujan: [
    'Hujan turun membasahi bumi,\nMembawa sejuk di tengah hari,\nAku terduduk memandang jendela,\nMengenang kenangan masa lalu.',
    'Rintik hujan di malam hari,\nMenemani hati yang sendiri,\nTetesnya bagai irama,\nMenghibur jiwa yang gelisah.',
  ],
};
module.exports = {
  name: 'puisi', category: 'fun',
  async execute(sock, msg, args, ctx) {
    const { config, from, random } = ctx;
    const tema = args[0]?.toLowerCase();
    const temaList = Object.keys(PUISI);
    if (!tema) {
      let txt = `📜 *PUISI* (${temaList.length} tema)\n\nPilih tema:\n\n`;
      temaList.forEach((t, i) => { txt += `${i + 1}. ${t}\n`; });
      txt += `\nContoh: *${config.prefix}puisi cinta*`;
      return sock.sendMessage(from, { text: txt }, { quoted: msg });
    }
    if (!PUISI[tema]) return sock.sendMessage(from, { text: `❌ Tema tidak tersedia!\n\nTersedia: ${temaList.join(', ')}` }, { quoted: msg });
    await sock.sendMessage(from, { text: `📜 *PUISI - ${tema.toUpperCase()}*\n\n${random(PUISI[tema])}` }, { quoted: msg });
  }
};
