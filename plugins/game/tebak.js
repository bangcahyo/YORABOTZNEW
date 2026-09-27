module.exports = {
  name: 'tebak', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, clearGameTimeout, user, updateUser } = ctx;
    if (!gameState[from] || gameState[from].game !== 'hangman') return sock.sendMessage(from, { text: '❌ Tidak ada game.' }, { quoted: msg });
    const huruf = args[0]?.toLowerCase();
    if (!huruf || huruf.length !== 1 || !/[a-z]/.test(huruf)) return sock.sendMessage(from, { text: '❌ Masukkan 1 huruf!' }, { quoted: msg });
    const st = gameState[from];
    if (st.tebakan.includes(huruf)) return sock.sendMessage(from, { text: '❌ Sudah ditebak!' }, { quoted: msg });
    st.tebakan.push(huruf);
    if (!st.kata.includes(huruf)) st.nyawa--;
    const tampil = st.kata.split('').map(c => st.tebakan.includes(c) ? c : '_').join(' ');
    const nyawaBar = '❤️'.repeat(st.nyawa) + '🖤'.repeat(6 - st.nyawa);
    if (st.nyawa <= 0) {
      clearGameTimeout(from);
      delete gameState[from];
      return sock.sendMessage(from, { text: `💀 *GAME OVER!*\nKata: *${st.kata}*` }, { quoted: msg });
    }
    if (!tampil.includes('_')) {
      clearGameTimeout(from);
      updateUser(sender, { money: user.money + 1000, point: user.point + 5 });
      delete gameState[from];
      return sock.sendMessage(from, { text: `🎉 *MENANG!*\nKata: *${st.kata}*\n\n+Rp 1.000\n+5 Point` }, { quoted: msg });
    }
    await sock.sendMessage(from, { text: `🎯 *HANGMAN*\n\nKata: ${tampil}\nNyawa: ${nyawaBar}\nHuruf: ${st.tebakan.join(', ')}` }, { quoted: msg });
  }
};