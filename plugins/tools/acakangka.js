module.exports = {
  name: 'acakangka',
  category: 'tools',
  aliases: ['randomnum', 'rand', 'angkaacak'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const input = args.join(' ').trim();

    if (!input) {
      return sock.sendMessage(from, {
        text: '❌ Format: `.acakangka <min> <max>`\nContoh: `.acakangka 1 100`',
      });
    }

    const values = input.split(/\s+/).filter(Boolean);
    let min = 1;
    let max = 100;

    if (values.length === 1) {
      max = Number(values[0]);
    } else if (values.length >= 2) {
      min = Number(values[0]);
      max = Number(values[1]);
    }

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return sock.sendMessage(from, {
        text: '❌ Masukkan angka yang valid.',
      });
    }

    const start = Math.min(min, max);
    const end = Math.max(min, max);
    const hasil = Math.floor(Math.random() * (end - start + 1)) + start;

    await sock.sendMessage(from, {
      text: `🎲 *Hasil acak angka*\n\nRange: *${start} - ${end}*\nResult: *${hasil}*`,
    });
  },
};
