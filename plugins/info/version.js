const pkg = require('../../package.json');

module.exports = {
  name: 'version',
  category: 'info',
  aliases: ['versi', 'botversion'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const text = `📦 *VERSION INFO*

  ◆  Bot       : *Yora Botz*
  ◆  Versi     : *${pkg.version}*
  ◆  Node.js   : *${process.version}*
  ◆  Platform  : *${process.platform}*
  ◆  Build     : *Stable release*

  _Update terbaru: utility tools + polish premium system_`;

    await sock.sendMessage(from, { text });
  },
};
