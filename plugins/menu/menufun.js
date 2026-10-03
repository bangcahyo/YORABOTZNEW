const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menufun',
  category: 'menu',
  aliases: ['menuhiburan'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'HIBURAN',
      prefix: config.prefix,
      sections: [
        { icon: '🌸', title: 'PUISI & PANTUN', items: [`${config.prefix}pantun`, `${config.prefix}puisi <tema>`] },
        { icon: '💬', title: 'MOTIVASI & KATA BIJAK', items: [`${config.prefix}quote`, `${config.prefix}motivasi`, `${config.prefix}katabijak`] },
        { icon: '🔮', title: 'RAMALAN & KECOCOKAN', items: [`${config.prefix}ramalan`, `${config.prefix}kapankahnikah`, `${config.prefix}zodiak <zodiak/tanggal>`, `${config.prefix}jodoh @user`, `${config.prefix}sifat <nama>`] },
        { icon: '💘', title: 'CINTA & GOMBALAN', items: [`${config.prefix}gombalan`, `${config.prefix}pickupline`, `${config.prefix}bucin`] },
        { icon: '😂', title: 'CERITA & HIBURAN', items: [`${config.prefix}ceritahumor`, `${config.prefix}ceritahoror`, `${config.prefix}faktaunik`] },
        { icon: '🎲', title: 'TRUTH OR DARE', items: [`${config.prefix}truth`, `${config.prefix}dare`] },
        { icon: '✨', title: 'SERBA-SERBI', items: [`${config.prefix}cekganteng [nama]`, `${config.prefix}cekcantik [nama]`, `${config.prefix}artinama <nama>`] },
      ],
      footer: ['Semua command hiburan gratis tanpa limit.'],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};
