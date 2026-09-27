module.exports = {
  name: 'setgoodbye', category: 'group',
  async execute(sock, msg, args, ctx) {
    const { from, sender, isGroup, isSenderOwner, updateGroupSettings } = ctx;
    if (!isGroup(from)) return;
    const gm = await sock.groupMetadata(from);
    if (!gm.participants.find(p => p.id === sender)?.admin && !isSenderOwner()) return;
    const teks = args.join(' ');
    if (!teks) return sock.sendMessage(from, { text: 'Masukkan teks!' });
    updateGroupSettings(from, { goodbyeText: teks });
    await sock.sendMessage(from, { text: '✅ Goodbye diperbarui!' }, { quoted: msg });
  }
};