const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menuutilitas',
  category: 'menu',
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'UTILITAS',
      prefix: config.prefix,
      sections: [{ icon: '⚙️', title: 'ALAT BANTU', items: [
        `${config.prefix}bmi <berat> <tinggi>`,
        `${config.prefix}acakangka <minimum> <maksimum>`,
        `${config.prefix}reminder <5m> <pesan>`,
        `${config.prefix}cekpasangan <nama1> + <nama2>`,
      ] }],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};