module.exports = {
  name: 'hangman', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, setGameTimeout, random } = ctx;
    const kataList = [
      'indonesia', 'komputer', 'whatsapp', 'programmer', 'sekolah',
      'keluarga', 'semangat', 'teknologi', 'internet', 'makanan',
      'minuman', 'olahraga', 'musik', 'kucing', 'anjing',
      'harimau', 'gajah', 'jerapah', 'matahari', 'bulan',
      'bintang', 'langit', 'lautan', 'gunung', 'pantai',
      'jakarta', 'bandung', 'surabaya', 'yogyakarta', 'semarang',
      'medan', 'makassar', 'palembang', 'bogor', 'malang',
      'apel', 'pisang', 'jeruk', 'mangga', 'anggur',
      'semangka', 'rambutan', 'durian', 'salak', 'pepaya',
      'buku', 'pulpen', 'pensil', 'meja', 'kursi',
    ];
    const kata = random(kataList);
    gameState[from] = { game: 'hangman', kata, tebakan: [], nyawa: 6, sender };
    const tampil = kata.split('').map(() => '_').join(' ');
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${kata}*` });
    });
    await sock.sendMessage(from, {
      text: `🎯 *HANGMAN*\n\nKata: ${tampil}\nNyawa: ❤️❤️❤️❤️❤️❤️\n\n💬 *Ketik 1 huruf langsung!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +Rp 1000, +5 Point`
    });
  }
};