module.exports = {
  name: 'wheel', category: 'game', aliases: ['spin'],
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, formatMoney } = ctx;
    const bet = parseInt(args[0]);
    if (!bet || bet < config.minBet || bet > config.maxBet) return sock.sendMessage(from, { text: '❌ Taruhan tidak valid!' }, { quoted: msg });
    if (user.money < bet) return sock.sendMessage(from, { text: '❌ Uang tidak cukup!' }, { quoted: msg });
    const mults = [0, 0.5, 1, 1.5, 2, 3, 5, 10];
    const weights = [30, 20, 15, 12, 10, 7, 4, 2];
    let rand = Math.random() * 100, idx = 0, cum = 0;
    for (let i = 0; i < weights.length; i++) { cum += weights[i]; if (rand <= cum) { idx = i; break; } }
    const mult = mults[idx];
    const win = Math.floor(bet * mult) - bet;
    updateUser(sender, { money: user.money + win });
    await sock.sendMessage(from, { text: `🎡 *SPIN WHEEL*\n\nMultiplier: ${mult}x\n${win > 0 ? '🎉 Menang!' : win === 0 ? '🤝 Balik modal!' : '😢 Kalah!'}\n${win !== 0 ? (win > 0 ? '+' : '') + formatMoney(win) : ''}\nSaldo: ${formatMoney(user.money + win)}` }, { quoted: msg });
  }
};