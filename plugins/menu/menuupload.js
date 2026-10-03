const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menuupload',
  category: 'menu',
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'UNGGAH MEDIA',
      prefix: config.prefix,
      sections: [{ icon: '📤', title: 'TAUTAN MEDIA', items: [`🅟 ${config.prefix}tourl (balas media)`] }],
      footer: ['🅟 = Fitur Premium'],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};