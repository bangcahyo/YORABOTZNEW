module.exports = {
  name: 'broadcast', category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from, loadGroups, isSenderOwner } = ctx;
    if (!isSenderOwner()) return;
    const pesan = args.join(' ');
    if (!pesan) return sock.sendMessage(from, { text: 'Masukkan pesan!' });
    const allGroups = Object.keys(loadGroups());
    let sukses = 0;
    for (const g of allGroups) {
      try { await sock.sendMessage(g, { text: `📢 *BROADCAST*\n\n${pesan}` }); sukses++; await new Promise(r => setTimeout(r, 1000)); } catch {}
    }
    await sock.sendMessage(from, { text: `✅ Broadcast ke ${sukses} grup.` });
  }
};