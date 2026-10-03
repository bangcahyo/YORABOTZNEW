module.exports = {
  name: 'sc',
  category: 'info',
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const text = `╔══════════════════════════════════════╗
║          📜  *SCRIPT BOT*  📜
╚══════════════════════════════════════╝

  ◆  👤  Author : *${config.ownerName}*
  ◆  🤖  Bot    : *${config.botName}*

Script ini bersifat pribadi, dibuat dan dimiliki oleh *${config.ownerName}*.
Dilarang menjual, me-rename, mengubah seluruh isi, atau menyalin script tanpa izin author.
Pelanggaran dapat dikenai sanksi/denda sebesar *Rp1.000.000*.
Jangan hapus credit dan hargai karya pembuatnya.\n`;

    await sock.sendMessage(from, { text });
  },
};