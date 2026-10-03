module.exports = {
  name: 'unmute', category: 'group',
  async execute(sock, msg, args, ctx) {
    const { from, sender, mentioned, isGroup, isSenderOwner, spamTracker } = ctx;
    if (!isGroup(from)) return sock.sendMessage(from, { text: '❌ Command ini hanya bisa digunakan di grup.' }, { quoted: msg });
    const group = await sock.groupMetadata(from);
    const senderIsAdmin = (group.participants || []).some(participant =>
      participant.id.split(':')[0] === sender.split(':')[0] && participant.admin);
    if (!senderIsAdmin && !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Hanya admin grup atau owner yang dapat menggunakan unmute.' }, { quoted: msg });
    }
    if (!mentioned || mentioned.length === 0) return sock.sendMessage(from, { text: 'Tag user!' }, { quoted: msg });
    const mentionedTarget = mentioned[0];
    const targetParticipant = (group.participants || []).find(participant =>
      participant.id.split(':')[0] === mentionedTarget.split(':')[0]);
    const target = targetParticipant?.id || mentionedTarget;
    if (spamTracker[target]) {
      spamTracker[target].manualMutedUntil = 0;
      spamTracker[target].manualMuteNotifiedAt = 0;
      spamTracker[target].mutedUntil = 0;
      spamTracker[target].count = 0;
      spamTracker[target].warned = 0;
    }
    await sock.sendMessage(from, { text: `🔊 @${target.split('@')[0]} telah di-unmute!`, mentions: [target] }, { quoted: msg });
  }
};