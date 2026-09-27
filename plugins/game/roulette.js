module.exports = {
  name: 'roulette', category: 'game', aliases: ['rolet'],
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, formatMoney } = ctx;
    const pilihan = args[0]?.toLowerCase();
    const bet = parseInt(args[1]);
    if (!['red','black','green'].includes(pilihan)) return sock.sendMessage(from, { text: '❌ Pilih: red/black/green' }, { quoted: msg });
    if (!bet || bet < config.minBet || bet > config.maxBet) return sock.sendMessage(from, { text: '❌ Taruhan tidak valid!' }, { quoted: msg });
    if (user.money < bet) return sock.sendMessage(from, { text: '❌ Uang tidak cukup!' }, { quoted: msg });
    const angka = Math.floor(Math.random() * 37);
    let warna = angka === 0 ? 'green' : angka <= 18 ? 'red' : 'black';
    let win = 0, mult = 0;
    if (pilihan === warna) { mult = warna === 'green' ? 14 : 2; win = bet * (mult - 1); }
    else win = -bet;
    updateUser(sender, { money: user.money + win });
    await sock.sendMessage(from, { text: `🎡 *ROULETTE*\n\nAngka: ${angka} (${warna.toUpperCase()})\nPilihan: ${pilihan.toUpperCase()}\n\n${win > 0 ? `🎉 MENANG! (${mult}x)` : win < 0 ? '😢 Kalah!' : '🤝 Seri!'}\n${win !== 0 ? (win > 0 ? '+' : '') + formatMoney(win) : ''}\nSaldo: ${formatMoney(user.money + win)}` }, { quoted: msg });
  }
};