module.exports = {
  name: 'tiktok', category: 'download', aliases: ['tt'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const url = args[0];
    if (!url || !url.includes('tiktok.com')) return sock.sendMessage(from, { text: '❌ Kirim link TikTok!' }, { quoted: msg });
    await sock.sendMessage(from, { text: '⏳ Downloading...' }, { quoted: msg });

    try {
      // Panggil API langsung (btch.foo.ng)
      const apiUrl = `https://btch.foo.ng/api/tiktok?url=${encodeURIComponent(url)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.status && data.result) {
        const videoUrl = data.result.video || data.result.videoUrl;
        if (videoUrl) {
          await sock.sendMessage(from, {
            video: { url: videoUrl },
            caption: `📥 *TIKTOK*\n\n${data.result.title || ''}`
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