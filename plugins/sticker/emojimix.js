const { Sticker } = require('wa-sticker-formatter');

const EMOJI_KITCHEN_DATES = ['20230810', '20201001'];

async function getEmojiMixBuffer(emoji1, emoji2) {
  const code1 = [...emoji1].map(char => char.codePointAt(0).toString(16)).join('-');
  const code2 = [...emoji2].map(char => char.codePointAt(0).toString(16)).join('-');
  let lastStatus;

  for (const date of EMOJI_KITCHEN_DATES) {
    const url = `https://www.gstatic.com/android/keyboard/emojikitchen/${date}/u${code1}/u${code1}_u${code2}.png`;
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (response.ok) {
      return Buffer.from(await response.arrayBuffer());
    }
    lastStatus = response.status;
    if (response.status !== 404) {
      throw new Error(`Sumber Emoji Kitchen merespons HTTP ${response.status}.`);
    }
  }

  throw new Error(
    lastStatus === 404
      ? 'Kombinasi emoji ini tidak tersedia. Coba kombinasi lain, misalnya 😀+🔥.'
      : 'Kombinasi emoji tidak ditemukan.',
  );
}

module.exports = {
  name: 'emojimix', category: 'sticker', aliases: ['emix'],
  async execute(sock, msg, args, ctx) {
    const { from, config } = ctx;
    const input = args.join(' ');
    if (!input || !input.includes('+')) return sock.sendMessage(from, { text: '❌ Format: `.emojimix 😀+🔥`' }, { quoted: msg });
    const [emoji1, emoji2, extra] = input.split('+').map(s => s.trim());
    if (!emoji1 || !emoji2 || extra) return sock.sendMessage(from, { text: '❌ Format: `.emojimix 😀+🔥`' }, { quoted: msg });
    try {
      const image = await getEmojiMixBuffer(emoji1, emoji2);
      const sticker = new Sticker(image, { pack: config.botName, author: config.ownerName, type: 'full' });
      const buffer = await sticker.toBuffer();
      await sock.sendMessage(from, { sticker: buffer }, { quoted: msg });
    } catch (e) { await sock.sendMessage(from, { text: `❌ Gagal mix emoji: ${e.message}` }, { quoted: msg }); }
  }
};