const config = require('../../config');

module.exports = {
  name: 'public',
  category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    let isOwner = false;
    try { isOwner = ctx.isSenderOwner && ctx.isSenderOwner(); } catch {}
    if (!isOwner) return;

    config.botMode = 'public';
    await sock.sendMessage(from, { text: '🌐 Mode *PUBLIC* aktif. Bot merespon semua orang.' });
  },
};