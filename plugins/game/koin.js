module.exports = {
  name: 'koin', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, formatMoney } = ctx;
    const bet = parseInt(args[0]);
    if (!bet || bet < config.minBet || bet > config.maxBet) return sock.sendMessage(from, { text: '❌ Taruhan tidak valid!' }, { quoted: msg });
    if (user.money < bet) return sock.sendMessage(from, { text: '❌ Uang tidak cukup!' }, { quoted: msg });
    const hasil = Math.random() < 0.5 ? '👑 Heads' : '🦅 Tails';
    const menang = Math.random() < 0.5;
    const win = menang ? bet : -bet;
    updateUser(sender, { money: user.money + win });
    await sock.sendMessage(from, { text: `🪙 *KOIN*\n\nHasil: ${hasil}\n\n${menang ? '🎉 Menang!' : '😢 Kalah!'}\n${win > 0 ? '+' : ''}${formatMoney(win)}\nSaldo: ${formatMoney(user.money + win)}` }, { quoted: msg });
  }
};