module.exports = {
  name: 'menugame',
  category: 'menu',
  aliases: ['menugames'],
  async execute(sock, msg, args, ctx) {
    const { config, from, formatMoney } = ctx;

    const menuText = `╔══════════════════════════════════════╗
║         🎮  *GAME MENU*  🎮
╚══════════════════════════════════════╝

╭─────────────────────────────────────╮
│  🎰  *TARUHAN UANG*                  │
╰─────────────────────────────────────╯

  ◈  🎰  ${config.prefix}slot <taruhan>
  ◈  🎲  ${config.prefix}dadu <taruhan>
  ◈  🪙  ${config.prefix}koin <taruhan>
  ◈  🃏  ${config.prefix}bj <taruhan>
  ◈  🎡  ${config.prefix}roulette <warna> <taruhan>
  ◈  🎲  ${config.prefix}sicbo <taruhan> <besar/kecil>
  ◈  ✊  ${config.prefix}suit <pilihan> <taruhan>
  ◈  ⚔️  ${config.prefix}war <taruhan>
  ◈  🎡  ${config.prefix}wheel <taruhan>

╭─────────────────────────────────────╮
│  🎯  *TEBAK-TEBAKAN*                 │
╰─────────────────────────────────────╯

  ◈  🔢  ${config.prefix}tebakangka
  ◈  ❓  ${config.prefix}quiz
  ◈  📝  ${config.prefix}tebakkata
  ◈  🎨  ${config.prefix}tebakemoji
  ◈  🧮  ${config.prefix}math
  ◈  🎯  ${config.prefix}hangman
  ◈  🖼️  ${config.prefix}tebakgambar
  ◈  ⚽  ${config.prefix}tebakpemainbola
  ◈  🎵  ${config.prefix}tebaklagu
  ◈  🎬  ${config.prefix}tebakfilm
  ◈  🐾  ${config.prefix}tebakhewan
  ◈  🏙️  ${config.prefix}tebakibukota
  ◈  🏳️  ${config.prefix}tebakbendera
  ◈  📖  ${config.prefix}tebaksurah
  ◈  🎩  ${config.prefix}tebakpresiden
  ◈  🪐  ${config.prefix}tebakplanet
  ◈  🎌  ${config.prefix}tebakanime

╭─────────────────────────────────────╮
│  🧠  *ASAH OTAK & RIDDLES*           │
╰─────────────────────────────────────╯

  ◈  🧠  ${config.prefix}asahotak
  ◈  🕵️  ${config.prefix}siapakahaku
  ◈  🎭  ${config.prefix}caklontong
  ◈  📜  ${config.prefix}lengkapikalimat
  ◈  👨‍👩‍👧‍👦  ${config.prefix}family100

╭─────────────────────────────────────╮
│  🎮  *BOARD GAME*                    │
╰─────────────────────────────────────╯

  ◈  ⭕  ${config.prefix}ttt

╭─────────────────────────────────────╮
│  💡  *TIPS*                          │
╰─────────────────────────────────────╯

  ◆  Ketik jawabanmu *langsung* di chat
  ◆  Ketik *nyerah* untuk skip soal
  ◆  Setiap game ada waktu *60 detik*
  ◆  Semua game *GRATIS* (tanpa limit) 🅛

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  💵  Min Bet  : *${formatMoney(config.minBet)}*
  💵  Max Bet  : *${formatMoney(config.maxBet)}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(from, { text: menuText });
  },
};
