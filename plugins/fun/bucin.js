const BUCIN = [
  'Kamu tahu nggak, aku bisa lupa makan, tapi nggak bisa lupa kamu.',
  'Setiap detik tanpa kamu terasa seperti setahun.',
  'Kamu adalah alasan aku senyum sendiri tengah malam.',
  'Aku nggak butuh langit berbintang, cukup kamu di sisiku.',
  'Kamu itu rumah, tempat aku selalu ingin pulang.',
  'Kalau rindu bisa dihitung, mungkin angkanya sudah tak terhingga.',
  'Aku mencintaimu bukan karena siapa kamu, tapi karena aku jadi siapa saat bersamamu.',
  'Kamu adalah bab terindah dalam cerita hidupku.',
  'Setiap kali aku menutup mata, wajahmu yang pertama muncul.',
  'Kamu adalah doa yang tanpa sadar selalu aku sebut.',
  'Aku rela menunggu lama, asal akhirnya bersamamu.',
  'Kamu itu seperti napas, tanpa kamu aku tak bisa hidup.',
  'Cinta ini bukan sekadar kata, tapi perasaan yang tumbuh setiap hari.',
  'Kamu adalah bintang yang menerangi malam-malam gelapku.',
  'Aku tidak butuh dunia, cukup kamu yang selalu ada.',
  'Kalau kamu bahagia, aku juga bahagia. Sesederhana itu.',
  'Kamu adalah alasan aku percaya bahwa cinta itu nyata.',
  'Setiap pesan darimu adalah hal yang paling aku tunggu.',
  'Aku ingin jadi alasan kamu tersenyum setiap hari.',
  'Kamu itu seperti kopi pagi, selalu bikin semangat.',
  'Tidak ada yang bisa menggantikan posisimu di hatiku.',
  'Aku mencintaimu lebih dari yang bisa diungkapkan kata-kata.',
  'Kamu adalah tempatku berlabuh setelah lelah berlayar.',
  'Bersamamu, waktu terasa terlalu cepat berlalu.',
  'Kamu adalah bagian terbaik dari hari-hariku.',
];

module.exports = {
  name: 'bucin',
  category: 'fun',
  aliases: ['baper', 'romantis'],
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    await sock.sendMessage(from, { text: `💞 *KATA BUCIN* (${BUCIN.length})\n\n${random(BUCIN)}` }, { quoted: msg });
  },
};
