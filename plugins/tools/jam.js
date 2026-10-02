module.exports = {
  name: 'jam',
  category: 'tools',
  aliases: ['time', 'tanggal', 'date'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const waktu = formatter.format(now);
    await sock.sendMessage(from, {
      text: `🕒 *Waktu saat ini (Jakarta)*\n\n${waktu}`,
    });
  },
};
