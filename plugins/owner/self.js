module.exports = {
  name: 'self',
  category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from, saveMode, isSenderOwner } = ctx;
    if (!isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya owner!' }, { quoted: msg });
    saveMode('self');
    await sock.sendMessage(from, { text: '🏠 Mode SELF aktif.' }, { quoted: msg });
  }
};