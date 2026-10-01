const { downloadTT, toMedia } = require('../../lib/downloader');

module.exports = {
  name: 'tiktok',
  category: 'download',
  aliases: ['tt'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const url = args[0];

    if (!url || !url.includes('tiktok.com')) {
      return sock.sendMessage(from, {
        text: '❌ Kirim link TikTok!\nContoh: `.tt https://vt.tiktok.com/xxx`',
      }, { quoted: msg });
    }

    await sock.sendMessage(from, { text: '⏳ Downloading...' }, { quoted: msg });

    try {
      const data = await downloadTT(url);
      const caption = `📥 *TIKTOK*\n\n📌 ${data.title}`;

      if (data.images) {
        // Postingan slideshow (foto)
        for (const [i, img] of data.images.slice(0, 10).entries()) {
          await sock.sendMessage(from, {
            image: { url: img },
            caption: i === 0 ? caption : undefined,
          }, { quoted: msg });
        }
      } else {
        await sock.sendMessage(from, {
          video: toMedia(data),
          caption,
          mimetype: 'video/mp4',
        }, { quoted: msg });
      }

      console.log('✅ TikTok terkirim');
    } catch (e) {
      console.error('❌ TikTok error:', e.message);
      await sock.sendMessage(from, {
        text: `❌ *Gagal download*\n\n${e.message}`,
      }, { quoted: msg });
    }
  },
};
