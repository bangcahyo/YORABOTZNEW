const DATA = [
  { planet: 'merkurius', clue: 'Planet terdekat dengan matahari, terkecil di tata surya' },
  { planet: 'venus', clue: 'Planet terpanas, dijuluki bintang kejora' },
  { planet: 'bumi', clue: 'Planet tempat kita tinggal, satu-satunya berkehidupan' },
  { planet: 'mars', clue: 'Planet merah, target misi manusia berikutnya' },
  { planet: 'jupiter', clue: 'Planet terbesar di tata surya, punya bintik merah raksasa' },
  { planet: 'saturnus', clue: 'Planet paling indah karena cincinnya' },
  { planet: 'uranus', clue: 'Planet yang berputar miring, berwarna biru kehijauan' },
  { planet: 'neptunus', clue: 'Planet terjauh dari matahari, berwarna biru' },
  { planet: 'pluto', clue: 'Dulu planet, sekarang dikategorikan planet kerdil' },
  { planet: 'matahari', clue: 'Bukan planet, bintang pusat tata surya' },
  { planet: 'bulan', clue: 'Bukan planet, satelit alami bumi' },
  { planet: 'titan', clue: 'Bukan planet, satelit terbesar Saturnus' },
  { planet: 'ganymede', clue: 'Bukan planet, satelit terbesar Jupiter dan tata surya' },
  { planet: 'mars', clue: 'Planet yang memiliki dua bulan: Phobos & Deimos' },
  { planet: 'jupiter', clue: 'Planet dengan jumlah bulan terbanyak' },
  { planet: 'venus', clue: 'Planet yang berputar berlawanan arah dengan planet lain' },
  { planet: 'bumi', clue: 'Planet dengan 71% permukaannya air' },
  { planet: 'merkurius', clue: 'Planet yang tidak punya atmosfer tebal, suhunya ekstrem' },
  { planet: 'saturnus', clue: 'Planet dengan kepadatan lebih ringan dari air' },
  { planet: 'uranus', clue: 'Planet es raksasa pertama yang ditemukan dengan teleskop' },
];

module.exports = {
  name: 'tebakplanet',
  category: 'game',
  aliases: ['tbplanet', 'planet'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'tebakplanet', jawab: d.planet, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${d.planet}*` });
    });
    await sock.sendMessage(from, {
      text: `🪐 *TEBAK PLANET*\n\n${d.clue}\n\nPlanet apakah ini?\n\n💬 *Ketik jawabanmu langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +3 Point, +Rp 700`,
    });
  },
};
