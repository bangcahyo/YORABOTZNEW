const DATA = [
  { q: 'Kucing apa yang bisa terbang?', a: 'kucing terbang' },
  { q: 'Ayam apa yang bisa naik pohon?', a: 'ayam yang bisa naik pohon' },
  { q: 'Pisang apa yang bikin ngantuk?', a: 'pisang tidur' },
  { q: 'Bebek apa yang bisa bikin kamu kenyang?', a: 'bebek bacem' },
  { q: 'Kambing apa yang bisa berenang?', a: 'kambing laut' },
  { q: 'Sapi apa yang bisa terbang ke bulan?', a: 'sapi terbang' },
  { q: 'Kenapa lampu lalu lintas warnanya merah, kuning, hijau?', a: 'karena kalau ungu tidak ada yang tau' },
  { q: 'Buah apa yang tidak bisa dimakan?', a: 'buah bibir' },
  { q: 'Air apa yang bisa naik ke atas?', a: 'air mata' },
  { q: 'Hewan apa yang paling kuat mengangkat beban?', a: 'kuli bangunan' },
  { q: 'Kenapa ayam menyeberang jalan?', a: 'karena jalan itu di depannya' },
  { q: 'Apa bedanya sepatu dan sandal?', a: 'kalau sepatu disemir, kalau sandal disandal' },
  { q: 'Nasi apa yang tidak bisa dimakan?', a: 'nasihat' },
  { q: 'Batu apa yang bisa dimakan?', a: 'batu tahu' },
  { q: 'Ikan apa yang bisa terbang?', a: 'ikan terbang' },
  { q: 'Mobil apa yang bisa terbang?', a: 'mobil terbang' },
  { q: 'Pintu apa yang tidak bisa dibuka?', a: 'pintu hati' },
  { q: 'Kursi apa yang bisa berjalan?', a: 'kursi roda' },
  { q: 'Bola apa yang bisa dimakan?', a: 'bola tahu' },
  { q: 'Tahu apa yang paling besar?', a: 'tahukan kamu' },
  { q: 'Telur apa yang tidak bisa dipecah?', a: 'telur yang belum dibeli' },
  { q: 'Roti apa yang bisa terbang?', a: 'roti terbang' },
  { q: 'Kue apa yang paling ditakuti?', a: 'kue yang beracun' },
  { q: 'Kenapa matahari terbit dari timur?', a: 'karena kalau dari barat namanya terbenam' },
  { q: 'Kenapa air laut rasanya asin?', a: 'karena ikannya banyak yang berkeringat' },
  { q: 'Apa yang lebih besar dari gajah tapi tidak bisa masuk rumah?', a: 'gajah yang lebih besar' },
  { q: 'Buah apa yang punya banyak mata?', a: 'nanas' },
  { q: 'Pisang apa yang paling panjang?', a: 'pisang ambon yang panjang' },
  { q: 'Kacang apa yang tidak bisa dimakan?', a: 'kacang lupa kulitnya' },
  { q: 'Kenapa cicak tidak bisa berjalan mundur?', a: 'karena tidak ada spion' },
  { q: 'Hewan apa yang paling sabar?', a: 'kura kura' },
  { q: 'Bunga apa yang paling wangi?', a: 'bunga yang wangi' },
  { q: 'Sungai apa yang tidak ada airnya?', a: 'sungai di peta' },
  { q: 'Kota apa yang tidak ada penduduknya?', a: 'kota di peta' },
  { q: 'Buku apa yang tidak bisa dibaca?', a: 'buku yang ditutup' },
];

module.exports = {
  name: 'caklontong',
  category: 'game',
  aliases: ['lontong', 'tebaktebakan'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'caklontong', jawab: d.a, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${d.a}*` });
    });
    await sock.sendMessage(from, {
      text: `🎭 *CAK LONTONG*\n\n${d.q}\n\n💬 *Ketik jawabanmu langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +3 Point, +Rp 800`,
    });
  },
};
