const DATA = [
  { q: 'Aku selalu di dekatmu, tapi saat kau mendekat aku menghilang. Siapakah aku?', a: 'bayangan' },
  { q: 'Aku punya kota, gunung, dan sungai, tapi aku bukan dunia. Siapakah aku?', a: 'peta' },
  { q: 'Aku bisa kau lihat di cermin tapi tidak bisa kau sentuh. Siapakah aku?', a: 'pantulan' },
  { q: 'Aku punya jarum tapi tidak bisa menjahit. Siapakah aku?', a: 'jam' },
  { q: 'Aku punya daun tapi bukan pohon, punya halaman tapi bukan rumah. Siapakah aku?', a: 'buku' },
  { q: 'Aku selalu basah tapi bukan air. Siapakah aku?', a: 'handuk' },
  { q: 'Aku bisa terbang tanpa sayap dan menangis tanpa mata. Siapakah aku?', a: 'awan' },
  { q: 'Aku punya mahkota tapi bukan raja. Siapakah aku?', a: 'ratu' },
  { q: 'Aku punya gigi tapi tidak bisa menggigit. Siapakah aku?', a: 'sisir' },
  { q: 'Aku punya kaki tapi tidak bisa berjalan. Siapakah aku?', a: 'meja' },
  { q: 'Aku bisa memecah keheningan tanpa suara. Siapakah aku?', a: 'senyuman' },
  { q: 'Aku hidup tanpa bernapas, tumbuh tanpa makan. Siapakah aku?', a: 'api' },
  { q: 'Aku punya kunci tapi tidak bisa membuka pintu. Siapakah aku?', a: 'piano' },
  { q: 'Aku punya sayap tapi tidak bisa terbang. Siapakah aku?', a: 'pesawat' },
  { q: 'Aku selalu haus tapi tidak pernah minum. Siapakah aku?', a: 'spons' },
  { q: 'Aku punya leher panjang tapi tidak punya kepala. Siapakah aku?', a: 'jerapah' },
  { q: 'Aku bisa kau dengar berkali-kali tapi tidak pernah kau lihat. Siapakah aku?', a: 'gaung' },
  { q: 'Aku punya mata banyak tapi tidak bisa melihat. Siapakah aku?', a: 'kentang' },
  { q: 'Aku berjalan tanpa kaki dan terbang tanpa sayap. Siapakah aku?', a: 'angin' },
  { q: 'Aku bisa membunuh tanpa senjata dan menyembuhkan tanpa obat. Siapakah aku?', a: 'kata kata' },
  { q: 'Aku punya rumah tapi tinggal di jalan. Siapakah aku?', a: 'siput' },
  { q: 'Aku selalu tidur tapi tidak pernah bangun. Siapakah aku?', a: 'batu' },
  { q: 'Aku bisa memuat lautan tapi tidak bisa basah. Siapakah aku?', a: 'peta' },
  { q: 'Aku punya ekor tapi tidak punya kepala. Siapakah aku?', a: 'komet' },
  { q: 'Aku berwarna hitam saat bersih dan putih saat kotor. Siapakah aku?', a: 'papan tulis' },
  { q: 'Aku bisa kau pegang tanpa tangan dan lihat tanpa mata. Siapakah aku?', a: 'mimpi' },
  { q: 'Aku punya banyak ruang tapi tidak punya dinding. Siapakah aku?', a: 'angkasa' },
  { q: 'Aku selalu di belakangmu tapi tidak pernah kau lihat. Siapakah aku?', a: 'punggung' },
  { q: 'Aku bisa menangis tanpa mata dan menutup tanpa tangan. Siapakah aku?', a: 'kelopak' },
  { q: 'Aku punya bintang tapi bukan langit. Siapakah aku?', a: 'bendera' },
];

module.exports = {
  name: 'siapakahaku',
  category: 'game',
  aliases: ['siapakah', 'whoami', 'tebakaku'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'siapakahaku', jawab: d.a, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${d.a}*` });
    });
    await sock.sendMessage(from, {
      text: `🕵️ *SIAPAKAH AKU?*\n\n${d.q}\n\n💬 *Ketik jawabanmu langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +3 Point, +Rp 750`,
    });
  },
};
