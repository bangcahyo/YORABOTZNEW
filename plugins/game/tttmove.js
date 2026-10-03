const { handleTttInput } = require('../../lib/ttt-game');

module.exports = {
  name: 'tttmove',
  category: 'game',
  async execute(sock, msg, args, ctx) {
    const handled = await handleTttInput(sock, msg, ctx, args[0] || '');
    if (!handled) {
      await sock.sendMessage(ctx.from, {
        text: 'Tidak ada giliran Tic Tac Toe untukmu. Saat bermain, kirim angka 1–9 langsung tanpa command.',
      }, { quoted: msg });
    }
  },
};