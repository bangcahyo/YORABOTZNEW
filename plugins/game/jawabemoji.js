module.exports = {
  name: 'jawabemoji', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, clearGameTimeout, user, updateUser } = ctx;
    if (!gameState[from] || gameState[from].game !== 'tebakemoji') return sock.sendMessage(from, { text: '❌ Tidak ada game.' }, { quoted: msg });
    const jawab = args.join(' ').toLowerCase();
    if (gameState[from].jawab.some(j => jawab.includes(j))) {
      clearGameTimeout(from);
      updateUser(sender, { money: user.money + 800, point: user.point + 3 });
      delete gameState[from];
      await sock.sendMessage(from, { text: `🎉 *BENAR!*\n\n+Rp 800\n+3 Point` }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: `😢 *SALAH!* Coba lagi atau ketik *${config.prefix}nyerah*` }, { quoted: msg });
    }
  }
};