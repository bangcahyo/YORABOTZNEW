module.exports = {
  name: 'unmute', category: 'group',
  async execute(sock, msg, args, ctx) {
    const { from, mentioned, isSenderOwner, spamTracker } = ctx;
    if (!isSenderOwner()) return;
    if (!mentioned || mentioned.length === 0) return sock.sendMessage(from, { text: 'Tag user!' }, { quoted: msg });
    const target = mentioned[0];
    if (spamTracker[target]) {
      spamTracker[target].mutedUntil = 0;
      spamTracker[target].count = 0;
      spamTracker[target].warned = 0;
    }
    await sock.sendMessage(from, { text: `🔊 @${target.split('@')[0]} telah di-unmute!`, mentions: [target] }, { quoted: msg });
  }
};