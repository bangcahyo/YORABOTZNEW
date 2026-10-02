module.exports = {
  name: 'commands',
  category: 'info',
  aliases: ['commandlist', 'cmds', 'allcmd', 'feature'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const prefix = config.prefix || '.';

    const text = `╔══════════════════════════════════════╗
║      📚  *COMMAND LIST*  📚
╚══════════════════════════════════════╝

🧩 *Fitur Utama*
  • ${prefix}menu
  • ${prefix}tutorial
  • ${prefix}about
  • ${prefix}version
  • ${prefix}ping
  • ${prefix}runtime

💰 *Ekonomi & Premium*
  • ${prefix}daftar
  • ${prefix}profile
  • ${prefix}daily
  • ${prefix}limit
  • ${prefix}uang
  • ${prefix}point
  • ${prefix}premium
  • ${prefix}premium buy
  • ${prefix}shop

🎮 *Game & Hiburan*
  • ${prefix}menugame
  • ${prefix}quiz
  • ${prefix}slot
  • ${prefix}tebakgambar
  • ${prefix}family100
  • ${prefix}dadu
  • ${prefix}asahotak

🎭 *Fun & Random*
  • ${prefix}menufun
  • ${prefix}quote
  • ${prefix}pantun
  • ${prefix}puisi
  • ${prefix}bucin
  • ${prefix}zodiak

🛠️ *Tools & Utility*
  • ${prefix}menutools
  • ${prefix}jam
  • ${prefix}bmi
  • ${prefix}translate
  • ${prefix}acakangka
  • ${prefix}reminder
  • ${prefix}cekpasangan
  • ${prefix}statusbot

🛡️ *Grup & Admin*
  • ${prefix}menugroup
  • ${prefix}grouphelp
  • ${prefix}welcome on/off
  • ${prefix}setwelcome <teks>
  • ${prefix}setgoodbye <teks>
  • ${prefix}antilink on/off
  • ${prefix}antispam on/off
  • ${prefix}tagall <pesan>

👑 *Owner*
  • ${prefix}menuowner
  • ${prefix}commandstats
  • ${prefix}broadcast
  • ${prefix}backup
  • ${prefix}reloadcfg
  • ${prefix}restartbot

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Gunakan ${prefix}menu untuk melihat menu utama.
💡 Gunakan ${prefix}tutorial untuk panduan cepat.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
