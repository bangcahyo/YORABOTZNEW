module.exports = {
  name: 'antilink', category: 'group',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, isGroup, isSenderOwner, updateGroupSettings } = ctx;
    if (!isGroup(from)) return sock.sendMessage(from, { text: '❌ Hanya untuk grup!' }, { quoted: msg });
    const gm = await sock.groupMetadata(from);
    if (!gm.participants.find(p => p.id === sender)?.admin && !isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya admin!' }, { quoted: msg });
    if (args[0] === 'on') { updateGroupSettings(from, { antilink: true }); await sock.sendMessage(from, { text: '✅ Anti-Link AKTIF!' }, { quoted: msg }); }
    else if (args[0] === 'off') { updateGroupSettings(from, { antilink: false }); await sock.sendMessage(from, { text: '❌ Anti-Link OFF.' }, { quoted: msg }); }
    else await sock.sendMessage(from, { text: `Format: ${config.prefix}antilink on/off` }, { quoted: msg });
  }
};