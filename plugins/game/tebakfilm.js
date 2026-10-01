const DATA = [
  { sinopsis: 'Seorang pemuda desa merantau ke kota dan jatuh cinta, dibintangi oleh aktor legendaris Indonesia.', jawab: ['ada apa dengan cinta', 'aadc'] },
  { sinopsis: 'Film horor Indonesia tentang seorang wanita yang kerasukan setelah memakai baju bekas dari toko.', jawab: ['pengabdi setan'] },
  { sinopsis: 'Kisah cinta sepasang kekasih yang terpisah karena perbedaan status sosial, sangat populer tahun 2000-an.', jawab: ['eiffel i\'m in love', 'eiffel im in love'] },
  { sinopsis: 'Film animasi tentang mainan yang hidup saat manusia tidak melihat.', jawab: ['toy story'] },
  { sinopsis: 'Film tentang kapal pesiar raksasa yang menabrak gunung es dan tenggelam.', jawab: ['titanic'] },
  { sinopsis: 'Film superhero tentang pria yang bisa memanjat gedung dan menembak jaring.', jawab: ['spiderman', 'spider man', 'spider-man'] },
  { sinopsis: 'Film tentang dunia sihir dan sekolah Hogwarts.', jawab: ['harry potter'] },
  { sinopsis: 'Film tentang bajak laut yang mencari harta karun, dibintangi Johnny Depp.', jawab: ['pirates of the caribbean', 'pirate'] },
  { sinopsis: 'Film tentang mobil yang bisa berubah menjadi robot.', jawab: ['transformers'] },
  { sinopsis: 'Film tentang dinosaurus yang hidup kembali di sebuah taman hiburan.', jawab: ['jurassic park', 'jurassic world'] },
  { sinopsis: 'Film tentang seorang pria yang terjebak dalam mimpi berlapis-lapis.', jawab: ['inception'] },
  { sinopsis: 'Film tentang kapal luar angkasa dan perang bintang.', jawab: ['star wars'] },
  { sinopsis: 'Film tentang seorang pembunuh bayaran yang pensiun namun dipaksa kembali bertarung.', jawab: ['john wick'] },
  { sinopsis: 'Film tentang keluarga superhero yang memiliki kekuatan super.', jawab: ['incredibles', 'the incredibles'] },
  { sinopsis: 'Film tentang seorang gadis yang terjatuh ke negeri ajaib penuh keajaiban.', jawab: ['alice in wonderland', 'alice'] },
  { sinopsis: 'Film tentang sekelompok pahlawan super yang menyelamatkan bumi dari alien.', jawab: ['avengers'] },
  { sinopsis: 'Film tentang raja singa yang memperebutkan takhta kerajaan.', jawab: ['the lion king', 'lion king'] },
  { sinopsis: 'Film tentang seorang pria yang bisa berbicara dengan hewan.', jawab: ['dr dolittle', 'dolittle'] },
  { sinopsis: 'Film tentang perjuangan seorang guru di daerah terpencil, dibintangi oleh aktor Indonesia.', jawab: ['laskar pelangi'] },
  { sinopsis: 'Film animasi tentang seorang anak yang berpetualang mencari ayahnya yang seorang kapten kapal.', jawab: ['finding nemo', 'nemo'] },
  { sinopsis: 'Film tentang seorang hacker yang menemukan kebenaran dunia yang penuh ilusi.', jawab: ['the matrix', 'matrix'] },
  { sinopsis: 'Film tentang seorang pria yang hidup sendirian di Mars.', jawab: ['the martian', 'martian'] },
  { sinopsis: 'Film tentang persahabatan antara manusia dan alien kecil berwarna coklat.', jawab: ['et', 'e.t.'] },
  { sinopsis: 'Film tentang seorang gadis pemberani yang bertarung melawan naga.', jawab: ['mulan'] },
  { sinopsis: 'Film tentang seorang putri yang tertidur panjang karena kutukan.', jawab: ['sleeping beauty', 'snow white'] },
  { sinopsis: 'Film tentang seorang detektif jenius bernama Sherlock.', jawab: ['sherlock'] },
  { sinopsis: 'Film tentang pertarungan mobil ilegal di jalanan.', jawab: ['fast and furious', 'fast furious'] },
  { sinopsis: 'Film tentang seorang anak yang bisa melihat makhluk halus.', jawab: ['the sixth sense'] },
  { sinopsis: 'Film tentang seorang wanita yang bertarung di arena kelaparan.', jawab: ['the hunger games', 'hunger games'] },
  { sinopsis: 'Film tentang sekelompok hewan yang melarikan diri dari kebun binatang.', jawab: ['madagascar'] },
];

module.exports = {
  name: 'tebakfilm',
  category: 'game',
  aliases: ['tfilm', 'tebakmovie'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'tebakfilm', jawab: d.jawab, sender };
    setGameTimeout(from, async () => {
      const jwb = Array.isArray(d.jawab) ? d.jawab[0] : d.jawab;
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${jwb}*` });
    });
    await sock.sendMessage(from, {
      text: `🎬 *TEBAK FILM*\n\n📖 Sinopsis:\n_${d.sinopsis}_\n\n💬 *Ketik judul filmnya langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +4 Point, +Rp 900`,
    });
  },
};
