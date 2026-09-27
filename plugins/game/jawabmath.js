module.exports = {
  name: 'jawabmath', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, clearGameTimeout, user, updateUser } = ctx;
    if (!gameState[from] || gameState[from].game !== 'math') return sock.sendMessage(from, { text: '❌ Tidak ada soal.' }, { quoted: msg });
    const jawab = parseInt(args[0]);
    if (jawab === gameState[from].jawab) {
      clearGameTimeout(from);
      updateUser(sender, { money: user.money + 500, point: user.point + 2 });
      delete gameState[from];
      await sock.sendMessage(from, { text: `🎉 *BENAR!*\n\n+Rp 500\n+2 Point` }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: `😢 *SALAH!* Coba lagi atau ketik *${config.prefix}nyerah*` }, { quoted: msg });
    }
  }
};