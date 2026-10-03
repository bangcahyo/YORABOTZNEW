module.exports = {
  name: 'limit',
  category: 'ekonomi',
  aliases: ['limitku', 'ceklimit', 'mylimit'],
  async execute(sock, msg, args, ctx) {
    const { config, from, user, isPremium, premiumRemainingDays, getLimitCost } = ctx;

    const sub = (args[0] || '').toLowerCase();

    // .limit info -> daftar fitur berlimit 🅛
    if (sub === 'info' || sub === 'fitur' || sub === 'list') {
      const costs = config.limitCost || {};
      let txt = '╔══════════════════════════════════╗\n';
      txt += '║     🅛 *FITUR BERLIMIT*          ║\n';
      txt += '╚══════════════════════════════════╝\n\n';
      txt += 'Setiap command berlimit 🅛 akan memotong limit kamu.\n\n';
      const keys = Object.keys(costs).filter(function(k) { return k !== 'default' && costs[k] > 0; });
      if (!keys.length) {
        txt += '📭 Belum ada fitur berlimit.\n';
      } else {
        keys.forEach(function(k) {
          txt += '  🅛 *' + config.prefix + k + '* — ' + costs[k] + ' limit\n';
        });
      }
      txt += '\n━━━━━━━━━━━━━━━━━━━━━━\n';
      txt += '📌 Default command berlimit: *' + (costs.default || 1) + ' limit*\n';
      txt += '💎 Premium: command berlimit tidak memotong saldo selama Premium aktif.\n';
      txt += '📦 Saldo maksimum Premium: *' + (config.premium?.maxLimit || 9999) + '*\n\n';
      txt += '_' + config.botName + '_';
      return sock.sendMessage(from, { text: txt }, { quoted: msg });
    }

    // Info limit user
    const aktif = isPremium();
    let txt = '╔══════════════════════════════════╗\n';
    txt += '║        🅛 *LIMIT KAMU*           ║\n';
    txt += '╚══════════════════════════════════╝\n\n';
    txt += '👤 Nama  : *' + (user.name || ctx.pushName) + '\n';
    txt += '💳 Limit : *' + user.limit + '*\n';
    txt += '💎 Status: ' + (aktif ? '*PREMIUM* 🅟 (' + premiumRemainingDays() + ' hari)' : '*FREE USER*') + '\n\n';
    txt += '━━━━━━━━━━━━━━━━━━━━━━\n';
    txt += '🅛 Fitur berlimit memotong limit otomatis.\n';
    txt += '📝 Ketik *' + config.prefix + 'limit info* untuk lihat daftar.\n';
    txt += '🎁 Ketik *' + config.prefix + 'daily* untuk tambah limit gratis.\n\n';
    txt += '_' + config.botName + '_';
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  },
};
