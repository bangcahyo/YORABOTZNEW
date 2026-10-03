const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menuinfo',
  category: 'menu',
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'INFORMASI & PENCARIAN',
      prefix: config.prefix,
      sections: [{ icon: '📖', title: 'INFORMASI', items: [
        `${config.prefix}wiki <topik>`,
        `${config.prefix}cuaca <kota>`,
        `${config.prefix}jam`,
        `${config.prefix}statusbot`,
      ] }],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};