const config = require('../../config');

module.exports = {
  name: 'self',
  category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    let isOwner = false;
    try { isOwner = ctx.isSenderOwner && ctx.isSenderOwner(); } catch {}
    if (!isOwner) return;

    config.botMode = 'self';
    await sock.sendMessage(from, { text: '🏠 Mode *SELF* aktif. Bot hanya merespon owner.' });
  },
};