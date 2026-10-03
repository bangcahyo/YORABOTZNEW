const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menugame',
  category: 'menu',
  aliases: ['menugames'],
  async execute(sock, msg, args, ctx) {
    const { config, from, formatMoney, pluginList } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'PERMAINAN',
      prefix: config.prefix,
      pluginList,
      includeCategories: ['game'],
      sections: [
        {
          icon: '🎰',
          title: 'PERMAINAN TARUHAN',
          items: [
            `${config.prefix}slot <taruhan>`,
            `${config.prefix}dadu <taruhan>`,
            `${config.prefix}koin <taruhan>`,
            `${config.prefix}bj <taruhan>`,
            `${config.prefix}roulette <warna> <taruhan>`,
            `${config.prefix}sicbo <taruhan> <besar/kecil>`,
            `${config.prefix}suit <pilihan> <taruhan>`,
            `${config.prefix}war <taruhan>`,
            `${config.prefix}wheel <taruhan>`,
          ],
        },
        {
          icon: '🎯',
          title: 'TEBAK-TEBAKAN',
          items: [
            `${config.prefix}tebakangka`,
            `${config.prefix}quiz`,
            `${config.prefix}tebakkata`,
            `${config.prefix}tebakemoji`,
            `${config.prefix}math`,
            `${config.prefix}hangman`,
            `${config.prefix}tebakgambar`,
            `${config.prefix}tebakpemainbola`,
            `${config.prefix}tebaklagu`,
            `${config.prefix}tebakfilm`,
            `${config.prefix}tebakhewan`,
            `${config.prefix}tebakibukota`,
            `${config.prefix}tebakbendera`,
            `${config.prefix}tebaksurah`,
            `${config.prefix}tebakpresiden`,
            `${config.prefix}tebakplanet`,
            `${config.prefix}tebakanime`,
          ],
        },
        {
          icon: '🧠',
          title: 'ASAH OTAK & TEKA-TEKI',
          items: [
            `${config.prefix}asahotak`,
            `${config.prefix}siapakahaku`,
            `${config.prefix}caklontong`,
            `${config.prefix}lengkapikalimat`,
            `${config.prefix}family100`,
          ],
        },
        { icon: '🎮', title: 'PERMAINAN PAPAN', items: [`${config.prefix}ttt`] },
        {
          icon: '💡',
          title: 'CARA BERMAIN',
          items: [
            'Kirim jawaban langsung di chat.',
            'Ketik *nyerah* untuk melewati soal.',
            'Waktu menjawab setiap permainan: *60 detik*.',
            'Semua permainan gratis dan tidak memakai limit.',
            `Taruhan minimum: *${formatMoney(config.minBet)}* · maksimum: *${formatMoney(config.maxBet)}*`,
          ],
        },
      ],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};
