const DARES = [
  'Kirim pesan "Aku sayang kamu" ke orang random!',
  'Ganti nama WhatsApp jadi "Yora Botz" selama 1 jam!',
  'Kirim voice note nyanyi lagu anak-anak!',
  'Tag semua member grup!',
  'Kirim selfie sekarang ke grup ini!',
  'Tirukan suara hewan selama 10 detik!',
  'Kirim pesan "Aku ganteng/cantik" ke 3 orang!',
  'Update status WA dengan kata "Aku sedang bahagia"!',
  'Kirim stiker lucu 5 kali berturut-turut!',
  'Sebutkan 5 nama mantan kamu (kalau ada)!',
  'Kirim voice note bilang "Aku kangen kamu" ke orang random!',
  'Screenshot chat terakhirmu dan kirim ke grup!',
  'Telepon seseorang dan nyanyikan lagu ulang tahun!',
  'Kirim emoji ❤️ ke orang ke-10 di daftar kontakmu!',
  'Ceritakan mimpi teranehmu semalam!',
  'Panggil semua orang di grup dengan sebutan "Bos"!',
  'Kirim foto makanan terakhirmu ke grup!',
  'Bilang "Aku yang paling keren" 3 kali di voice note!',
  'Ganti foto profil dengan foto hewan selama 1 jam!',
  'Kirim pesan "Kamu lucu deh" ke orang random!',
  'Tulis status WA "Aku sedang galau" selama 30 menit!',
  'Kirim voice note ketawa selama 5 detik!',
  'Sebutkan 3 hal yang kamu suka dari orang di sebelahmu!',
  'Kirim pesan "Ayo main" ke 5 orang sekaligus!',
  'Nyanyikan lagu favoritmu dalam voice note!',
  'Buat pantun tentang orang yang kamu suka, kirim ke grup!',
  'Kirim emoticon 😘 ke 3 orang berturut-turut!',
  'Bilang "Aku salah, kamu benar" ke orang yang terakhir kamu debat!',
  'Kirim pesan "Selamat pagi" padahal sekarang malam!',
  'Tulis 3 kata pujian untuk admin grup!',
];

module.exports = {
  name: 'dare',
  category: 'fun',
  aliases: ['tantangan'],
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    await sock.sendMessage(from, { text: `🔥 *DARE* (${DARES.length})\n\n${random(DARES)}` }, { quoted: msg });
  },
};
