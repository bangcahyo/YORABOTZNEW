module.exports = {
  name: 'id', category: 'group', aliases: ['groupid','cekid'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, isGroup, isSenderOwner } = ctx;
    if (!isGroup(from)) return sock.sendMessage(from, { text: `🆔 ID chat pribadi kamu:\n\`${from}\`` }, { quoted: msg });
    const gm = await sock.groupMetadata(from);
    const isAdmin = gm.participants.find(p => p.id === sender)?.admin;
    if (!isAdmin && !isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya admin!' }, { quoted: msg });
    await sock.sendMessage(from, { text: `🆔 *ID GRUP*\n\n📛 ${gm.subject}\n\n\`${from}\`\n\nTambahkan ke whitelist di config.js` }, { quoted: msg });
  }
};