const { readConfigKey, listConfigKeys } = require('../../lib/config-editor');
module.exports = {
  name: 'getcfg', category: 'owner', aliases: ['getconfig'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner } = ctx;
    if (!isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya owner!' }, { quoted: msg });
    const key = args[0];
    if (!key) {
      return sock.sendMessage(from, {
        text: `📋 *DAFTAR KEY*\n\n${listConfigKeys().map(k => `• ${k}`).join('\n')}\n\nContoh: *${config.prefix}getcfg ownerName*`
      }, { quoted: msg });
    }
    const val = readConfigKey(key);
    if (val === null) return sock.sendMessage(from, { text: `❌ Key ${key} tidak ditemukan!` }, { quoted: msg });
    await sock.sendMessage(from, { text: `📋 *${key}*\n\n\`${val}\`` }, { quoted: msg });
  }
};