module.exports = {
  name: 'owner', category: 'info', aliases: ['ownerku','own'],
  async execute(sock, msg, args, ctx) {
    const { config, from, sendVoiceNote, sendOwnerAs } = ctx;
    const mode = config.sendOwnerAs || 'both';
    const ownerText = `👑 *OWNER BOT*\n\n📛 Nama: ${config.ownerName}\n📞 Nomor: ${config.ownerNumber}\n🌐 Website: ${config.website}\n🤖 Bot: ${config.botName}\n📱 Nomor Bot: ${config.botNumber}\n\n💬 Grup Resmi:\n${config.officialGroup.link}`;
    if (mode === 'voice' || mode === 'both') {
      await sendVoiceNote(sock, from, config.voiceOwner, config.voiceOwnerUrl, msg);
    }
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${config.ownerName}\nORG:${config.botName}\nTEL;type=CELL;type=VOICE;waid=${config.ownerNumber}:+${config.ownerNumber}\nURL:${config.website}\nEND:VCARD`;
    try {
      await sock.sendMessage(from, { contacts: { displayName: config.ownerName, contacts: [{ vcard }] } }, { quoted: msg });
    } catch {}
    if (mode === 'text' || mode === 'both') {
      await sock.sendMessage(from, { text: ownerText }, { quoted: msg });
    }
  }
};