module.exports = {
  name: 'transfer', category: 'ekonomi',
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, mentioned, user, updateUser, getUser, formatMoney } = ctx;
    if (!mentioned || mentioned.length === 0) return sock.sendMessage(from, { text: `❌ Tag user!\nContoh: ${config.prefix}transfer @user 1000` }, { quoted: msg });
    const target = mentioned[0];
    const amount = parseInt(args[0]);
    if (!amount || amount <= 0) return sock.sendMessage(from, { text: '❌ Jumlah tidak valid!' }, { quoted: msg });
    if (user.money < amount) return sock.sendMessage(from, { text: `❌ Uang tidak cukup! Saldo: ${formatMoney(user.money)}` }, { quoted: msg });
    const tu = getUser(target);
    updateUser(sender, { money: user.money - amount });
    updateUser(target, { money: tu.money + amount });
    await sock.sendMessage(from, { text: `💸 *TRANSFER BERHASIL!*\n\nKe: @${target.split('@')[0]}\nJumlah: ${formatMoney(amount)}`, mentions: [target] }, { quoted: msg });
  }
};