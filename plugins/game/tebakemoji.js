module.exports = {
  name: 'tebakemoji', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, setGameTimeout, random } = ctx;
    const list = [
      { emoji: '🍎🍊🍋', jawab: ['buah', 'jeruk', 'buah-buahan'] },
      { emoji: '🐶🐱🐭', jawab: ['hewan', 'binatang'] },
      { emoji: '🌞🌙⭐', jawab: ['langit', 'bintang', 'malam'] },
      { emoji: '🚗🚕🚙', jawab: ['kendaraan', 'mobil'] },
      { emoji: '⚽🏀🎾', jawab: ['olahraga', 'bola'] },
      { emoji: '🍕🍔🍟', jawab: ['makanan', 'fast food'] },
      { emoji: '📱💻⌚', jawab: ['elektronik', 'gadget'] },
      { emoji: '☀️🌤️🌧️', jawab: ['cuaca'] },
      { emoji: '🎸🎹🥁', jawab: ['musik', 'alat musik'] },
      { emoji: '🏠🏡🏘️', jawab: ['rumah', 'bangunan'] },
      { emoji: '💧🌊💦', jawab: ['air'] },
      { emoji: '❤️💔💕', jawab: ['cinta', 'hati'] },
      { emoji: '👑🎩🎓', jawab: ['topi'] },
      { emoji: '👟👠👞', jawab: ['sepatu'] },
      { emoji: '🕐🕑🕒', jawab: ['jam', 'waktu'] },
      { emoji: '✏️🖊️🖌️', jawab: ['alat tulis'] },
      { emoji: '📚📖📕', jawab: ['buku'] },
      { emoji: '🍦🍨🍧', jawab: ['es krim'] },
      { emoji: '🍰🎂🧁', jawab: ['kue', 'cake'] },
      { emoji: '🌹🌷🌻', jawab: ['bunga'] },
      { emoji: '🐟🐠🐡', jawab: ['ikan'] },
      { emoji: '🦁🐯🐻', jawab: ['hewan buas'] },
      { emoji: '🇮🇩🇯🇵🇰🇷', jawab: ['bendera', 'negara'] },
      { emoji: '🔴🟡🟢', jawab: ['warna'] },
      { emoji: '1️⃣2️⃣3️⃣', jawab: ['angka', 'nomor'] },
      { emoji: '🅰️🅱️🆎', jawab: ['huruf', 'abjad'] },
      { emoji: '💧🌧️🌊', jawab: ['air', 'hujan'] },
      { emoji: '🎬🎥📽️', jawab: ['film', 'bioskop'] },
      { emoji: '🎮🕹️🎯', jawab: ['game', 'mainan'] },
      { emoji: '🎁🎀🎉', jawab: ['hadiah', 'pesta'] },
    ];
    const soal = random(list);
    gameState[from] = { game: 'tebakemoji', jawab: soal.jawab, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${soal.jawab[0]}*` });
    });
    await sock.sendMessage(from, {
      text: `🎨 *TEBAK EMOJI*\n\n${soal.emoji}\n\n💬 *Ketik kategorinya langsung!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +Rp 800, +3 Point`
    });
  }
};