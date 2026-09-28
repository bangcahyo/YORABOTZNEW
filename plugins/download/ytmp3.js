module.exports = {
  name: 'ytmp3', category: 'download', aliases: ['yta'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const url = args[0];
    if (!url || !url.includes('youtu')) return sock.sendMessage(from, { text: '❌ Kirim link YouTube!' }, { quoted: msg });
    await sock.sendMessage(from, { text: '⏳ Downloading audio...' }, { quoted: msg });

    try {
      const apiUrl = `https://btch.foo.ng/api/youtube?url=${encodeURIComponent(url)}&type=mp3`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.status && data.result) {
        const audioUrl = data.result.mp3 || data.result.audio;
        if (audioUrl) {
          await sock.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mp4',
            fileName: `${data.result.title || 'audio'}.mp3`,
            caption: `🎵 *YOUTUBE AUDIO*\n\n${data.result.title || ''}`
          }, { quoted: msg });
          return;
        }
      }
      await sock.sendMessage(from, { text: '❌ Audio tidak ditemukan.' }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: msg });
    }
  }
};