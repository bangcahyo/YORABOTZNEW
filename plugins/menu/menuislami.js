const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menuislami',
  category: 'menu',
  aliases: ['menuislam'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'ISLAMI',
      prefix: config.prefix,
      sections: [
        { icon: '📖', title: 'KUIS AL-QURAN', items: [`${config.prefix}tebaksurah — tebak nama surah dari petunjuk`] },
        { icon: '💬', title: 'CARA BERMAIN', items: ['Kirim jawaban langsung di chat tanpa prefix.', 'Ketik *nyerah* untuk melewati soal.'] },
      ],
      footer: ['Kuis Islami yang tersedia saat ini: tebak surah.'],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};