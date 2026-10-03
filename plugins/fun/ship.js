const crypto = require('node:crypto');

module.exports = {
  name: 'ship',
  category: 'fun',
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const names = args.join(' ').split('|').map(name => name.trim());
    if (names.length !== 2 || names.some(name => !name)) {
      return sock.sendMessage(from, {
        text: 'Format: .ship Nama 1 | Nama 2\nContoh: .ship Rani | Bima',
      }, { quoted: msg });
    }
    if (names.some(name => name.length > 40)) {
      return sock.sendMessage(from, { text: 'Nama maksimal 40 karakter.' }, { quoted: msg });
    }

    const pair = names.map(name => name.toLocaleLowerCase('id-ID')).sort();
    const displayNames = [...names].sort((a, b) =>
      a.toLocaleLowerCase('id-ID').localeCompare(b.toLocaleLowerCase('id-ID'), 'id-ID'),
    );
    const hash = crypto.createHash('sha256').update(pair.join('|')).digest();
    const percentage = hash.readUInt16BE(0) % 101;
    const filled = Math.round(percentage / 10);
    const bar = '♥'.repeat(filled) + '♡'.repeat(10 - filled);
    const verdict = percentage < 25 ? 'Chemistry tipis, cocok jadi teman dulu.'
      : percentage < 50 ? 'Ada potensi, mulai dari ngobrol santai.'
        : percentage < 75 ? 'Cukup serasi, jangan lupa saling mengenal.'
          : 'Match kuat! Semoga cocok di dunia nyata juga.';

    await sock.sendMessage(from, {
      text: `💘 *CEK KECOCOKAN*\n\n*${displayNames[0]}* × *${displayNames[1]}*\n${bar} *${percentage}%*\n\n${verdict}\n\n_Hanya hiburan._`,
    }, { quoted: msg });
  },
};