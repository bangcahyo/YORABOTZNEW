module.exports = {
  name: 'hangman', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, setGameTimeout, random } = ctx;
    const kata = random(['indonesia','komputer','whatsapp','programmer','sekolah','keluarga','semangat','teknologi']);
    gameState[from] = { game: 'hangman', kata, tebakan: [], nyawa: 6, sender };
    const tampil = kata.split('').map(() => '_').join(' ');
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${kata}*` });
    });
    await sock.sendMessage(from, { text: `🎯 *HANGMAN*\n\nKata: ${tampil}\nNyawa: ❤️❤️❤️❤️❤️❤️\n\nTebak: *${config.prefix}tebak <huruf>*\nNyerah: *${config.prefix}nyerah*\n\n⏱️ 60 detik\nHadiah: +Rp 1000, +5 Point` }, { quoted: msg });
  }
};