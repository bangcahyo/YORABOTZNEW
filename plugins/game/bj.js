module.exports = {
  name: 'bj', category: 'game', aliases: ['blackjack'],
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, random, formatMoney } = ctx;
    const bet = parseInt(args[0]);
    if (!bet || bet < config.minBet || bet > config.maxBet) return sock.sendMessage(from, { text: '❌ Taruhan tidak valid!' }, { quoted: msg });
    if (user.money < bet) return sock.sendMessage(from, { text: '❌ Uang tidak cukup!' }, { quoted: msg });
    const kartu = [2,3,4,5,6,7,8,9,10,10,10,10,11];
    const p1 = random(kartu), p2 = random(kartu);
    const b1 = random(kartu), b2 = random(kartu);
    const pT = p1 + p2, bT = b1 + b2;
    let win = 0, hasil = '';
    if (pT > 21) { win = -bet; hasil = '💥 BUST! Kalah!'; }
    else if (bT > 21) { win = bet; hasil = '🎉 Bot bust! Menang!'; }
    else if (pT > bT) { win = bet; hasil = '🎉 Menang!'; }
    else if (pT < bT) { win = -bet; hasil = '😢 Kalah!'; }
    else { win = 0; hasil = '🤝 Seri!'; }
    updateUser(sender, { money: user.money + win });
    await sock.sendMessage(from, { text: `🃏 *BLACKJACK*\n\n👤 [${p1}, ${p2}] = ${pT}\n🤖 [${b1}, ${b2}] = ${bT}\n\n${hasil}\n${win !== 0 ? (win > 0 ? '+' : '') + formatMoney(win) : ''}\nSaldo: ${formatMoney(user.money + win)}` }, { quoted: msg });
  }
};