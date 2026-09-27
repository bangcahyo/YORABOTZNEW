module.exports = {
  name: 'jawab', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, clearGameTimeout, user, updateUser } = ctx;
    if (!gameState[from] || gameState[from].game !== 'tebakangka') {
      return sock.sendMessage(from, { text: '❌ Tidak ada game aktif.' }, { quoted: msg });
    }
    const jawab = parseInt(args[0]);
    const g = gameState[from];
    if (jawab === g.angka) {
      clearGameTimeout(from);
      updateUser(sender, { point: user.point + 5, money: user.money + 500 });
      delete gameState[from];
      await sock.sendMessage(from, { text: `🎉 *BENAR!*\nAngka: ${g.angka}\n\n+5 Point\n+Rp 500` }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: `😢 *SALAH!* Coba lagi atau ketik *${config.prefix}nyerah*` }, { quoted: msg });
    }
  }
};