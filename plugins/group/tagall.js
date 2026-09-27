module.exports = {
  name: 'tagall', category: 'group',
  async execute(sock, msg, args, ctx) {
    const { from, sender, isGroup, isSenderOwner } = ctx;
    if (!isGroup(from)) return;
    const gm = await sock.groupMetadata(from);
    if (!gm.participants.find(p => p.id === sender)?.admin && !isSenderOwner()) return;
    const members = gm.participants.map(p => p.id);
    let teks = `📢 *TAG ALL*\n\n${args.join(' ') || 'Hai semua!'}\n\n`;
    members.forEach(m => { teks += `@${m.split('@')[0]}\n`; });
    await sock.sendMessage(from, { text: teks, mentions: members }, { quoted: msg });
  }
};