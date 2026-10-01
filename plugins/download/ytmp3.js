const { downloadYT, toMedia } = require('../../lib/downloader');

module.exports = {
  name: 'ytmp3',
  category: 'download',
  aliases: ['yta'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const url = args[0];

    if (!url || !url.includes('youtu')) {
      return sock.sendMessage(from, {
        text: '❌ Kirim link YouTube!\nContoh: `.ytmp3 https://youtu.be/xxx`',
      }, { quoted: msg });
    }

    await sock.sendMessage(from, { text: '⏳ Downloading audio...' }, { quoted: msg });

    try {
      const data = await downloadYT(url, 'mp3');

      await sock.sendMessage(from, {
        audio: toMedia(data),
        mimetype: data.mimetype || 'audio/mp4',
        fileName: `${data.title || 'audio'}.m4a`,
        ptt: false,
      }, { quoted: msg });

      console.log('✅ YT audio terkirim');
    } catch (e) {
      console.error('❌ YTMP3 error:', e.message);
      await sock.sendMessage(from, {
        text: `❌ *Gagal download*\n\n${e.message}`,
      }, { quoted: msg });
    }
  },
};
