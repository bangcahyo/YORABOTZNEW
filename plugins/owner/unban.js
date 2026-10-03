const { getBannedUser } = require('../../lib/user-ban');

function resolveTarget(args, mentioned) {
  if (mentioned?.[0]) return mentioned[0];
  const digits = String(args[0] || '').replace(/[^0-9]/g, '');
  if (digits.length < 8 || digits.length > 15) return null;
  return `${digits}@s.whatsapp.net`;
}

module.exports = {
  name: 'unban',
  category: 'owner',
  aliases: ['unblock'],
  async execute(sock, msg, args, ctx) {
    const { from, config, mentioned, updateUser, loadDB, isSenderOwner } = ctx;
    if (!isSenderOwner || !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Perintah ini khusus untuk owner.' }, { quoted: msg });
    }

    const target = resolveTarget(args, mentioned);
    if (!target) {
      return sock.sendMessage(from, {
        text: `Format: ${config.prefix}unban @user\natau: ${config.prefix}unban <nomor>`,
      }, { quoted: msg });
    }
    const bannedUser = getBannedUser(loadDB(), [target]);
    if (!bannedUser) {
      return sock.sendMessage(from, { text: 'ℹ️ User tersebut tidak sedang diblokir.' }, { quoted: msg });
    }

    updateUser(bannedUser.id, {
      banned: false,
      bannedAt: null,
      bannedBy: null,
      banReason: null,
    });
    const digits = bannedUser.id.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
    await sock.sendMessage(from, {
      text: `✅ User @${digits} sudah di-unban dan dapat memakai bot lagi.`,
      mentions: [bannedUser.id],
    }, { quoted: msg });
  },
};

module.exports.resolveTarget = resolveTarget;