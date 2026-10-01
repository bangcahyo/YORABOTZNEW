module.exports = {
  name: 'listpremium',
  category: 'owner',
  aliases: ['premiumlist', 'listprem'],
  async execute(sock, msg, args, ctx) {
    const { config, from, listPremium, isSenderOwner } = ctx;
    if (!isSenderOwner()) return;

    const list = listPremium();
    let txt = '╔══════════════════════════════════╗\n';
    txt += '║     🅟 *DAFTAR USER PREMIUM*     ║\n';
    txt += '╚══════════════════════════════════╝\n\n';

    if (!list.length) {
      txt += '📭 Belum ada user premium aktif.\n\n';
    } else {
      txt += '📊 Total: *' + list.length + ' user*\n\n';
      list.forEach(function(u, i) {
        txt += (i + 1) + '. 👤 *' + u.name + '*\n';
        txt += '   📞 +' + u.jid.split('@')[0] + '\n';
        txt += '   ⏳ Sisa: *' + u.days + ' hari*\n\n';
      });
    }
    txt += '━━━━━━━━━━━━━━━━━━━━━━\n_' + config.botName + '_';
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
