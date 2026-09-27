module.exports = {
  name: 'welcome', category: 'group',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, isGroup, isSenderOwner, updateGroupSettings } = ctx;
    if (!isGroup(from)) return;
    const gm = await sock.groupMetadata(from);
    if (!gm.participants.find(p => p.id === sender)?.admin && !isSenderOwner()) return;
    if (args[0] === 'on') { updateGroupSettings(from, { welcome: true }); await sock.sendMessage(from, { text: '✅ Welcome AKTIF!' }, { quoted: msg }); }
    else if (args[0] === 'off') { updateGroupSettings(from, { welcome: false }); await sock.sendMessage(from, { text: '❌ Welcome OFF.' }, { quoted: msg }); }
    else await sock.sendMessage(from, { text: `Format: ${config.prefix}welcome on/off` }, { quoted: msg });
  }
};