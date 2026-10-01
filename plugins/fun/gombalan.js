const GOMBALAN = [
  'Kamu tahu nggak bedanya kamu sama kopi? Kalau kopi bikin melek, kalau kamu bikin aku nggak bisa tidur.',
  'Kamu itu kayak wifi. Nggak kelihatan, tapi selalu bikin aku kangen koneksinya.',
  'Aku nggak butuh GPS, karena hatiku udah tahu jalan ke kamu.',
  'Kamu itu kayak matahari. Nggak bisa aku lihat lama-lama, tapi selalu bikin hariku cerah.',
  'Kalau kamu jadi soal ujian, aku rela belajar seumur hidup biar bisa jawab kamu.',
  'Kamu itu kayak hujan di musim kemarau. Datangnya jarang, tapi selalu dinanti.',
  'Aku nggak jago matematika, tapi aku tahu kalau aku + kamu = bahagia.',
  'Kamu tahu nggak kenapa aku suka bangun pagi? Karena aku ingin jadi orang pertama yang mikirin kamu.',
  'Kamu itu kayak lagu favoritku. Nggak pernah bosan aku dengar berulang-ulang.',
  'Kalau cinta itu buta, berarti aku buta karena nggak bisa lihat orang lain selain kamu.',
  'Aku nggak butuh peta, karena kamu udah jadi tujuanku.',
  'Kamu itu kayak kunci, karena kamu yang bisa buka pintu hatiku.',
  'Setiap kali aku lihat kamu, aku lupa apa yang mau aku bilang. Kamu bikin aku speechless.',
  'Kamu tahu nggak bedanya kamu sama bintang? Bintang di langit, kamu di hatiku.',
  'Aku rela jadi charger, asal kamu yang jadi HP-nya. Biar aku yang isi energimu.',
  'Kalau kamu jadi hujan, aku rela basah kuyup asal bisa dekat sama kamu.',
  'Kamu itu kayak buku favoritku, susah aku berhenti baca, apalagi melupakan.',
  'Aku nggak butuh obat tidur, cukup lihat fotomu, aku langsung tenang.',
  'Kamu itu kayak gula. Bikin hidupku manis setiap hari.',
  'Kalau ada yang tanya apa cita-citaku, jawabannya sederhana: bahagia sama kamu.',
  'Kamu itu kayak sinyal, kadang hilang, tapi selalu aku tunggu kembalinya.',
  'Aku nggak pandai merangkai kata, tapi hatiku selalu merangkai namamu.',
  'Kamu tahu nggak kenapa aku suka malam? Karena malam bikin aku makin rindu kamu.',
  'Kalau kamu jadi hujan, aku jadi payung. Biar aku yang jaga kamu dari basah.',
  'Aku nggak butuh kacamata, karena kamu udah jelas di hatiku.',
];

module.exports = {
  name: 'gombalan',
  category: 'fun',
  aliases: ['gombal', 'gombalreceh'],
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    await sock.sendMessage(from, { text: `💘 *GOMBALAN* (${GOMBALAN.length})\n\n${random(GOMBALAN)}` }, { quoted: msg });
  },
};
