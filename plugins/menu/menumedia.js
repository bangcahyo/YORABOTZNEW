const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menumedia',
  category: 'menu',
  aliases: ['menudownloadmedia'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'MEDIA & KREASI',
      prefix: config.prefix,
      sections: [
        { icon: '📥', title: 'KATEGORI MEDIA', items: [
          `${config.prefix}menudownload — unduh video dan audio`,
          `${config.prefix}menusticker — stiker dan gambar`,
          `${config.prefix}menuhd — peningkatan foto dan video`,
          `${config.prefix}menuupload — unggah media`,
          `${config.prefix}menuqr — QR code`,
        ] },
      ],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};