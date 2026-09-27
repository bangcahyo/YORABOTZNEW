const { readConfigKey, updateConfigKey, reloadConfig } = require('../../lib/config-editor');
module.exports = {
  name: 'toggle', category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner } = ctx;
    if (!isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya owner!' }, { quoted: msg });
    const key = args[0];
    if (!key) return sock.sendMessage(from, { text: `Format: ${config.prefix}toggle <key>` }, { quoted: msg });
    const currentVal = readConfigKey(key);
    if (currentVal === null) return sock.sendMessage(from, { text: `Key ${key} tidak ditemukan!` }, { quoted: msg });
    let newVal;
    if (currentVal === 'true') newVal = 'false';
    else if (currentVal === 'false') newVal = 'true';
    else if (currentVal === 'public') newVal = 'self';
    else if (currentVal === 'self') newVal = 'public';
    else if (currentVal === 'both') newVal = 'text';
    else if (currentVal === 'text') newVal = 'both';
    else return sock.sendMessage(from, { text: `Value "${currentVal}" tidak bisa di-toggle.` }, { quoted: msg });
    const result = updateConfigKey(key, newVal);
    if (!result.success) return sock.sendMessage(from, { text: `Gagal: ${result.error}` }, { quoted: msg });
    reloadConfig();
    await sock.sendMessage(from, { text: `🔄 Toggle berhasil!\n\n${key}: ${currentVal} → ${newVal}\n\nConfig otomatis di-reload.` }, { quoted: msg });
  }
};