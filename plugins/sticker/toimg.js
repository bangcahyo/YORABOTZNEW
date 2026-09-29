module.exports = {
  name: 'toimg',
  category: 'sticker',
  aliases: ['toimage'],
  async execute(sock, msg, args, ctx) {
    const { from, downloadMediaMessage } = ctx;
    const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    const type = Object.keys(msg.message)[0];

    let stickerMsg = null;
    if (quoted && quoted.stickerMessage) stickerMsg = quoted.stickerMessage;
    else if (type === 'stickerMessage') stickerMsg = msg.message.stickerMessage;

    if (!stickerMsg) return sock.sendMessage(from, { text: '❌ Reply sticker dengan `.toimg`' });

    await sock.sendMessage(from, { text: '⏳ Convert...' });

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

      await sock.sendMessage(from, { image: stream, caption: '✅ Converted!' });
    } catch (e) {
      console.error('Toimg error:', e.message);
      await sock.sendMessage(from, { text: `❌ Gagal: ${e.message}` });
    }
  },
};