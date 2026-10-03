const { reloadConfig } = require('../../lib/config-editor');
module.exports = {
  name: 'reloadcfg', category: 'owner', aliases: ['reloadconfig'],
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner } = ctx;
    if (!isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya owner!' }, { quoted: msg });
    const result = reloadConfig();
    if (result.success) {
      await sock.sendMessage(from, { text: '🔄 Config di-reload tanpa restart!' }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: `Gagal reload: ${result.error}` }, { quoted: msg });
    }
  }
};