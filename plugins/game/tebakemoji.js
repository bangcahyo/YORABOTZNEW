module.exports = {
  name: 'tebakemoji', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, setGameTimeout, random } = ctx;
    const list = [
      { emoji: '🍎🍊🍋', jawab: ['buah','jeruk','buah-buahan'] },
      { emoji: '🐶🐱🐭', jawab: ['hewan','binatang'] },
      { emoji: '🌞🌙⭐', jawab: ['langit','bintang','malam'] },
      { emoji: '🚗🚕🚙', jawab: ['kendaraan','mobil'] },
      { emoji: '⚽🏀🎾', jawab: ['olahraga','bola'] },
      { emoji: '🍕🍔🍟', jawab: ['makanan','fast food'] },
    ];
    const soal = random(list);
    gameState[from] = { game: 'tebakemoji', jawab: soal.jawab, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${soal.jawab[0]}*` });
    });
    await sock.sendMessage(from, { text: `🎨 *TEBAK EMOJI*\n\n${soal.emoji}\n\nJawab: *${config.prefix}jawabemoji <kategori>*\nNyerah: *${config.prefix}nyerah*\n\n⏱️ 60 detik\nHadiah: +Rp 800, +3 Point` }, { quoted: msg });
  }
};