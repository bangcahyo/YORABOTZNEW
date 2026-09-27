module.exports = {
  name: 'public', category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from, saveMode, isSenderOwner } = ctx;
    if (!isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya owner!' }, { quoted: msg });
    saveMode('public');
    await sock.sendMessage(from, { text: '🌐 Mode PUBLIC aktif.' }, { quoted: msg });
  }
};