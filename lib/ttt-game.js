const ENTRY_FEE = 500;
const WIN_REWARD = 1000;
const WIN_POINTS = 5;
const NUMBER_MARKERS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function createTttGame(challenger, opponent) {
  return {
    game: 'ttt',
    board: [...NUMBER_MARKERS],
    players: [challenger, opponent],
    marks: { [challenger]: '⭕', [opponent]: '❌' },
    turn: challenger,
  };
}

function renderTttBoard(board) {
  return [board.slice(0, 3).join(' '), board.slice(3, 6).join(' '), board.slice(6, 9).join(' ')].join('\n');
}

function findWinner(board, mark) {
  return WIN_LINES.some(([first, second, third]) =>
    board[first] === mark && board[second] === mark && board[third] === mark);
}

function applyTttMove(state, sender, input) {
  if (!state || state.game !== 'ttt' || !state.players.includes(sender)) return { status: 'not-player' };
  if (sender !== state.turn) return { status: 'not-turn' };
  if (!/^[1-9]$/.test(String(input).trim())) return { status: 'invalid' };

  const position = Number(String(input).trim()) - 1;
  if (!NUMBER_MARKERS.includes(state.board[position])) return { status: 'occupied' };

  const mark = state.marks[sender];
  state.board[position] = mark;
  if (findWinner(state.board, mark)) return { status: 'win', winner: sender };
  if (state.board.every(cell => !NUMBER_MARKERS.includes(cell))) return { status: 'draw' };

  state.turn = state.players.find(player => player !== sender);
  return { status: 'continue' };
}

function clearTttState(ctx) {
  ctx.clearGameTimeout(ctx.from);
  delete ctx.gameState[ctx.from];
}

function scheduleTttTimeout(sock, state, ctx, isInvitation = false) {
  ctx.setGameTimeout(ctx.from, async () => {
    if (ctx.gameState[ctx.from] !== state) return;
    if (!isInvitation) {
      for (const player of state.players) {
        const user = ctx.getUser(player);
        ctx.updateUser(player, { money: user.money + ENTRY_FEE });
      }
    }
    await sock.sendMessage(ctx.from, {
      text: isInvitation
        ? '⌛ Tantangan Tic Tac Toe kedaluwarsa karena tidak dijawab.'
        : '⌛ Permainan Tic Tac Toe berakhir karena terlalu lama tidak ada langkah. Biaya dikembalikan.',
    });
  });
}

async function acceptTttChallenge(sock, msg, ctx, state) {
  const challenger = ctx.getUser(state.challenger);
  const opponent = ctx.getUser(state.opponent);
  if (!challenger.registered || !opponent.registered) {
    clearTttState(ctx);
    await sock.sendMessage(ctx.from, { text: '❌ Kedua pemain harus memiliki akun terdaftar.' }, { quoted: msg });
    return true;
  }
  if (challenger.money < ENTRY_FEE || opponent.money < ENTRY_FEE) {
    clearTttState(ctx);
    await sock.sendMessage(ctx.from, { text: '❌ Tantangan dibatalkan. Kedua pemain harus memiliki minimal Rp500.' }, { quoted: msg });
    return true;
  }

  ctx.updateUser(state.challenger, { money: challenger.money - ENTRY_FEE });
  ctx.updateUser(state.opponent, { money: opponent.money - ENTRY_FEE });
  const game = createTttGame(state.challenger, state.opponent);
  ctx.gameState[ctx.from] = game;
  scheduleTttTimeout(sock, game, ctx);
  await sock.sendMessage(ctx.from, {
    text: `🎮 *TIC TAC TOE DIMULAI*\n\n${renderTttBoard(game.board)}\n\n⭕ @${state.challenger.split('@')[0]} · ❌ @${state.opponent.split('@')[0]}\nGiliran: @${state.challenger.split('@')[0]}\n\nKirim angka *1–9* tanpa prefix untuk memilih kotak. Taruhan: Rp500 per pemain.`,
    mentions: game.players,
  }, { quoted: msg });
  return true;
}

async function handleTttInput(sock, msg, ctx, input) {
  const state = ctx.gameState[ctx.from];
  if (state?.game === 'ttt-pending') {
    if (ctx.sender !== state.opponent) return false;
    const response = String(input).trim().toLowerCase();
    if (response === 'tolak') {
      clearTttState(ctx);
      await sock.sendMessage(ctx.from, { text: `Tantangan Tic Tac Toe dari @${state.challenger.split('@')[0]} ditolak.`, mentions: [state.challenger] }, { quoted: msg });
      return true;
    }
    if (response === 'terima') return acceptTttChallenge(sock, msg, ctx, state);
    return false;
  }

  if (state?.game !== 'ttt' || !state.players.includes(ctx.sender)) return false;
  if (!/^\d+$/.test(String(input).trim())) return false;
  const move = applyTttMove(state, ctx.sender, input);
  if (move.status === 'not-turn') {
    await sock.sendMessage(ctx.from, { text: '⏳ Belum giliran kamu.' }, { quoted: msg });
    return true;
  }
  if (move.status === 'invalid') {
    await sock.sendMessage(ctx.from, { text: 'Pilih kotak dengan angka 1–9.' }, { quoted: msg });
    return true;
  }
  if (move.status === 'occupied') {
    await sock.sendMessage(ctx.from, { text: 'Kotak itu sudah terisi. Pilih angka lain.' }, { quoted: msg });
    return true;
  }
  if (move.status === 'win') {
    clearTttState(ctx);
    const winner = ctx.getUser(move.winner);
    ctx.updateUser(move.winner, { money: winner.money + WIN_REWARD, point: winner.point + WIN_POINTS });
    await sock.sendMessage(ctx.from, {
      text: `🎉 *MENANG!* @${move.winner.split('@')[0]}\n\n${renderTttBoard(state.board)}\n\n+Rp1.000 · +5 poin`,
      mentions: [move.winner],
    }, { quoted: msg });
    return true;
  }
  if (move.status === 'draw') {
    clearTttState(ctx);
    for (const player of state.players) {
      const user = ctx.getUser(player);
      ctx.updateUser(player, { money: user.money + ENTRY_FEE });
    }
    await sock.sendMessage(ctx.from, {
      text: `🤝 *SERI!*\n\n${renderTttBoard(state.board)}\n\nBiaya Rp500 dikembalikan ke kedua pemain.`,
    }, { quoted: msg });
    return true;
  }

  scheduleTttTimeout(sock, state, ctx);
  await sock.sendMessage(ctx.from, {
    text: `🎮 *TIC TAC TOE*\n\n${renderTttBoard(state.board)}\n\nGiliran: @${state.turn.split('@')[0]} · kirim angka *1–9* tanpa prefix.`,
    mentions: [state.turn],
  }, { quoted: msg });
  return true;
}

module.exports = {
  ENTRY_FEE,
  WIN_REWARD,
  WIN_POINTS,
  createTttGame,
  renderTttBoard,
  applyTttMove,
  handleTttInput,
};