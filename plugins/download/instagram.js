const { downloadIG, toMedia } = require('../../lib/downloader');

module.exports = {
  name: 'instagram',
  category: 'download',
  aliases: ['ig', 'igdl'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const url = args[0];

    if (!url || !url.includes('instagram.com')) {
      return sock.sendMessage(from, {
        text: '❌ Kirim link Instagram!\nContoh: `.ig https://instagram.com/p/xxx`',
      }, { quoted: msg });
    }

    await sock.sendMessage(from, { text: '⏳ Downloading...' }, { quoted: msg });

    try {
      const data = await downloadIG(url);

      for (const item of data.items.slice(0, 5)) {
        try {
          if (item.type === 'video') {
            await sock.sendMessage(from, {
              video: toMedia(item),
              caption: '📥 Instagram Video',
              mimetype: 'video/mp4',
            }, { quoted: msg });
          } else {
            await sock.sendMessage(from, {
              image: toMedia(item),
              caption: '📥 Instagram Foto',
            }, { quoted: msg });
          }
        } catch (e) {
          console.log('❌ Kirim media gagal:', e.message);
        }
      }

      console.log('✅ Instagram terkirim');
    } catch (e) {
      console.error('❌ IG error:', e.message);
      await sock.sendMessage(from, {
        text: `❌ *Gagal download*\n\n${e.message}`,
      }, { quoted: msg });
    }
  },
};
