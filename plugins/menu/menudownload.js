const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menudownload',
  category: 'menu',
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'UNDUH MEDIA',
      prefix: config.prefix,
      sections: [{ icon: '📥', title: 'VIDEO & AUDIO', items: [
        `${config.prefix}youtube <tautan>`,
        `${config.prefix}ytmp3 <tautan>`,
        `${config.prefix}tiktok <tautan>`,
        `${config.prefix}instagram <tautan>`,
      ] }],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};