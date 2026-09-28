const { Sticker } = require('wa-sticker-formatter');
module.exports = {
  name: 'emojimix', category: 'sticker', aliases: ['emix'],
  async execute(sock, msg, args, ctx) {
    const { from, config } = ctx;
    const input = args.join(' ');
    if (!input || !input.includes('+')) return sock.sendMessage(from, { text: '❌ Format: `.emojimix 😀+😎`' }, { quoted: msg });
    const [emoji1, emoji2] = input.split('+').map(s => s.trim());
    if (!emoji1 || !emoji2) return sock.sendMessage(from, { text: '❌ Format: `.emojimix 😀+😎`' }, { quoted: msg });
    try {
      const code1 = [...emoji1].map(c => c.codePointAt(0).toString(16)).join('-');
      const code2 = [...emoji2].map(c => c.codePointAt(0).toString(16)).join('-');
      const url = `https://www.gstatic.com/android/keyboard/emojikitchen/20230810/u${code1}/u${code1}_u${code2}.png`;
      const sticker = new Sticker(url, { pack: config.botName, author: config.ownerName, type: 'full' });
      const buffer = await sticker.toBuffer();
      await sock.sendMessage(from, { sticker: buffer }, { quoted: msg });
    } catch (e) { await sock.sendMessage(from, { text: `❌ Gagal mix emoji: ${e.message}` }, { quoted: msg }); }
  }
};