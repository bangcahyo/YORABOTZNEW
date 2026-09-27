module.exports = {
  name: 'slot',
  category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, random, formatMoney } = ctx;
    const bet = parseInt(args[0]);
    if (!bet || bet < config.minBet || bet > config.maxBet) {
      return sock.sendMessage(from, { text: `❌ Taruhan ${formatMoney(config.minBet)} - ${formatMoney(config.maxBet)}` }, { quoted: msg });
    }
    if (user.money < bet) return sock.sendMessage(from, { text: '❌ Uang tidak cukup!' }, { quoted: msg });

    const em = ['🍒','🍋','🍊','🍇','💎','7️⃣'];
    const s1 = random(em), s2 = random(em), s3 = random(em);
    let win = 0, message = '';
    if (s1 === s2 && s2 === s3) { win = bet * 5; message = '🎉 JACKPOT! 5x!'; }
    else if (s1 === s2 || s2 === s3 || s1 === s3) { win = bet * 2; message = '✨ Menang! 2x!'; }
    else { win = -bet; message = '😢 Kalah!'; }
    updateUser(sender, { money: user.money + win });

    await sock.sendMessage(from, {
      text: `🎰 *SLOT*\n\n[ ${s1} | ${s2} | ${s3} ]\n\n${message}\n${win > 0 ? '+' : ''}${formatMoney(win)}\nSaldo: ${formatMoney(user.money + win)}`
    }, { quoted: msg });
  }
};