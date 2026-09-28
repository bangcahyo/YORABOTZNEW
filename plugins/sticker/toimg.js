module.exports = {
  name: 'toimg', category: 'sticker', aliases: ['toimage'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    const type = Object.keys(msg.message)[0];
    let stickerMsg = null;
    if (quoted && quoted.stickerMessage) stickerMsg = quoted.stickerMessage;
    else if (type === 'stickerMessage') stickerMsg = msg.message.stickerMessage;
    if (!stickerMsg) return sock.sendMessage(from, { text: '❌ Reply sticker dengan `.toimg`' }, { quoted: msg });
    try {
      const stream = await sock.downloadMediaMessage({
        key: quoted ? { remoteJid: from, id: msg.message.extendedTextMessage.contextInfo.stanzaId, fromMe: false } : msg.key,
        message: quoted ? { stickerMessage: stickerMsg } : msg.message,
      });
      await sock.sendMessage(from, { image: stream, caption: '✅ Converted!' }, { quoted: msg });
    } catch (e) { await sock.sendMessage(from, { text: `❌ Gagal: ${e.message}` }, { quoted: msg }); }
  }
};