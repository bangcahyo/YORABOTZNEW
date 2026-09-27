const { readConfigKey, updateConfigKey } = require('../../lib/config-editor');
module.exports = {
  name: 'setcfg', category: 'owner', aliases: ['setconfig'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner } = ctx;
    if (!isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya owner!' }, { quoted: msg });
    const key = args[0];
    const value = args.slice(1).join(' ');
    if (!key || !value) {
      return sock.sendMessage(from, {
        text: `Format: *${config.prefix}setcfg <key> <value>*\n\nContoh:\n${config.prefix}setcfg ownerName Cahyo Store\n${config.prefix}setcfg prefix !`
      }, { quoted: msg });
    }
    const oldVal = readConfigKey(key);
    const result = updateConfigKey(key, value);
    if (!result.success) return sock.sendMessage(from, { text: `Gagal: ${result.error}` }, { quoted: msg });
    await sock.sendMessage(from, {
      text: `✅ Config diubah!\n\nKey: ${key}\nLama: ${oldVal}\nBaru: ${value}\n\nKetik *${config.prefix}reloadcfg* untuk aktifkan.`
    }, { quoted: msg });
  }
};