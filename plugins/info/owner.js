module.exports = {
  name: 'owner',
  category: 'info',
  aliases: ['ownerku', 'own'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${config.ownerName}
ORG:${config.botName}
TEL;type=CELL;type=VOICE;waid=${config.ownerNumber}:+${config.ownerNumber}
URL:${config.website}
END:VCARD`;

    try {
      await sock.sendMessage(from, {
        contacts: {
          displayName: config.ownerName,
          contacts: [{ vcard }],
        },
      });
    } catch {}

    await sock.sendMessage(from, {
      text: `👑 *OWNER BOT*\n\n📛 Nama  : ${config.ownerName}\n📞 Nomor : ${config.ownerNumber}\n🌐 Web   : ${config.website}\n\n💬 Grup Resmi:\n${config.officialGroup?.link || '-'}`,
    });
  },
};