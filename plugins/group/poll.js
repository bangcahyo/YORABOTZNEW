module.exports = {
  name: 'poll',
  category: 'group',
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const isGroup = ctx.isGroup ? ctx.isGroup(from) : String(from).endsWith('@g.us');
    if (!isGroup) {
      return sock.sendMessage(from, { text: '❌ Poll hanya bisa dibuat di dalam grup.' }, { quoted: msg });
    }

    const [title, ...options] = args.join(' ').split('|').map(value => value.trim());
    if (!title || options.length < 2 || options.length > 12 || options.some(option => !option)) {
      return sock.sendMessage(from, {
        text: 'Format: .poll Pertanyaan | Opsi 1 | Opsi 2\nTambahkan 2–12 opsi yang tidak kosong.',
      }, { quoted: msg });
    }
    if (title.length > 100 || options.some(option => option.length > 100)) {
      return sock.sendMessage(from, { text: 'Pertanyaan dan setiap opsi maksimal 100 karakter.' }, { quoted: msg });
    }

    await sock.sendMessage(from, {
      poll: { name: title, values: options, selectableCount: 1 },
    }, { quoted: msg });
  },
};