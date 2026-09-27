module.exports = {
  name: 'antispam', category: 'group',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, isGroup, isSenderOwner } = ctx;
    if (!isGroup(from)) return sock.sendMessage(from, { text: '❌ Hanya untuk grup!' }, { quoted: msg });
    const gm = await sock.groupMetadata(from);
    if (!gm.participants.find(p => p.id === sender)?.admin && !isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya admin!' }, { quoted: msg });
    if (args[0] === 'on') { config.antiSpam = true; await sock.sendMessage(from, { text: '✅ Anti-Spam AKTIF!' }, { quoted: msg }); }
    else if (args[0] === 'off') { config.antiSpam = false; await sock.sendMessage(from, { text: '❌ Anti-Spam OFF.' }, { quoted: msg }); }
    else await sock.sendMessage(from, { text: `Format: ${config.prefix}antispam on/off` }, { quoted: msg });
  }
};