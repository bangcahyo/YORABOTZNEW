function parseDuration(value) {
  const match = String(value || '').match(/^([1-9]\d*)(s|m|h)$/i);
  if (!match) return null;
  const amount = Number(match[1]);
  const multiplier = { s: 1000, m: 60_000, h: 3_600_000 }[match[2].toLowerCase()];
  const duration = amount * multiplier;
  return duration >= 10_000 && duration <= 24 * 60 * 60 * 1000 ? duration : null;
}

function normalizeJid(jid) {
  return String(jid || '').split(':')[0];
}

module.exports = {
  name: 'mute',
  category: 'group',
  async execute(sock, msg, args, ctx) {
    const { from, sender, mentioned, isGroup, isSenderOwner, spamTracker } = ctx;
    if (!isGroup(from)) {
      return sock.sendMessage(from, { text: '❌ Command ini hanya bisa digunakan di grup.' }, { quoted: msg });
    }

    const group = await sock.groupMetadata(from);
    const participants = group.participants || [];
    const senderIsAdmin = participants.some(participant => normalizeJid(participant.id) === normalizeJid(sender) && participant.admin);
    if (!senderIsAdmin && !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Hanya admin grup atau owner yang dapat menggunakan mute.' }, { quoted: msg });
    }

    const botJid = sock.user?.id;
    const botIsAdmin = participants.some(participant => normalizeJid(participant.id) === normalizeJid(botJid) && participant.admin);
    if (!botIsAdmin) {
      return sock.sendMessage(from, { text: '❌ Bot harus menjadi admin grup agar dapat menghapus pesan user yang dimute.' }, { quoted: msg });
    }

    const mentionedTarget = mentioned?.[0];
    if (!mentionedTarget) {
      return sock.sendMessage(from, { text: 'Format: `.mute @user <durasi>` (contoh: `.mute @user 10m`, maksimal 24 jam).' }, { quoted: msg });
    }
    const targetParticipant = participants.find(participant => normalizeJid(participant.id) === normalizeJid(mentionedTarget));
    if (!targetParticipant) {
      return sock.sendMessage(from, { text: '❌ User tersebut bukan anggota grup ini.' }, { quoted: msg });
    }
    const target = targetParticipant.id;
    if (targetParticipant.admin) {
      return sock.sendMessage(from, { text: '❌ Admin grup tidak dapat dimute dengan command ini.' }, { quoted: msg });
    }

    const duration = parseDuration(args[0]);
    if (!duration) {
      return sock.sendMessage(from, { text: '❌ Durasi tidak valid. Gunakan 10s, 10m, atau 2h (10 detik–24 jam).' }, { quoted: msg });
    }

    const state = spamTracker[target] || { count: 0, firstMsg: Date.now(), warned: 0, mutedUntil: 0, notified: 0 };
    state.manualMutedUntil = Date.now() + duration;
    state.manualMuteNotifiedAt = 0;
    spamTracker[target] = state;
    const durationLabel = duration % 3_600_000 === 0
      ? `${duration / 3_600_000} jam`
      : duration % 60_000 === 0
        ? `${duration / 60_000} menit`
        : `${duration / 1000} detik`;

    await sock.sendMessage(from, {
      text: `🔇 @${target.split('@')[0]} dimute selama ${durationLabel}. Pesannya akan dihapus bot sampai durasinya habis.`,
      mentions: [target],
    }, { quoted: msg });
  },
};