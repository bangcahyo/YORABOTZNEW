module.exports = {
  name: 'dadu', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, formatMoney } = ctx;
    const bet = parseInt(args[0]);
    if (!bet || bet < config.minBet || bet > config.maxBet) return sock.sendMessage(from, { text: '❌ Taruhan tidak valid!' }, { quoted: msg });
    if (user.money < bet) return sock.sendMessage(from, { text: '❌ Uang tidak cukup!' }, { quoted: msg });
    const dU = Math.floor(Math.random()*6)+1, dB = Math.floor(Math.random()*6)+1;
    let win = dU > dB ? bet : dU < dB ? -bet : 0;
    updateUser(sender, { money: user.money + win });
    await sock.sendMessage(from, { text: `🎲 *DADU*\n\nKamu: ${dU}\nBot: ${dB}\n\n${win > 0 ? '🎉 Menang!' : win < 0 ? '😢 Kalah!' : '🤝 Seri!'}\n${win !== 0 ? (win > 0 ? '+' : '') + formatMoney(win) : ''}\nSaldo: ${formatMoney(user.money + win)}` }, { quoted: msg });
  }
};