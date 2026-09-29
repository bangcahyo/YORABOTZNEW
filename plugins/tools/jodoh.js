module.exports = {
  name: 'jodoh',
  category: 'tools',
  aliases: ['cek jodoh', 'love'],
  async execute(sock, msg, args, ctx) {
    const { from, mentioned } = ctx;

    if (!mentioned || mentioned.length === 0) {
      return sock.sendMessage(from, { text: '❌ Tag user!\nContoh: `.jodoh @user`' });
    }

    const target = mentioned[0];
    const targetName = target.split('@')[0];
    const persen = Math.floor(Math.random() * 101);

    let status = '';
    if (persen >= 90) status = '💞 *JODOH SEJATI!*';
    else if (persen >= 70) status = '❤️ *Sangat cocok!*';
    else if (persen >= 50) status = '💛 *Cocok!*';
    else if (persen >= 30) status = '🤔 *Lumayan...*';
    else status = '💔 *Kurang cocok*';

    await sock.sendMessage(from, {
      text: `💑 *CEK JODOH*\n\n📊 Tingkat kecocokan:\n*${persen}%*\n\n${status}`,
      mentions: [target],
    });
  },
};