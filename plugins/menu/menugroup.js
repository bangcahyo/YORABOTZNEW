module.exports = {
  name: 'menugroup',
  category: 'menu',
  aliases: ['menuadmin'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isGroup } = ctx;

    if (!isGroup(from)) {
      return sock.sendMessage(from, { text: '❌ Hanya untuk grup!' });
    }

    const menuText = `╔══════════════════════════════════════╗
║      🛡️  *GROUP ADMIN MENU*  🛡️
╚══════════════════════════════════════╝

╭─────────────────────────────────────╮
│  🛡️  *KEAMANAN*                      │
╰─────────────────────────────────────╯

  ◈  🔗  ${config.prefix}antilink on/off
  ◈  🛡️  ${config.prefix}antispam on/off
  ◈  🔊  ${config.prefix}unmute @user
  ◈  📘  ${config.prefix}grouphelp

╭─────────────────────────────────────╮
│  👋  *WELCOME & GOODBYE*             │
╰─────────────────────────────────────╯

  ◈  👋  ${config.prefix}welcome on/off
  ◈  ✏️  ${config.prefix}setwelcome <teks>
  ◈  ✏️  ${config.prefix}setgoodbye <teks>

╭─────────────────────────────────────╮
│  👥  *MANAJEMEN MEMBER*              │
╰─────────────────────────────────────╯

  ◈  👢  ${config.prefix}kick @user
  ◈  ⬆️  ${config.prefix}promote @user
  ◈  ⬇️  ${config.prefix}demote @user
  ◈  📢  ${config.prefix}tagall <pesan>

╭─────────────────────────────────────╮
│  ℹ️  *INFO GRUP*                     │
╰─────────────────────────────────────╯

  ◈  ℹ️  ${config.prefix}groupinfo
  ◈  🆔  ${config.prefix}id

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚡  _${config.botName} — Group Menu_
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(from, { text: menuText });
  },
};