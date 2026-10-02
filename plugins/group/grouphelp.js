module.exports = {
  name: 'grouphelp',
  category: 'group',
  aliases: ['ghelp', 'groupmenu', 'helpgroup'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isGroup, isSenderOwner } = ctx;

    if (!isGroup(from)) {
      return sock.sendMessage(from, { text: '❌ Perintah ini hanya bisa dipakai di grup.' }, { quoted: msg });
    }

    const adminNote = !isSenderOwner() ? '\n> Hanya admin grup yang bisa menjalankan fitur moderasi.' : '';

    const text = `╔══════════════════════════════════════╗
║      🛡️  *GROUP HELP MENU*  🛡️
╚══════════════════════════════════════╝

╭─────────────────────────────────────╮
│  🔐  *KEAMANAN GRUP*                │
╰─────────────────────────────────────╯

  ◈  ${config.prefix}antilink on/off
     → Blokir link dari member grup

  ◈  ${config.prefix}antispam on/off
     → Blokir spam berulang / pesan cepat

  ◈  ${config.prefix}welcome on/off
     → Aktifkan atau nonaktifkan sambutan

  ◈  ${config.prefix}setwelcome <teks>
     → Atur pesan welcome custom

  ◈  ${config.prefix}setgoodbye <teks>
     → Atur pesan goodbye custom

╭─────────────────────────────────────╮
│  👥  *MODERASI MEMBER*               │
╰─────────────────────────────────────╯

  ◈  ${config.prefix}kick @user
     → Keluarkan member

  ◈  ${config.prefix}promote @user
     → Naikkan jadi admin

  ◈  ${config.prefix}demote @user
     → Turunkan status admin

  ◈  ${config.prefix}tagall <pesan>
     → Tag semua member grup

  ◈  ${config.prefix}unmute @user
     → Buka mute member

╭─────────────────────────────────────╮
│  ℹ️  *INFO GRUP*                     │
╰─────────────────────────────────────╯

  ◈  ${config.prefix}groupinfo
     → Informasi detail grup

  ◈  ${config.prefix}id
     → Lihat ID grup / user

${adminNote}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚡  _Panduan admin grup untuk bot profesional_
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
