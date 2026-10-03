const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menuqr',
  category: 'menu',
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'QR CODE',
      prefix: config.prefix,
      sections: [{ icon: '🔳', title: 'BUAT QR CODE', items: [`${config.prefix}qr <teks atau tautan>`] }],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};