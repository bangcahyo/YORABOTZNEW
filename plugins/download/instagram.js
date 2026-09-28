module.exports = {
  name: 'instagram', category: 'download', aliases: ['ig','igdl'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const url = args[0];
    if (!url || !url.includes('instagram.com')) return sock.sendMessage(from, { text: '❌ Kirim link Instagram!' }, { quoted: msg });
    await sock.sendMessage(from, { text: '⏳ Downloading...' }, { quoted: msg });

    try {
      const apiUrl = `https://btch.foo.ng/api/instagram?url=${encodeURIComponent(url)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data.status && data.result && data.result.length > 0) {
        for (const media of data.result.slice(0, 5)) {
          if (media.includes('.mp4')) {
            await sock.sendMessage(from, { video: { url: media }, caption: '📥 Instagram' }, { quoted: msg });
          } else {
            await sock.sendMessage(from, { image: { url: media }, caption: '📥 Instagram' }, { quoted: msg });
          }
        }
        return;
      }
      await sock.sendMessage(from, { text: '❌ Gagal download!' }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: msg });
    }
  }
};