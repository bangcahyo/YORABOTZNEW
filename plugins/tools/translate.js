const dict = {
  hello: 'halo',
  hi: 'hai',
  bye: 'selamat tinggal',
  good: 'baik',
  bad: 'buruk',
  love: 'cinta',
  happy: 'senang',
  angry: 'marah',
  thank: 'terima kasih',
  sorry: 'maaf',
  yes: 'ya',
  no: 'tidak',
  friend: 'teman',
  morning: 'pagi',
  night: 'malam',
  water: 'air',
  food: 'makanan',
  code: 'kode',
  bot: 'bot',
};

module.exports = {
  name: 'translate',
  category: 'tools',
  aliases: ['terjemah'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const text = args.join(' ').trim();

    if (!text) {
      return sock.sendMessage(from, {
        text: '❌ Format: `.translate <kata>`\nContoh: `.translate hello`',
      });
    }

    const words = text.toLowerCase().split(/\s+/);
    const hasil = words.map((word) => dict[word] || word).join(' ');

    await sock.sendMessage(from, {
      text: `🔤 *Terjemahan sederhana*\n\nInput: *${text}*\nOutput: *${hasil}*`,
    });
  },
};
