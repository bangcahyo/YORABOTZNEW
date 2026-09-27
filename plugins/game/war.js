module.exports = {
  name: 'war', category: 'game', aliases: ['perang'],
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, formatMoney } = ctx;
    const bet = parseInt(args[0]);
    if (!bet || bet < config.minBet || bet > config.maxBet) return sock.sendMessage(from, { text: '❌ Taruhan tidak valid!' }, { quoted: msg });
    if (user.money < bet) return sock.sendMessage(from, { text: '❌ Uang tidak cukup!' }, { quoted: msg });
    const kU = Math.floor(Math.random()*13)+1, kB = Math.floor(Math.random()*13)+1;
    let win = kU > kB ? bet : kU < kB ? -bet : 0;
    updateUser(sender, { money: user.money + win });
    await sock.sendMessage(from, { text: `⚔️ *CARD WAR*\n\nKamu: ${kU}\nBot: ${kB}\n\n${win > 0 ? '🎉 Menang!' : win < 0 ? '😢 Kalah!' : '🤝 Seri!'}\n${win !== 0 ? (win > 0 ? '+' : '') + formatMoney(win) : ''}\nSaldo: ${formatMoney(user.money + win)}` }, { quoted: msg });
  }
};