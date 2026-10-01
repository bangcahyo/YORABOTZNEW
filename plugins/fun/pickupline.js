const LINES = [
  'Apakah kamu magnet? Karena aku selalu tertarik padamu.',
  'Kamu pasti capek ya? Karena seharian ini kamu terus ada di pikiranku.',
  'Apakah kamu listrik? Karena aku terasa tersengat saat melihatmu.',
  'Kamu tahu nggak, aku kehilangan nomor teleponku. Boleh minta nomormu?',
  'Kalau kamu adalah lagu, kamu akan jadi lagu yang aku putar terus tanpa bosan.',
  'Apakah ayahmu seorang pencuri? Karena dia mencuri bintang dan menaruhnya di matamu.',
  'Kamu pasti seorang fotografer ya? Karena setiap kali aku lihatmu, aku tersenyum.',
  'Apakah kamu hujan? Karena aku ingin berlama-lama di bawahmu.',
  'Aku tidak percaya cinta pada pandangan pertama, tapi saat melihatmu, aku mulai percaya.',
  'Kamu tahu nggak apa yang lebih manis dari madu? Senyummu.',
  'Apakah kamu seorang guru? Karena kamu mengajarkanku arti jatuh cinta.',
  'Kalau kamu jadi bintang, aku rela jadi langit agar bisa selalu menaungimu.',
  'Apakah kamu kopi? Karena kamu membuatku terjaga sepanjang malam.',
  'Kamu tahu nggak, aku butuh peta. Karena aku tersesat di matamu.',
  'Apakah kamu seorang artis? Karena kamu mencuri perhatianku sepenuhnya.',
  'Kalau cinta itu kejahatan, aku rela dipenjara asal bersamamu.',
  'Kamu tahu nggak kenapa aku suka senja? Karena warnanya mirip pipimu saat tersipu.',
  'Apakah kamu buku? Karena aku ingin membaca setiap halaman tentangmu.',
  'Kamu seperti sinyal 5G, cepat membuat hatiku terhubung padamu.',
  'Apakah kamu matahari? Karena tanpa kamu, hariku terasa gelap.',
  'Kalau kamu jadi soal matematika, aku rela mengerjakanmu sampai tuntas.',
  'Kamu tahu nggak, aku tidak butuh jam alarm lagi. Karena memikirkanmu sudah cukup membuatku terjaga.',
  'Apakah kamu seorang detektif? Karena kamu berhasil menemukan hatiku.',
  'Kamu seperti obat, karena kehadiranmu menyembuhkan hariku yang lelah.',
  'Kalau kamu jadi warna, kamu pasti merah. Karena kamu membuat hatiku berdebar.',
];

module.exports = {
  name: 'pickupline',
  category: 'fun',
  aliases: ['pickup', 'rayuan'],
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    await sock.sendMessage(from, { text: `💌 *PICK UP LINE* (${LINES.length})\n\n${random(LINES)}` }, { quoted: msg });
  },
};
