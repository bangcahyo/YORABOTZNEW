module.exports = {
  name: 'tebakhewan', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, setGameTimeout, random } = ctx;
    const list = [
      { clue: 'Aku punya belalai panjang, tinggal di Afrika', jawab: 'gajah' },
      { clue: 'Aku raja hutan, suaraku mengaum', jawab: 'singa' },
      { clue: 'Aku hitam putih, jalanku lambat', jawab: 'panda' },
      { clue: 'Aku sangat tinggi, leherku panjang', jawab: 'jerapah' },
      { clue: 'Aku pintar, hidup di laut, suka melompat', jawab: 'lumba-lumba' },
      { clue: 'Aku kecil, suka keju, tidak disukai Tom', jawab: 'tikus' },
      { clue: 'Aku punya tanduk, suka makan rumput', jawab: 'kerbau' },
      { clue: 'Aku melompat tinggi, tinggal di Australia', jawab: 'kanguru' },
      { clue: 'Aku punya 8 kaki, tinggal di jaring', jawab: 'laba-laba' },
      { clue: 'Aku raja laut, punya gigi tajam', jawab: 'hiu' },
      { clue: 'Aku berleher panjang, tanduk di kepala', jawab: 'rusa' },
      { clue: 'Aku berbulu hitam putih, dari China', jawab: 'panda' },
      { clue: 'Aku berwarna kuning, monyet suka aku', jawab: 'pisang' },
      { clue: 'Aku berkulit keras, punya cakar tajam', jawab: 'kura-kura' },
      { clue: 'Aku hijau, suka melompat, hidup di air', jawab: 'katak' },
      { clue: 'Aku punya 4 kaki, suka mengejar tikus', jawab: 'kucing' },
      { clue: 'Aku setia, suka menggonggong', jawab: 'anjing' },
      { clue: 'Aku berwarna oranye, punya belang', jawab: 'harimau' },
      { clue: 'Aku hitam putih, dari Afrika, berbelang', jawab: 'zebra' },
      { clue: 'Aku berleher pendek, badan besar', jawab: 'badak' },
      { clue: 'Aku tinggal di kutub, suka ikan', jawab: 'beruang kutub' },
      { clue: 'Aku besar, hidup di laut, mamalia', jawab: 'paus' },
      { clue: 'Aku kecil, terbang, suka bunga', jawab: 'kupu-kupu' },
      { clue: 'Aku kecil, terbang, suka madu', jawab: 'lebah' },
      { clue: 'Aku punya sayap, terbang di malam hari', jawab: 'kelelawar' },
      { clue: 'Aku burung, tidak bisa terbang, dari Afrika', jawab: 'burung unta' },
      { clue: 'Aku burung, berwarna-warni, bisa bicara', jawab: 'beo' },
      { clue: 'Aku burung, suka meniru suara manusia', jawab: 'kakatua' },
      { clue: 'Aku kucing besar, dari Afrika, ada di kebun binatang', jawab: 'macan tutul' },
      { clue: 'Aku mamalia, tinggal di air, rambutku tebal', jawab: 'berang-berang' },
      { clue: 'Aku hewan terkecil di dunia, suka banget keju', jawab: 'tikus' },
      { clue: 'Aku bergerak pelan, punya rumah di punggung', jawab: 'siput' },
      { clue: 'Aku punya capit, jalanku miring', jawab: 'kepiting' },
      { clue: 'Aku hidup di laut, punya banyak kaki, warna merah', jawab: 'kepiting' },
      { clue: 'Aku punya 8 tangan, hidup di laut', jawab: 'gurita' },
      { clue: 'Aku punya cangkang, hidup di laut', jawab: 'kerang' },
      { clue: 'Aku bertanduk, hidup di Afrika, suka berlari', jawab: 'antelop' },
      { clue: 'Aku hewan tercepat di darat', jawab: 'cheetah' },
      { clue: 'Aku pemakan semut, dari Afrika', jawab: 'aardvark' },
      { clue: 'Aku dari Australia, suka makan daun eucalyptus', jawab: 'koala' },
      { clue: 'Aku dari Australia, tidur sambil bergantung', jawab: 'koala' },
      { clue: 'Aku punya duri, hidup di laut', jawab: 'landak laut' },
      { clue: 'Aku berbulu tebal, hidup di gunung China', jawab: 'panda' },
      { clue: 'Aku hewan tertinggi di dunia', jawab: 'jerapah' },
      { clue: 'Aku hewan terbesar di dunia, hidup di laut', jawab: 'paus biru' },
      { clue: 'Aku burung, berdiri satu kaki di air', jawab: 'bangau' },
      { clue: 'Aku burung pemakan bangkai', jawab: 'elang' },
      { clue: 'Aku burung paling besar, tidak bisa terbang', jawab: 'burung unta' },
      { clue: 'Aku hewan punya tanduk di hidung', jawab: 'badak' },
      { clue: 'Aku hewan khas Indonesia, dari pulau Komodo', jawab: 'komodo' },
      { clue: 'Aku hewan khas Indonesia, dari Sumatera', jawab: 'harimau sumatera' },
    ];
    const soal = random(list);
    gameState[from] = { game: 'tebakhewan', jawab: soal.jawab.toLowerCase(), sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${soal.jawab}*` });
    });
    await sock.sendMessage(from, {
      text: `🐾 *TEBAK HEWAN*\n\n${soal.clue}\n\n💬 *Ketik nama hewannya langsung!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +Rp 600, +2 Point`
    });
  }
};