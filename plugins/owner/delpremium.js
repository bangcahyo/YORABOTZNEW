module.exports = {
  name: 'delpremium',
  category: 'owner',
  aliases: ['removepremium', 'unpremium'],
  async execute(sock, msg, args, ctx) {
    const { config, from, mentioned, removePremium, isSenderOwner } = ctx;
    if (!isSenderOwner()) return;

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant
      || msg.message?.extendedTextMessage?.contextInfo?.participantAlt;
    const target = (mentioned && mentioned[0]) || quoted;
    if (!target) {
      return sock.sendMessage(from, {
        text: '📝 *CARA PAKAI*\n\n' +
          config.prefix + 'delpremium @user\n' +
          'atau reply pesan user lalu:\n' +
          config.prefix + 'delpremium',
      }, { quoted: msg });
    }

    removePremium(target);
    await sock.sendMessage(from, {
      text: '🗑️ *PREMIUM DIHAPUS*\n\n' +
        '👤 User: @' + target.split('@')[0] + '\n' +
        '💎 Status: *FREE USER* sekarang.',
      mentions: [target],
    }, { quoted: msg });
  },
};
