module.exports = {
  name: 'ttt', category: 'game', aliases: ['tictactoe'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, user, getUser, gameState, mentioned, isGroup, setGameTimeout } = ctx;
    if (!isGroup()) {
      return sock.sendMessage(from, { text: 'Tic Tac Toe hanya bisa dimainkan di grup.' }, { quoted: msg });
    }
    if (gameState[from]) {
      return sock.sendMessage(from, { text: 'Masih ada permainan yang aktif di grup ini.' }, { quoted: msg });
    }
    if (!user.registered) {
      return sock.sendMessage(from, { text: 'Daftar dulu sebelum bermain Tic Tac Toe.' }, { quoted: msg });
    }

    const opponents = [...new Set(mentioned || [])].filter(jid => jid !== sender);
    if (opponents.length !== 1) {
      return sock.sendMessage(from, { text: 'Tantang satu pemain dengan `.ttt @user`.' }, { quoted: msg });
    }

    const opponent = opponents[0];
    const opponentUser = getUser(opponent);
    if (!opponentUser.registered) {
      return sock.sendMessage(from, { text: `@${opponent.split('@')[0]} harus daftar dulu sebelum bermain.`, mentions: [opponent] }, { quoted: msg });
    }
    if (user.money < 500 || opponentUser.money < 500) {
      return sock.sendMessage(from, { text: 'Kedua pemain harus memiliki minimal Rp500 untuk taruhan.' }, { quoted: msg });
    }

    const challenge = { game: 'ttt-pending', challenger: sender, opponent };
    gameState[from] = challenge;
    setGameTimeout(from, async () => {
      if (gameState[from] !== challenge) return;
      await sock.sendMessage(from, {
        text: `⌛ Tantangan Tic Tac Toe untuk @${opponent.split('@')[0]} kedaluwarsa.`,
        mentions: [opponent],
      });
    });
    await sock.sendMessage(from, {
      text: `🎮 @${opponent.split('@')[0]}, @${sender.split('@')[0]} menantangmu bermain Tic Tac Toe.\n\nBalas *terima* atau *tolak* tanpa prefix. Jika diterima, masing-masing membayar Rp500.`,
      mentions: [sender, opponent],
    }, { quoted: msg });
  }
};