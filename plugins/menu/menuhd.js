const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menuhd',
  category: 'menu',
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'PENINGKATAN FOTO & VIDEO',
      prefix: config.prefix,
      sections: [{ icon: '✨', title: 'HD MEDIA', items: [
        `${config.prefix}hd (foto; upscale dan sharpen)`,
        `${config.prefix}hda (foto; AI maksimal 512×512)`,
        `${config.prefix}hdvideo (video; maksimal 60 detik)`,
      ] }],
      footer: ['Pemrosesan video memerlukan FFmpeg.'],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};