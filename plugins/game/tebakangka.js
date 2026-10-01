module.exports = {
  name: 'tebakangka', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, setGameTimeout } = ctx;
    const angka = Math.floor(Math.random() * 10) + 1;
    gameState[from] = { game: 'tebakangka', angka, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${angka}*` });
    });
    await sock.sendMessage(from, {
      text: `🔢 *TEBAK ANGKA*\n\nBot pilih 1-10.\n\n💬 *Ketik angkamu langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +5 Point, +Rp 500`
    });
  }
};