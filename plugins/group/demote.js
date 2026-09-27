module.exports = {
  name: 'demote', category: 'group',
  async execute(sock, msg, args, ctx) {
    const { from, sender, mentioned, isGroup, isSenderOwner } = ctx;
    if (!isGroup(from)) return;
    if (!mentioned || mentioned.length === 0) return;
    const gm = await sock.groupMetadata(from);
    if (!gm.participants.find(p => p.id === sender)?.admin && !isSenderOwner()) return;
    await sock.groupParticipantsUpdate(from, mentioned, 'demote');
    await sock.sendMessage(from, { text: `⬇️ ${mentioned.length} didemote.` }, { quoted: msg });
  }
};