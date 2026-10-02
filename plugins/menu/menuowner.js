module.exports = {
  name: 'menuowner',
  category: 'menu',
  aliases: ['menuown'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;

    let isOwner = false;
    try { isOwner = ctx.isSenderOwner && ctx.isSenderOwner(); } catch {}

    if (!isOwner) {
      return sock.sendMessage(from, {
        text: `❌ *AKSES DITOLAK*\n\nHanya owner yang bisa akses.\n\n👑 ${config.ownerName}\n📞 ${config.ownerNumber}`,
      });
    }

    const menuText = `╔══════════════════════════════════════╗
║       👑  *OWNER MENU*  👑
╚══════════════════════════════════════╝

╭─────────────────────────────────────╮
│  👥  *KELOLA USER*                   │
╰─────────────────────────────────────╯

  ◈  🎫  ${config.prefix}addlimit @user <jml>
  ◈  💰  ${config.prefix}addmoney @user <jml>
  ◈  ⭐  ${config.prefix}addpoint @user <jml>
  ◈  🔧  ${config.prefix}setlimit @user <jml>
  ◈  🔧  ${config.prefix}setmoney @user <jml>
  ◈  🔄  ${config.prefix}resetuser @user

╭─────────────────────────────────────╮
│  🅟  *KELOLA PREMIUM*                │
╰─────────────────────────────────────╯

  ◈  🅟  ${config.prefix}addpremium @user <hari>
  ◈  🗑️  ${config.prefix}delpremium @user
  ◈  📋  ${config.prefix}listpremium

╭─────────────────────────────────────╮
│  📢  *KOMUNIKASI*                    │
╰─────────────────────────────────────╯

  ◈  📢  ${config.prefix}broadcast <teks>
  ◈  ⏰  ${config.prefix}autobroadcast

╭─────────────────────────────────────╮
│  💾  *BACKUP & RESTORE*              │
╰─────────────────────────────────────╯

  ◈  💾  ${config.prefix}backup
  ◈  ♻️  ${config.prefix}restore
  ◈  ✅  ${config.prefix}restoreyes
  ◈  ❌  ${config.prefix}restoreno

╭─────────────────────────────────────╮
│  🔒  *MODE BOT*                      │
╰─────────────────────────────────────╯

  ◈  🏠  ${config.prefix}self
  ◈  🌐  ${config.prefix}public
  ◈  ℹ️  ${config.prefix}mode
  ◈  🔐  ${config.prefix}security

╭─────────────────────────────────────╮
│  ⚙️  *EDIT CONFIG*                   │
╰─────────────────────────────────────╯

  ◈  ⚙️  ${config.prefix}showconfig
  ◈  📋  ${config.prefix}getcfg <key>
  ◈  ✏️  ${config.prefix}setcfg <key> <value>
  ◈  🔄  ${config.prefix}toggle <key>
  ◈  🔄  ${config.prefix}reloadcfg

╭─────────────────────────────────────╮
│  📁  *FILE MANAGER*                  │
╰─────────────────────────────────────╯

  ◈  📖  ${config.prefix}readfile <path>
  ◈  📂  ${config.prefix}listfiles <folder>
  ◈  💾  ${config.prefix}savefile <path>

╭─────────────────────────────────────╮
│  🔧  *SYSTEM*                        │
╰─────────────────────────────────────╯

  ◈  🔄  ${config.prefix}reloadplugins
  ◈  🔄  ${config.prefix}restartbot
  ◈  ⏱️  ${config.prefix}runtime
  ◈  🏓  ${config.prefix}ping

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👑  _${config.botName} — Owner Panel_
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(from, { text: menuText });
  },
};