const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menusticker',
  category: 'menu',
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'STIKER & GAMBAR',
      prefix: config.prefix,
      sections: [{ icon: '🎨', title: 'PEMBUATAN STIKER', items: [
        `${config.prefix}sticker (balas gambar/video)`,
        `${config.prefix}toimg (balas stiker)`,
        `🅟 ${config.prefix}emojimix 😀+🔥`,
      ] }],
      footer: ['🅟 = Fitur Premium'],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};