module.exports = {
  name: 'tebakangka',
  category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, setGameTimeout } = ctx;
    const angka = Math.floor(Math.random() * 10) + 1;
    gameState[from] = { game: 'tebakangka', angka, sender };

    setGameTimeout(from, async () => {
      await sock.sendMessage(from, {
        text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${angka}*\n\n_Ketik_ *${config.prefix}tebakangka* _untuk main lagi._`
      });
    });

    await sock.sendMessage(from, {
      text: `🔢 *TEBAK ANGKA*\n\nBot pilih 1-10.\nJawab: *${config.prefix}jawab <angka>*\nNyerah: *${config.prefix}nyerah*\n\n⏱️ Waktu: 60 detik\nHadiah: +5 Point, +Rp 500`
    }, { quoted: msg });
  }
};