function resolveTarget(args, mentioned) {
  if (mentioned?.[0]) return { id: mentioned[0], reason: args.slice(1).join(' ').trim() };
  const digits = String(args[0] || '').replace(/[^0-9]/g, '');
  if (digits.length < 8 || digits.length > 15) return null;
  return { id: `${digits}@s.whatsapp.net`, reason: args.slice(1).join(' ').trim() };
}

module.exports = {
  name: 'ban',
  category: 'owner',
  aliases: ['block'],
  async execute(sock, msg, args, ctx) {
    const { from, config, mentioned, updateUser, isSenderOwner } = ctx;
    if (!isSenderOwner || !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Perintah ini khusus untuk owner.' }, { quoted: msg });
    }

    const target = resolveTarget(args, mentioned);
    if (!target) {
      return sock.sendMessage(from, {
        text: `Format: ${config.prefix}ban @user <alasan>\natau: ${config.prefix}ban <nomor> <alasan>`,
      }, { quoted: msg });
    }
    const targetDigits = target.id.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
    const ownerDigits = String(config.ownerNumber || '').replace(/[^0-9]/g, '');
    const ownerLidDigits = String(config.ownerLID || '').replace(/[^0-9]/g, '');
    if (targetDigits === ownerDigits || targetDigits === ownerLidDigits) {
      return sock.sendMessage(from, { text: '❌ Akun owner tidak bisa diblokir.' }, { quoted: msg });
    }

    const reason = (target.reason || 'Tidak mematuhi aturan bot.').slice(0, 120);
    updateUser(target.id, {
      banned: true,
      bannedAt: Date.now(),
      bannedBy: ctx.sender,
      banReason: reason,
    });
    await sock.sendMessage(from, {
      text: `🚫 User @${targetDigits} diblokir dari penggunaan bot.\nAlasan: ${reason}\n\nUntuk banding/unban, hubungi owner: https://wa.me/${ownerDigits}`,
      mentions: [target.id],
    }, { quoted: msg });
  },
};

module.exports.resolveTarget = resolveTarget;