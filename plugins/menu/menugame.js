module.exports = {
  name: 'menugame',
  category: 'menu',
  aliases: ['menugames'],
  async execute(sock, msg, args, ctx) {
    const { config, from, formatMoney } = ctx;

    const menuText = `╔══════════════════════════════════╗
║      🎮 *MENU GAME*
╚══════════════════════════════════╝

🎰 *TARUHAN UANG*
${config.prefix}slot <taruhan>
${config.prefix}dadu <taruhan>
${config.prefix}koin <taruhan>
${config.prefix}bj <taruhan>
${config.prefix}roulette <warna> <taruhan>
${config.prefix}sicbo <taruhan> <besar/kecil>
${config.prefix}suit <pilihan> <taruhan>
${config.prefix}war <taruhan>
${config.prefix}wheel <taruhan>

🎯 *TEBAK-TEBAKAN*
${config.prefix}tebakangka
${config.prefix}quiz
${config.prefix}tebakkata
${config.prefix}tebakemoji
${config.prefix}math
${config.prefix}hangman

🎮 *BOARD GAME*
${config.prefix}ttt

💡 Ketik jawabanmu langsung di chat!
🏳️ Ketik ${config.prefix}nyerah untuk skip

💵 Min: ${formatMoney(config.minBet)} | Max: ${formatMoney(config.maxBet)}`;

    await sock.sendMessage(from, { text: menuText });
  },
};