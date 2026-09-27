module.exports = {
  name: 'sicbo', category: 'game',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, formatMoney } = ctx;
    const bet = parseInt(args[0]);
    if (!bet || bet < config.minBet || bet > config.maxBet) return sock.sendMessage(from, { text: '❌ Taruhan tidak valid!' }, { quoted: msg });
    if (user.money < bet) return sock.sendMessage(from, { text: '❌ Uang tidak cukup!' }, { quoted: msg });
    const d1 = Math.floor(Math.random()*6)+1, d2 = Math.floor(Math.random()*6)+1, d3 = Math.floor(Math.random()*6)+1;
    const total = d1+d2+d3;
    const pilihan = args[1]?.toLowerCase();
    let win = 0, hasil = '';
    if (pilihan === 'besar') { win = total >= 11 ? bet : -bet; hasil = total >= 11 ? '🎉 BESAR! Menang!' : '😢 KECIL! Kalah!'; }
    else if (pilihan === 'kecil') { win = total <= 10 ? bet : -bet; hasil = total <= 10 ? '🎉 KECIL! Menang!' : '😢 BESAR! Kalah!'; }
    else { if (total === 3 || total === 18) { win = bet*10; hasil = '💥 JACKPOT!'; } else { win = -bet; hasil = '😢 Pakai besar/kecil!'; } }
    updateUser(sender, { money: user.money + win });
    await sock.sendMessage(from, { text: `🎲 *SIC BO*\n\n[${d1}] [${d2}] [${d3}]\nTotal: ${total}\n${hasil}\n${win !== 0 ? (win > 0 ? '+' : '') + formatMoney(win) : ''}\nSaldo: ${formatMoney(user.money + win)}` }, { quoted: msg });
  }
};