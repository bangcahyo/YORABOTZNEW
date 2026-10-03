const QRCode = require('qrcode');

module.exports = {
  name: 'qr',
  category: 'tools',
  aliases: ['qrcode'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const content = args.join(' ').trim();
    if (!content) {
      return sock.sendMessage(from, { text: 'Format: .qr <teks atau tautan>' }, { quoted: msg });
    }
    if (Buffer.byteLength(content, 'utf8') > 1800) {
      return sock.sendMessage(from, { text: 'Teks terlalu panjang. Maksimal 1.800 byte.' }, { quoted: msg });
    }

    try {
      const image = await QRCode.toBuffer(content, {
        type: 'png',
        width: 640,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
      await sock.sendMessage(from, {
        image,
        caption: '✅ QR berhasil dibuat secara lokal.',
      }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(from, { text: `❌ Gagal membuat QR: ${error.message}` }, { quoted: msg });
    }
  },
};