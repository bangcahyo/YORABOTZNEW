const hashText = (text) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash;
};

module.exports = {
  name: 'cekpasangan',
  category: 'tools',
  aliases: ['pasangan', 'compatibility'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const input = args.join(' ').trim();
    let nama1 = '';
    let nama2 = '';

    if (!input) {
      nama1 = (ctx.pushName || 'Kamu').trim();
      nama2 = 'Pasangan';
    } else {
      const parts = input.split(/\s*\+\s*|\s*,\s*|\s+/);
      if (parts.length >= 2) {
        nama1 = parts[0];
        nama2 = parts.slice(1).join(' ');
      } else {
        return sock.sendMessage(from, {
          text: '❌ Format: `.cekpasangan <nama1> + <nama2>`\nContoh: `.cekpasangan Andi + Sinta`',
        });
      }
    }

    const score = Math.abs(hashText(nama1.toLowerCase()) - hashText(nama2.toLowerCase())) % 101;
    let status = 'Cocok';
    if (score < 30) status = 'Kurang cocok';
    else if (score < 60) status = 'Cukup cocok';
    else if (score < 80) status = 'Sangat cocok';

    await sock.sendMessage(from, {
      text: `💞 *Cek Kecocokan Pasangan*\n\n${nama1} + ${nama2}\nSkor: *${score}%*\nStatus: *${status}*`,
    });
  },
};
