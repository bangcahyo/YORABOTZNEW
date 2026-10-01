const DATA = [
  { q: 'Apa yang selalu datang tapi tidak pernah tiba?', a: 'besok' },
  { q: 'Semakin banyak diambil semakin besar. Apakah itu?', a: 'lubang' },
  { q: 'Apa yang bisa kamu tangkap tapi tidak bisa dilempar?', a: 'flu' },
  { q: 'Punya kepala tapi tidak punya otak, punya badan tapi tidak punya kaki. Apakah itu?', a: 'bantal' },
  { q: 'Apa yang naik tapi tidak pernah turun?', a: 'umur' },
  { q: 'Apa yang berjalan tapi tidak punya kaki?', a: 'waktu' },
  { q: 'Apa yang bisa kamu pecahkan tanpa menyentuhnya?', a: 'janji' },
  { q: 'Apa yang punya banyak gigi tapi tidak bisa menggigit?', a: 'sisir' },
  { q: 'Apa yang punya mata tapi tidak bisa melihat?', a: 'jarum' },
  { q: 'Apa yang dipegang di tangan tapi bisa menembus dinding?', a: 'paku' },
  { q: 'Apa yang basah saat mengeringkan?', a: 'handuk' },
  { q: 'Apa yang bisa terbang tanpa sayap?', a: 'waktu' },
  { q: 'Semakin kamu ambil, semakin banyak yang tersisa. Apakah itu?', a: 'jejak kaki' },
  { q: 'Apa yang selalu di depanmu tapi tidak bisa kamu lihat?', a: 'masa depan' },
  { q: 'Apa yang bisa kamu dengar tapi tidak bisa kamu lihat?', a: 'suara' },
  { q: 'Punya leher tapi tidak punya kepala. Apakah itu?', a: 'botol' },
  { q: 'Apa yang berwarna putih, hitam, dan bacaannya dari kiri ke kanan?', a: 'koran' },
  { q: 'Apa yang bisa mengisi ruangan tapi tidak memakan tempat?', a: 'cahaya' },
  { q: 'Apa yang turun tapi tidak pernah naik?', a: 'hujan' },
  { q: 'Apa yang bisa kamu bagi tapi tidak bisa kamu potong?', a: 'rahasia' },
  { q: 'Apa yang ada di ujung pelangi?', a: 'huruf i' },
  { q: 'Apa yang punya satu mata tapi tidak bisa melihat?', a: 'jarum' },
  { q: 'Apa yang bisa menampung air tapi penuh lubang?', a: 'spons' },
  { q: 'Apa yang dimiliki semua orang tapi jarang dipakai?', a: 'otak' },
  { q: 'Apa yang bisa kau pegang tanpa tangan?', a: 'napas' },
  { q: 'Apa yang menjadi lebih kecil saat ditambah?', a: 'api' },
  { q: 'Apa yang tidak bisa dilihat, disentuh, tapi bisa dirasakan?', a: 'cinta' },
  { q: 'Apa yang selalu mengikuti tapi tidak pernah bisa ditangkap?', a: 'bayangan' },
  { q: 'Apa yang berisi air tapi bukan gelas?', a: 'sumur' },
  { q: 'Apa yang bisa terbang tinggi tanpa mesin?', a: 'burung' },
  { q: 'Apa yang punya wajah dan tangan tapi tidak punya kaki?', a: 'jam' },
  { q: 'Apa yang bisa kamu buka tapi tidak bisa kamu tutup?', a: 'masa lalu' },
  { q: 'Apa yang ada di tengah laut?', a: 'huruf u' },
  { q: 'Apa yang berbicara tanpa mulut?', a: 'gaung' },
  { q: 'Apa yang punya banyak kunci tapi tidak punya pintu?', a: 'piano' },
];

module.exports = {
  name: 'asahotak',
  category: 'game',
  aliases: ['asahotak', 'brainteaser', 'teka'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'asahotak', jawab: d.a, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${d.a}*` });
    });
    await sock.sendMessage(from, {
      text: `🧠 *ASAH OTAK*\n\n${d.q}\n\n💬 *Ketik jawabanmu langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +3 Point, +Rp 700`,
    });
  },
};
