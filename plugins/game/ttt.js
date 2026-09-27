module.exports = {
  name: 'ttt', category: 'game', aliases: ['tictactoe'],
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, gameState } = ctx;
    if (user.money < 500) return sock.sendMessage(from, { text: '❌ Butuh Rp 500!' }, { quoted: msg });
    updateUser(sender, { money: user.money - 500 });
    const papan = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];
    const botPos = Math.floor(Math.random() * 9);
    papan[botPos] = '❌';
    gameState[from] = { game: 'ttt', papan, player: sender, botEmoji: '❌', playerEmoji: '⭕' };
    await sock.sendMessage(from, { text: `🎮 *TIC TAC TOE*\n\n${papan.slice(0,3).join(' ')}\n${papan.slice(3,6).join(' ')}\n${papan.slice(6,9).join(' ')}\n\nKamu: ⭕ | Bot: ❌\n\nLangkah: *${config.prefix}tttmove <1-9>*` }, { quoted: msg });
  }
};