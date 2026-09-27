module.exports = {
  name: 'math', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, gameState, setGameTimeout, random } = ctx;
    const a = Math.floor(Math.random()*50)+1;
    const b = Math.floor(Math.random()*50)+1;
    const op = random(['+','-','x']);
    let jawab;
    if (op === '+') jawab = a + b;
    else if (op === '-') jawab = a - b;
    else jawab = a * b;
    gameState[from] = { game: 'math', jawab, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${jawab}*` });
    });
    await sock.sendMessage(from, { text: `🧮 *MATH*\n\n${a} ${op} ${b} = ?\n\nJawab: *${config.prefix}jawabmath <angka>*\nNyerah: *${config.prefix}nyerah*\n\n⏱️ 60 detik\nHadiah: +Rp 500, +2 Point` }, { quoted: msg });
  }
};