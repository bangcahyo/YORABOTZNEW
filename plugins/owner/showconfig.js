const { readConfigKey, listConfigKeys } = require('../../lib/config-editor');
module.exports = {
  name: 'showconfig', category: 'owner', aliases: ['showcfg'],
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner } = ctx;
    if (!isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya owner!' }, { quoted: msg });
    const importantKeys = ['botName', 'prefix', 'ownerName', 'ownerNumber', 'botNumber', 'website', 'botMode', 'antiSpam', 'sendMenuAs', 'sendOwnerAs'];
    let txt = '⚙️ *CONFIG AKTIF*\n\n';
    importantKeys.forEach(k => {
      const val = readConfigKey(k);
      if (val !== null) txt += `${k}: \`${val}\`\n`;
    });
    txt += `\n_Total: ${listConfigKeys().length} keys_`;
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  }
};