module.exports = {
  name: 'tttmove', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, random, user, updateUser } = ctx;
    if (!gameState[from] || gameState[from].game !== 'ttt') return sock.sendMessage(from, { text: '❌ Tidak ada game.' }, { quoted: msg });
    const st = gameState[from];
    if (st.player !== sender) return sock.sendMessage(from, { text: '❌ Bukan game kamu!' }, { quoted: msg });
    const pos = parseInt(args[0]) - 1;
    if (isNaN(pos) || pos < 0 || pos > 8) return sock.sendMessage(from, { text: '❌ Pilih 1-9!' }, { quoted: msg });
    const emojiList = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];
    if (!emojiList.includes(st.papan[pos])) return sock.sendMessage(from, { text: '❌ Sudah terisi!' }, { quoted: msg });
    st.papan[pos] = st.playerEmoji;
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    const isWin = (b, s) => wins.some(([a,b2,c]) => b[a]===s && b[b2]===s && b[c]===s);
    if (isWin(st.papan, st.playerEmoji)) {
      updateUser(sender, { money: user.money + 1000, point: user.point + 5 });
      delete gameState[from];
      return sock.sendMessage(from, { text: `🎉 *MENANG!*\n\n+Rp 1.000\n+5 Point` }, { quoted: msg });
    }
    if (st.papan.every(v => v === '❌' || v === '⭕')) {
      delete gameState[from];
      return sock.sendMessage(from, { text: '🤝 *SERI!* Uang dikembalikan.' }, { quoted: msg });
    }
    const empty = st.papan.map((v,i) => emojiList.includes(v) ? i : -1).filter(i => i !== -1);
    let botMove = -1;
    for (const idx of empty) { const t = [...st.papan]; t[idx] = '❌'; if (isWin(t, '❌')) { botMove = idx; break; } }
    if (botMove === -1) for (const idx of empty) { const t = [...st.papan]; t[idx] = '⭕'; if (isWin(t, '⭕')) { botMove = idx; break; } }
    if (botMove === -1) botMove = empty.includes(4) ? 4 : random(empty);
    st.papan[botMove] = '❌';
    if (isWin(st.papan, '❌')) {
      delete gameState[from];
      return sock.sendMessage(from, { text: `😢 *KALAH!*\n\n${st.papan.slice(0,3).join(' ')}\n${st.papan.slice(3,6).join(' ')}\n${st.papan.slice(6,9).join(' ')}` }, { quoted: msg });
    }
    await sock.sendMessage(from, { text: `🎮 *TIC TAC TOE*\n\n${st.papan.slice(0,3).join(' ')}\n${st.papan.slice(3,6).join(' ')}\n${st.papan.slice(6,9).join(' ')}\n\nLangkahmu: *${config.prefix}tttmove <1-9>*` }, { quoted: msg });
  }
};