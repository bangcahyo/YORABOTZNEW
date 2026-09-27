module.exports = {
  name: 'groupinfo', category: 'group',
  async execute(sock, msg, args, ctx) {
    const { from, isGroup } = ctx;
    if (!isGroup(from)) return;
    const gm = await sock.groupMetadata(from);
    const admins = gm.participants.filter(p => p.admin).map(p => p.id);
    await sock.sendMessage(from, {
      text: `📋 *INFO GRUP*\n\n📛 Nama: ${gm.subject}\n👥 Member: ${gm.participants.length}\n👑 Admin: ${admins.length}\n📅 Dibuat: ${new Date(gm.creation * 1000).toLocaleDateString('id-ID')}\n📝 Deskripsi: ${gm.desc || '-'}`,
      mentions: admins,
    }, { quoted: msg });
  }
};