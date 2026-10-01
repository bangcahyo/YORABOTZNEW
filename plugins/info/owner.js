module.exports = {
  name: 'owner',
  category: 'info',
  aliases: ['ownerku', 'own'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const mode = config.sendOwnerAs || 'both';

    if ((mode === 'voice' || mode === 'both') && config.voiceOwnerUrl) {
      try {
        await sock.sendMessage(from, {
          audio: { url: config.voiceOwnerUrl },
          mimetype: 'audio/ogg; codecs=opus', ptt: true,
        });
      } catch {}
    }

    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${config.ownerName}\nORG:${config.botName}\nTEL;type=CELL;type=VOICE;waid=${config.ownerNumber}:+${config.ownerNumber}\nURL:${config.website}\nEND:VCARD`;
    try {
      await sock.sendMessage(from, {
        contacts: { displayName: config.ownerName, contacts: [{ vcard }] },
      });
    } catch {}

    if (mode === 'text' || mode === 'both') {
      await sock.sendMessage(from, {
        text: `╔══════════════════════════════════════╗
║        👑  *OWNER BOT*  👑
╚══════════════════════════════════════╝

╭─────────────────────────────────────╮
│  📛  *INFORMASI*                     │
╰─────────────────────────────────────╯

  ◆  👤  Nama      : *${config.ownerName}*
  ◆  📞  Nomor     : *${config.ownerNumber}*
  ◆  🌐  Website   : ${config.website}
  ◆  🤖  Bot       : ${config.botName}

╭─────────────────────────────────────╮
│  💬  *GRUP RESMI*                    │
╰─────────────────────────────────────╯

  ${config.officialGroup?.link || '-'}

╭─────────────────────────────────────╮
│  📌  *HUBUNGI UNTUK*                 │
╰─────────────────────────────────────╯

  ◆  🛒  Beli script bot
  ◆  🤝  Kerjasama & partner
  ◆  🐛  Lapor bug
  ◆  💡  Saran & kritik
  ◆  🎨  Jasa pembuatan bot

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚡  _${config.botName} — Owner Panel_
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      });
    }
  },
};