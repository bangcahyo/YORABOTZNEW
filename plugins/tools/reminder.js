const parseDelay = (value) => {
  if (!value) return null;
  const match = value.match(/^([0-9]+)([smhd])$/i);
  if (!match) return null;

  const num = Number(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === 's') return num * 1000;
  if (unit === 'm') return num * 60 * 1000;
  if (unit === 'h') return num * 60 * 60 * 1000;
  if (unit === 'd') return num * 24 * 60 * 60 * 1000;
  return null;
};

module.exports = {
  name: 'reminder',
  category: 'tools',
  aliases: ['ingatkan', 'alarm'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    if (!args.length) {
      return sock.sendMessage(from, {
        text: '❌ Format: `.reminder <5m> <teks>`\nContoh: `.reminder 10m ngerjain tugas`',
      });
    }

    const waktu = args[0];
    const teks = args.slice(1).join(' ');
    const delay = parseDelay(waktu);

    if (!delay || !teks) {
      return sock.sendMessage(from, {
        text: '❌ Format salah. Gunakan satuan s/m/h/d. Contoh: `.reminder 15m belajar`',
      });
    }

    if (delay > 24 * 60 * 60 * 1000) {
      return sock.sendMessage(from, {
        text: '⚠️ Maksimal reminder 1 hari.',
      });
    }

    const reminderMessage = teks;
    setTimeout(async () => {
      try {
        await sock.sendMessage(from, {
          text: `⏰ *Reminder*\n\n${reminderMessage}`,
        });
      } catch (err) {
        console.error('Reminder error:', err.message);
      }
    }, delay);

    await sock.sendMessage(from, {
      text: `✅ Reminder berhasil dibuat untuk *${waktu}*\n\nPesan: *${reminderMessage}*`,
    });
  },
};
