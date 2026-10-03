const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menuai',
  category: 'menu',
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'ASISTEN AI & BAHASA',
      prefix: config.prefix,
      sections: [
        { icon: '🧠', title: 'ASISTEN AI PREMIUM', items: [`${config.prefix}ai <pertanyaan>`, `${config.prefix}ask <pertanyaan>`] },
        { icon: '🌐', title: 'BAHASA', items: [`${config.prefix}translate <teks>`] },
      ],
      footer: ['🅟 = Fitur Premium'],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};