module.exports = {
  name: 'addmoney',
  category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from, mentioned, isSenderOwner, getUser, updateUser, formatMoney } = ctx;

    let isOwner = false;
    try { isOwner = isSenderOwner && isSenderOwner(); } catch {}
    if (!isOwner) return;

    if (!mentioned || mentioned.length === 0) {
      return sock.sendMessage(from, { text: '❌ Tag user!\nContoh: `.addmoney @user 10000`' });
    }

    const target = mentioned[0];
    const amount = parseInt(args[1]);

    if (!amount || amount <= 0) {
      return sock.sendMessage(from, { text: '❌ Jumlah tidak valid!' });
    }

    const tu = getUser(target);
    updateUser(target, { money: tu.money + amount });

    await sock.sendMessage(from, {
      text: `✅ +${formatMoney(amount)} untuk @${target.split('@')[0]}\nTotal: ${formatMoney(tu.money + amount)}`,
      mentions: [target],
    });
  },
};