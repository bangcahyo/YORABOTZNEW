module.exports = {
  name: 'menufun',
  category: 'menu',
  aliases: ['menuhiburan'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;

    const menuText = `╔══════════════════════════════════════╗
║         🎭  *FUN MENU*  🎭
╚══════════════════════════════════════╝

╭─────────────────────────────────────╮
│  🌸  *PUISI & PANTUN*                │
╰─────────────────────────────────────╯

  ◈  🎭  ${config.prefix}pantun
  ◈  📜  ${config.prefix}puisi <tema>

╭─────────────────────────────────────╮
│  💬  *MOTIVASI & BIJAK*              │
╰─────────────────────────────────────╯

  ◈  💬  ${config.prefix}quote
  ◈  🔥  ${config.prefix}motivasi
  ◈  🌟  ${config.prefix}katabijak

╭─────────────────────────────────────╮
│  🔮  *RAMALAN*                       │
╰─────────────────────────────────────╯

  ◈  🔮  ${config.prefix}ramalan
  ◈  💍  ${config.prefix}kapankahnikah
  ◈  ♈  ${config.prefix}zodiak <zodiak/tanggal>
  ◈  💑  ${config.prefix}jodoh @user
  ◈  🎭  ${config.prefix}sifat <nama>

╭─────────────────────────────────────╮
│  💘  *CINTA & GOMBAL*                │
╰─────────────────────────────────────╯

  ◈  💘  ${config.prefix}gombalan
  ◈  💌  ${config.prefix}pickupline
  ◈  💞  ${config.prefix}bucin

╭─────────────────────────────────────╮
│  😂  *HIBURAN*                       │
╰─────────────────────────────────────╯

  ◈  😄  ${config.prefix}ceritahumor
  ◈  👻  ${config.prefix}ceritahoror
  ◈  🧪  ${config.prefix}faktaunik

╭─────────────────────────────────────╮
│  💬  *TRUTH OR DARE*                 │
╰─────────────────────────────────────╯

  ◈  💬  ${config.prefix}truth
  ◈  🔥  ${config.prefix}dare

╭─────────────────────────────────────╮
│  ✨  *SERBA SERBI*                   │
╰─────────────────────────────────────╯

  ◈  😎  ${config.prefix}cekganteng [nama]
  ◈  😍  ${config.prefix}cekcantik [nama]
  ◈  📖  ${config.prefix}artinama <nama>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚡  _${config.botName} — Fun Menu_
  🅛  _Semua fitur fun GRATIS (tanpa limit)_
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(from, { text: menuText });
  },
};
