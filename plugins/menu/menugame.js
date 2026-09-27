module.exports = {
  name: 'menugame', category: 'menu', aliases: ['menugames'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    await sock.sendMessage(from, { text: `╭━━━「 🎮 *MENU GAME* 」━━━\n\n╭─「 🎰 *TARUHAN UANG* 」\n│ 🎰 ${config.prefix}slot <taruhan>\n│ 🎲 ${config.prefix}dadu <taruhan>\n│ 🪙 ${config.prefix}koin <taruhan>\n│ 🃏 ${config.prefix}bj <taruhan>\n│ 🎡 ${config.prefix}roulette <warna> <taruhan>\n│ 🎲 ${config.prefix}sicbo <taruhan> <besar/kecil>\n│ ✊ ${config.prefix}suit <pilihan> <taruhan>\n│ ⚔️ ${config.prefix}war <taruhan>\n│ 🎡 ${config.prefix}wheel <taruhan>\n╰━━━━━━━━━━━━━━━━━━━━\n\n╭─「 🎯 *TEBAK-TEBAKAN* 」\n│ 🔢 ${config.prefix}tebakangka\n│ ❓ ${config.prefix}quiz\n│ 📝 ${config.prefix}tebakkata\n│ 🎨 ${config.prefix}tebakemoji\n│ 🧮 ${config.prefix}math\n│ 🎯 ${config.prefix}hangman\n╰━━━━━━━━━━━━━━━━━━━━\n\n╭─「 🎮 *BOARD GAME* 」\n│ ⭕ ${config.prefix}ttt\n╰━━━━━━━━━━━━━━━━━━━━\n\n💡 Game tebak-tebakan ada waktu 60 detik!\n🏳️ Ketik ${config.prefix}nyerah untuk skip` }, { quoted: msg });
  }
};