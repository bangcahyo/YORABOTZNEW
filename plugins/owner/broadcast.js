module.exports = {
  name: 'broadcast',
  category: 'owner',
  aliases: ['bc'],
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner, loadGroups } = ctx;

    let isOwner = false;
    try { isOwner = isSenderOwner && isSenderOwner(); } catch {}
    if (!isOwner) return;

    const pesan = args.join(' ');
    if (!pesan) {
      return sock.sendMessage(from, { text: '❌ Format: `.broadcast <pesan>`' });
    }

    const allGroups = Object.keys(loadGroups());
    let sukses = 0;

    for (const g of allGroups) {
      try {
        await sock.sendMessage(g, { text: `📢 *BROADCAST*\n\n${pesan}` });
        sukses++;
        await new Promise(r => setTimeout(r, 2000));
      } catch {}
    }

    await sock.sendMessage(from, { text: `✅ Broadcast ke ${sukses} grup.` });
  },
};