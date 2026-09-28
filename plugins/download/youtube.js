module.exports = {
  name: 'youtube', category: 'download', aliases: ['yt','ytmp4'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const url = args[0];
    if (!url || !url.includes('youtu')) return sock.sendMessage(from, { text: '❌ Kirim link YouTube!' }, { quoted: msg });
    await sock.sendMessage(from, { text: '⏳ Downloading...' }, { quoted: msg });

    try {
      const apiUrl = `https://btch.foo.ng/api/youtube?url=${encodeURIComponent(url)}&type=mp4`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.status && data.result) {
        const videoUrl = data.result.mp4 || data.result.video;
        if (videoUrl) {
          await sock.sendMessage(from, {
            video: { url: videoUrl },
            caption: `📥 *YOUTUBE*\n\n${data.result.title || ''}`
          }, { quoted: msg });
          return;
        }
      }
      await sock.sendMessage(from, { text: '❌ Gagal download!' }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: msg });
    }
  }
};