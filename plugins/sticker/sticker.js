const { Sticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = {
  name: 'sticker',
  category: 'sticker',
  aliases: ['stiker', 's'],
  async execute(sock, msg, args, ctx) {
    const { from, config, downloadMediaMessage } = ctx;
    const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    const type = Object.keys(msg.message)[0];

    let mediaMsg = null;
    if (quoted) {
      if (quoted.imageMessage) mediaMsg = quoted.imageMessage;
      else if (quoted.videoMessage) mediaMsg = quoted.videoMessage;
    } else if (type === 'imageMessage') mediaMsg = msg.message.imageMessage;
    else if (type === 'videoMessage') mediaMsg = msg.message.videoMessage;

    if (!mediaMsg) {
      return sock.sendMessage(from, { text: '❌ Kirim/reply gambar atau video dengan caption `.sticker`' });
    }

    await sock.sendMessage(from, { text: '⏳ Membuat sticker...' });

    try {
      const fullMsg = quoted ? {
        key: {
          remoteJid: from,
          id: msg.message.extendedTextMessage.contextInfo.stanzaId,
          fromMe: false,
        },
        message: quoted,
      } : msg;

      const stream = await downloadMediaMessage(fullMsg, 'buffer', {}, { logger: console });

      if (!stream) return sock.sendMessage(from, { text: '❌ Gagal download media.' });

      const sticker = new Sticker(stream, {
        pack: config.botName || 'Yora Botz',
        author: config.ownerName || 'Cahyo Store',
        type: StickerTypes.FULL,
        quality: 70,
      });

      const buffer = await sticker.toBuffer();
      await sock.sendMessage(from, { sticker: buffer });
    } catch (e) {
      console.error('Sticker error:', e.message);
      await sock.sendMessage(from, { text: `❌ Gagal buat sticker: ${e.message}` });
    }
  },
};