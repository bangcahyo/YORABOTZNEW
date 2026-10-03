const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menulevel',
  category: 'menu',
  async execute(sock, msg, args, ctx) {
    const { config, from, formatMoney, pluginList } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'LEVEL & PERINGKAT',
      prefix: config.prefix,
      pluginList,
      includeCategories: ['level'],
      sections: [
        { icon: '📊', title: 'COMMAND LEVEL', items: [`${config.prefix}level — lihat level dan EXP`, `${config.prefix}rank — lihat peringkatmu`, `${config.prefix}leaderboard — lihat daftar peringkat`] },
        {
          icon: '⚡',
          title: 'CARA MENDAPATKAN EXP',
          items: [
            'Kirim pesan di grup untuk memperoleh EXP.',
            `Maksimal +${config.levelSystem?.expPerMessage || 10} EXP per pesan.`,
            `Jeda perolehan EXP: ${Math.floor((config.levelSystem?.expCooldown || 30000) / 1000)} detik.`,
          ],
        },
        {
          icon: '🎁',
          title: 'HADIAH KENAIKAN LEVEL',
          items: [
            `Uang: +${formatMoney(config.levelSystem?.rewardPerLevelUp?.money || 500)}`,
            `Poin: +${config.levelSystem?.rewardPerLevelUp?.point || 5}`,
            `Limit: +${config.levelSystem?.rewardPerLevelUp?.limit || 1}`,
          ],
        },
      ],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};
