module.exports = {
  name: 'wiki',
  category: 'tools',
  aliases: ['wikipedia'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const query = args.join(' ');

    if (!query) {
      return sock.sendMessage(from, { text: '❌ Format: `.wiki <topik>`\nContoh: `.wiki Indonesia`' });
    }

    await sock.sendMessage(from, { text: '🔍 Mencari...' });

    try {
      const res = await fetch(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!data.extract) {
        return sock.sendMessage(from, { text: `❌ Tidak ditemukan: *${query}*` });
      }

      await sock.sendMessage(from, {
        text: `📖 *WIKIPEDIA*\n\n📌 *${data.title}*\n\n${data.extract}\n\n🔗 ${data.content_urls?.desktop?.page || '-'}`,
      });
    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Error: ${e.message}` });
    }
  },
};