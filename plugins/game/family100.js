const DATA = [
  { q: 'Sebutkan sesuatu yang biasa dibawa ke sekolah!', jawab: ['tas', 'buku', 'pulpen', 'pensil', 'buku tulis', 'penghapus'] },
  { q: 'Sebutkan hewan yang ada di kebun binatang!', jawab: ['singa', 'gajah', 'jerapah', 'harimau', 'monyet', 'zebra'] },
  { q: 'Sebutkan buah berwarna merah!', jawab: ['apel', 'stroberi', 'semangka', 'ceri', 'tomat', 'delima'] },
  { q: 'Sebutkan benda yang ada di dapur!', jawab: ['kompor', 'panci', 'wajan', 'pisau', 'sendok', 'piring'] },
  { q: 'Sebutkan alat transportasi darat!', jawab: ['mobil', 'motor', 'bus', 'sepeda', 'kereta', 'truk'] },
  { q: 'Sebutkan pekerjaan yang memakai seragam!', jawab: ['polisi', 'tentara', 'dokter', 'perawat', 'satpam', 'pramugari'] },
  { q: 'Sebutkan warna pelangi!', jawab: ['merah', 'jingga', 'kuning', 'hijau', 'biru', 'nila', 'ungu'] },
  { q: 'Sebutkan olahraga yang memakai bola!', jawab: ['sepak bola', 'basket', 'voli', 'tenis', 'bulu tangkis', 'futsal'] },
  { q: 'Sebutkan benda yang bisa terbang!', jawab: ['pesawat', 'burung', 'helikopter', 'balon', 'roket', 'layang layang'] },
  { q: 'Sebutkan makanan khas Indonesia!', jawab: ['nasi goreng', 'sate', 'rendang', 'soto', 'bakso', 'gado gado'] },
  { q: 'Sebutkan planet di tata surya!', jawab: ['merkurius', 'venus', 'bumi', 'mars', 'jupiter', 'saturnus', 'uranus', 'neptunus'] },
  { q: 'Sebutkan sesuatu yang berwarna putih!', jawab: ['salju', 'kapas', 'susu', 'awan', 'kertas', 'beras'] },
  { q: 'Sebutkan anggota tubuh!', jawab: ['kepala', 'tangan', 'kaki', 'mata', 'hidung', 'mulut', 'telinga'] },
  { q: 'Sebutkan hal yang dilakukan saat pagi hari!', jawab: ['mandi', 'sarapan', 'sholat subuh', 'berolahraga', 'berangkat kerja', 'minum kopi'] },
  { q: 'Sebutkan hewan yang hidup di air!', jawab: ['ikan', 'hiu', 'paus', 'dolphin', 'gurita', 'kura kura'] },
  { q: 'Sebutkan benda elektronik di rumah!', jawab: ['tv', 'kulkas', 'mesin cuci', 'ac', 'setrika', 'kipas angin'] },
  { q: 'Sebutkan profesi di bidang kesehatan!', jawab: ['dokter', 'perawat', 'bidan', 'apoteker', 'dokter gigi', 'ahli gizi'] },
  { q: 'Sebutkan sesuatu yang bisa membuat bahagia!', jawab: ['keluarga', 'teman', 'uang', 'makanan', 'liburan', 'cinta'] },
  { q: 'Sebutkan tempat wisata di Indonesia!', jawab: ['bali', 'borobudur', 'raja ampat', 'danau toba', 'bromo', 'labuan bajo'] },
  { q: 'Sebutkan minuman yang menyegarkan!', jawab: ['es teh', 'jus', 'air kelapa', 'soda', 'es jeruk', 'smoothie'] },
  { q: 'Sebutkan hal yang bikin takut!', jawab: ['hantu', 'ketinggian', 'gelap', 'ular', 'kegagalan', 'petir'] },
  { q: 'Sebutkan benda yang ada di kamar mandi!', jawab: ['sabun', 'sikat gigi', 'shampoo', 'handuk', 'ember', 'gayung'] },
  { q: 'Sebutkan olahraga air!', jawab: ['renang', 'selancar', 'menyelam', 'dayung', 'polo air', 'ski air'] },
  { q: 'Sebutkan sesuatu yang ada di langit!', jawab: ['matahari', 'bulan', 'bintang', 'awan', 'pelangi', 'pesawat'] },
  { q: 'Sebutkan hewan berkaki empat!', jawab: ['kucing', 'anjing', 'kuda', 'sapi', 'kambing', 'gajah'] },
];

module.exports = {
  name: 'family100',
  category: 'game',
  aliases: ['family', 'survey'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'family100', jawab: d.jawab, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nContoh jawaban: *${d.jawab[0]}*` });
    });
    await sock.sendMessage(from, {
      text: `👨‍👩‍👧‍👦 *FAMILY 100*\n\n${d.q}\n\nAda *${d.jawab.length} jawaban* yang benar!\n\n💬 *Ketik jawabanmu langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +4 Point, +Rp 900`,
    });
  },
};
