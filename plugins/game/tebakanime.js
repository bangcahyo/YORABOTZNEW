const DATA = [
  { anime: 'naruto', clue: 'Ninja berambut pirang, punya rubah ekor sembilan di dalam tubuhnya' },
  { anime: 'one piece', clue: 'Bajak laut berkulit karet yang mencari harta karun legendaris' },
  { anime: 'dragon ball', clue: 'Petarung berambut runcing yang mengumpulkan tujuh bola naga' },
  { anime: 'bleach', clue: 'Remaja yang menjadi shinigami pengganti, pedang raksasa' },
  { anime: 'attack on titan', clue: 'Manusia bertarung melawan raksasa pemakan manusia' },
  { anime: 'death note', clue: 'Buku catatan yang bisa membunuh siapa saja yang namanya ditulis' },
  { anime: 'sailor moon', clue: 'Gadis pelindung bulan dengan kekuatan sihir' },
  { anime: 'doraemon', clue: 'Robot kucing dari abad 22, punya kantong ajaib' },
  { anime: 'conan', clue: 'Detektif cilik yang sebenarnya remaja bernama Shinichi' },
  { anime: 'slam dunk', clue: 'Anime tentang basket, tokoh utamanya Hanamichi Sakuragi' },
  { anime: 'hunter x hunter', clue: 'Gon mencari ayahnya, konsep "Nen"' },
  { anime: 'my hero academia', clue: 'Dunia superhero, tokoh utamanya Izuku Midoriya' },
  { anime: 'demon slayer', clue: 'Pembasmi iblis bernama Tanjiro, pedang air' },
  { anime: 'jujutsu kaisen', clue: 'Petarung kutukan, tokoh utamanya Yuji Itadori' },
  { anime: 'sword art online', clue: 'Pemain terjebak dalam game VR, tokoh Kirito' },
  { anime: 'pokemon', clue: 'Ash Ketchum menangkap monster saku' },
  { anime: 'digimon', clue: 'Monster digital, teman para anak terpilih' },
  { anime: 'fairy tail', clue: 'Guild penyihir, tokoh Natsu si penyihir api' },
  { anime: 'one punch man', clue: 'Pahlawan botak yang bisa kalahkan musuh dengan satu pukulan' },
  { anime: 'tokyo ghoul', clue: 'Manusia setengah ghoul bernama Ken Kaneki' },
  { anime: 'spy x family', clue: 'Mata-mata, pembunuh, dan anak telepati jadi keluarga palsu' },
  { anime: 'fullmetal alchemist', clue: 'Dua kakak beradik alkemis mencari batu bertuah' },
  { anime: 'saint seiya', clue: 'Ksatria dengan armor zodiak, melindungi Athena' },
  { anime: 'inuyasha', clue: 'Gadis yang masuk ke sumur waktu, bertemu setengah iblis' },
  { anime: 'yu gi oh', clue: 'Duel monster dengan kartu, tokoh Yugi' },
  { anime: 'crayon shinchan', clue: 'Anak TK nakal berpipi gendut' },
  { anime: 'detective conan', clue: 'Nama lain dari anime Conan' },
  { anime: 'gundam', clue: 'Robot raksasa pilot manusia, perang antariksa' },
  { anime: 'evangelion', clue: 'Robot melawan malaikat, tokoh Shinji' },
  { anime: 'volleyball', clue: 'Haikyuu adalah anime tentang olahraga ini' },
];

module.exports = {
  name: 'tebakanime',
  category: 'game',
  aliases: ['tbanime', 'anime'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'tebakanime', jawab: d.anime, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${d.anime}*` });
    });
    await sock.sendMessage(from, {
      text: `🎌 *TEBAK ANIME*\n\n${d.clue}\n\nAnime apakah ini?\n\n💬 *Ketik jawabanmu langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +4 Point, +Rp 900`,
    });
  },
};
