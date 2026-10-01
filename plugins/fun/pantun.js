const PANTUN = [
  'Ke pasar beli pepaya,\nBelinya di pasar baru,\nHidup ini jangan susah,\nNanti malah tambah keruh.',
  'Pergi ke sawah menanam padi,\nPadi tumbuh subur sekali,\nRajin belajar di pagi hari,\nCita-cita pasti tercapai nanti.',
  'Beli soto di warung Pak Budi,\nSoto dinikmati dengan nasi,\nKalau kamu rajin mengaji,\nHidupmu berkah sepanjang hari.',
  'Ada bebek di pinggir kali,\nBebek berenang dengan senang,\nJangan menyerah dalam mencari,\nRezeki datang tak disangka datang.',
  'Buah mangga buah rambutan,\nManis rasanya di dalam mulut,\nJangan pernah lupa teman,\nKarena teman itu sahabat sejati.',
  'Pergi ke pantai membawa bekal,\nPantainya indah di sore hari,\nKalau hati sedang galau,\nIngat Allah, hati jadi berseri.',
  'Kucing mengeong di malam hari,\nSuaranya merdu tiada tara,\nKalau kamu ingin sukses nanti,\nBelajar tekun sejak sekaranglah.',
  'Anak ayam turun sepuluh,\nMati satu tinggal sembilan,\nKalau kamu ingin maju,\nJangan malas, jangan putus asa.',
  'Bunga mawar bunga melati,\nHarum baunya di pagi hari,\nJagalah lisan dan hati,\nAgar hidup damai berseri.',
  'Pisang emas dibawa berlayar,\nMasak sebiji di dalam peti,\nUtang emas boleh dibayar,\nUtang budi dibawa mati.',
  'Pergi ke pasar membeli duku,\nDuku dibeli bersama kawan,\nJanganlah kamu bersedih dulu,\nRezeki takkan pernah tertukar.',
  'Ikan hiu makan tomat,\nTomat dibeli di pasar malam,\nKalau kamu orang yang hebat,\nJangan lupa sholat lima waktu malam.',
  'Beli bakso di depan rumah,\nBakso dimakan bersama teman,\nJadilah orang yang amanah,\nAgar dipercaya banyak orang.',
  'Menanam jagung di kebun,\nJagung tumbuh berbaris rapi,\nKalau kamu rajin dan tekun,\nCita-citamu pasti tercapai nanti.',
  'Burung merpati terbang tinggi,\nHinggap sebentar di dahan kayu,\nJangan pernah iri pada orang lain,\nSyukuri apa yang ada padamu.',
  'Pergi ke toko membeli kain,\nKain dibeli warna merah,\nKalau kamu rajin berdoa,\nHidupmu akan penuh berkah.',
  'Buah semangka buah duku,\nManis rasanya di mulut,\nJanganlah kamu berburuk sangka,\nNanti hidupmu jadi keruh.',
  'Ada kupu di taman bunga,\nTerbang indah ke sana kemari,\nKalau kamu rajin bekerja,\nRezeki datang tak perlu dicari.',
  'Membeli sayur di pasar pagi,\nSayurnya segar dari kebun,\nJadilah pribadi yang baik hati,\nAgar hidupmu penuh keberuntungan.',
  'Pohon kelapa di tepi pantai,\nBuahnya muda dibuat santan,\nJangan lupa berbagi kebaikan,\nKarena itu bekal di kemudian.',
  'Naik perahu ke tengah laut,\nLautnya biru luas terbentang,\nJangan pernah putus semangat,\nKarena sukses butuh perjuangan.',
  'Pergi ke hutan mencari kayu,\nKayu dibawa ke pasar minggu,\nHormati orang tua dan guru,\nAgar hidupmu berkah selalu.',
  'Beli durian di pasar sore,\nDurian matang harum baunya,\nJangan malas di waktu muda,\nKelak menyesal di waktu tua.',
  'Anak itik belajar berenang,\nBerenang di kolam bersama induk,\nKalau kamu ingin menang,\nBerlatihlah dengan sungguh-sungguh.',
  'Membeli terong di pasar sayur,\nTerong dimasak jadi sayuran,\nKalau kamu ingin makmur,\nBekerjalah dengan kejujuran.',
  'Kembang sepatu di halaman,\nBerwarna merah indah sekali,\nJanganlah kamu berputus asa,\nSetiap masalah pasti ada solusi.',
  'Pergi memancing ke sungai,\nDapat ikan besar sekali,\nJangan lupa bersyukur tiap hari,\nNikmat Tuhan tak terhitung lagi.',
  'Buah jeruk buah apel,\nDimakan bersama keluarga,\nKalau kamu rajin belajar,\nMasa depanmu pasti bahagia.',
  'Bintang bersinar di malam hari,\nMenemani bulan yang purnama,\nJadilah orang yang rendah hati,\nAgar dicintai sesama manusia.',
  'Bunga melati harum mewangi,\nDitanam di depan rumah,\nJangan lupa berbagi rezeki,\nKarena berbagi menambah berkah.',
];
module.exports = {
  name: 'pantun', category: 'fun',
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    await sock.sendMessage(from, { text: `🎭 *PANTUN* (${PANTUN.length})\n\n${random(PANTUN)}` }, { quoted: msg });
  }
};
