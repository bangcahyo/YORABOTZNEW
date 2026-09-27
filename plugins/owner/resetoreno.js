module.exports = {
  name: 'restoreno', category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner } = ctx;
    if (!isSenderOwner()) return;
    if (global.pendingRestore?.[from]) delete global.pendingRestore[from];
    await sock.sendMessage(from, { text: 'Restore dibatalkan.' }, { quoted: msg });
  }
};