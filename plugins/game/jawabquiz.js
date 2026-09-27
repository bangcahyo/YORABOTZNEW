module.exports = {
  name: 'jawabquiz', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, clearGameTimeout, user, updateUser } = ctx;
    if (!gameState[from] || gameState[from].game !== 'quiz') return sock.sendMessage(from, { text: '❌ Tidak ada quiz aktif.' }, { quoted: msg });
    const jawab = args.join(' ').toLowerCase();
    const g = gameState[from];
    if (jawab === g.jawab) {
      clearGameTimeout(from);
      updateUser(sender, { point: user.point + 10, money: user.money + 1000 });
      delete gameState[from];
      await sock.sendMessage(from, { text: `🎉 *BENAR!*\n\n+10 Point\n+Rp 1.000` }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: `😢 *SALAH!* Coba lagi atau ketik *${config.prefix}nyerah*` }, { quoted: msg });
    }
  }
};