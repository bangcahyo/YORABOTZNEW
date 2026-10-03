const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menutools',
  category: 'menu',
  aliases: ['menutool'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'AI & UTILITAS',
      prefix: config.prefix,
      sections: [
        { icon: '🧰', title: 'KATEGORI ALAT', items: [
          `${config.prefix}menuinfo — informasi dan pencarian`,
          `${config.prefix}menuai — asisten AI dan bahasa`,
          `${config.prefix}menuutilitas — alat bantu harian`,
        ] },
      ],
      footer: ['Pilih kategori untuk melihat command terkait.'],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};
