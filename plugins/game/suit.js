module.exports = {
  name: 'suit', category: 'game', aliases: ['rps'],
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, user, updateUser, random, formatMoney } = ctx;
    const pilihan = args[0]?.toLowerCase();
    const bet = parseInt(args[1]);
    const map = { batu: '✊', gunting: '✌️', kertas: '✋' };
    if (!['batu','gunting','kertas'].includes(pilihan)) return sock.sendMessage(from, { text: '❌ Pilih: batu/gunting/kertas' }, { quoted: msg });
    if (!bet || bet < config.minBet || bet > config.maxBet) return sock.sendMessage(from, { text: '❌ Taruhan tidak valid!' }, { quoted: msg });
    if (user.money < bet) return sock.sendMessage(from, { text: '❌ Uang tidak cukup!' }, { quoted: msg });
    const botP = random(['batu','gunting','kertas']);
    let win = 0, hasil = '';
    if (pilihan === botP) { win = 0; hasil = '🤝 Seri!'; }
    else if ((pilihan === 'batu' && botP === 'gunting') || (pilihan === 'gunting' && botP === 'kertas') || (pilihan === 'kertas' && botP === 'batu')) { win = bet; hasil = '🎉 Menang!'; }
    else { win = -bet; hasil = '😢 Kalah!'; }
    updateUser(sender, { money: user.money + win });
    await sock.sendMessage(from, { text: `✊ *SUIT*\n\nKamu: ${map[pilihan]} ${pilihan}\nBot: ${map[botP]} ${botP}\n\n${hasil}\n${win !== 0 ? (win > 0 ? '+' : '') + formatMoney(win) : ''}\nSaldo: ${formatMoney(user.money + win)}` }, { quoted: msg });
  }
};