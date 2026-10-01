const { downloadYT, toMedia } = require('../../lib/downloader');

module.exports = {
  name: 'youtube',
  category: 'download',
  aliases: ['yt', 'ytmp4'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const url = args[0];

    if (!url || !url.includes('youtu')) {
      return sock.sendMessage(from, {
        text: '❌ Kirim link YouTube!\nContoh: `.yt https://youtu.be/xxx`',
      }, { quoted: msg });
    }

    await sock.sendMessage(from, { text: '⏳ Downloading video...' }, { quoted: msg });

    try {
      const data = await downloadYT(url, 'mp4');

      await sock.sendMessage(from, {
        video: toMedia(data),
        caption: `📥 *YOUTUBE*\n\n📌 ${data.title}`,
        mimetype: 'video/mp4',
      }, { quoted: msg });

      console.log('✅ YT video terkirim');
    } catch (e) {
      console.error('❌ YT error:', e.message);
      await sock.sendMessage(from, {
        text: `❌ *Gagal download*\n\n${e.message}\n\n💡 Coba:\n• Link lain\n• Tunggu 1 menit\n• Pakai .ytmp3 (audio)`,
      }, { quoted: msg });
    }
  },
};
