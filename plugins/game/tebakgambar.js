const DATA = [
  { emoji: '🌧️☂️', jawab: ['hujan'] },
  { emoji: '☀️🏖️🌊', jawab: ['pantai', 'liburan'] },
  { emoji: '🌙⭐🌌', jawab: ['malam', 'bintang'] },
  { emoji: '🎂🎉🎈', jawab: ['ulang tahun', 'ultah'] },
  { emoji: '🏠🔥🚒', jawab: ['kebakaran'] },
  { emoji: '👑🦁', jawab: ['singa', 'raja hutan'] },
  { emoji: '📚🎓🏫', jawab: ['sekolah', 'belajar'] },
  { emoji: '🚗💨🛣️', jawab: ['mobil', 'jalan'] },
  { emoji: '🍎📱', jawab: ['apple', 'iphone'] },
  { emoji: '🐘🌴', jawab: ['gajah'] },
  { emoji: '🐟🌊🪝', jawab: ['ikan', 'memancing'] },
  { emoji: '🌵🏜️', jawab: ['kaktus', 'gurun'] },
  { emoji: '🌈🌦️', jawab: ['pelangi'] },
  { emoji: '🐝🍯', jawab: ['lebah', 'madu'] },
  { emoji: '🍕🧀', jawab: ['pizza'] },
  { emoji: '🍜🥢', jawab: ['mie', 'ramen', 'bakmi'] },
  { emoji: '☕🌅', jawab: ['kopi', 'pagi'] },
  { emoji: '🚀🌕', jawab: ['roket', 'bulan', 'antariksa'] },
  { emoji: '🐍🍎', jawab: ['ular'] },
  { emoji: '💧🔥', jawab: ['air', 'api'] },
  { emoji: '🎸🎶', jawab: ['gitar', 'musik'] },
  { emoji: '🏀⛹️', jawab: ['basket'] },
  { emoji: '⚽🥅', jawab: ['sepak bola', 'sepakbola', 'bola'] },
  { emoji: '📷🖼️', jawab: ['kamera', 'foto'] },
  { emoji: '✈️☁️🌍', jawab: ['pesawat', 'terbang'] },
  { emoji: '🚑🏥', jawab: ['ambulans', 'rumah sakit'] },
  { emoji: '🐢🏁', jawab: ['kura kura', 'kura-kura', 'kurakura'] },
  { emoji: '🍫🍬', jawab: ['coklat', 'permen'] },
  { emoji: '🌺🌸🌷', jawab: ['bunga'] },
  { emoji: '🐔🥚', jawab: ['ayam', 'telur'] },
];

module.exports = {
  name: 'tebakgambar',
  category: 'game',
  aliases: ['tgambar', 'tebakemoji2'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'tebakgambar', jawab: d.jawab, sender };
    setGameTimeout(from, async () => {
      const jwb = Array.isArray(d.jawab) ? d.jawab[0] : d.jawab;
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${jwb}*` });
    });
    await sock.sendMessage(from, {
      text: `🖼️ *TEBAK GAMBAR*\n\n${d.emoji}\n\n❓ Apa yang dimaksud gambar di atas?\n\n💬 *Ketik jawabanmu langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +3 Point, +Rp 800`,
    });
  },
};
