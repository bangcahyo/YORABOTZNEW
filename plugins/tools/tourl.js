const FormData = require('form-data');

module.exports = {
  name: 'tourl',
  category: 'tools',
  aliases: ['upload', 'url'],
  async execute(sock, msg, args, ctx) {
    const { from, downloadMediaMessage } = ctx;
    const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    const type = Object.keys(msg.message)[0];

    let mediaMsg = null;
    let mediaType = null;

    if (quoted) {
      if (quoted.imageMessage) { mediaMsg = quoted.imageMessage; mediaType = 'image'; }
      else if (quoted.videoMessage) { mediaMsg = quoted.videoMessage; mediaType = 'video'; }
      else if (quoted.audioMessage) { mediaMsg = quoted.audioMessage; mediaType = 'audio'; }
      else if (quoted.documentMessage) { mediaMsg = quoted.documentMessage; mediaType = 'document'; }
    } else if (type === 'imageMessage') { mediaMsg = msg.message.imageMessage; mediaType = 'image'; }
    else if (type === 'videoMessage') { mediaMsg = msg.message.videoMessage; mediaType = 'video'; }

    if (!mediaMsg) {
      return sock.sendMessage(from, { text: '❌ Reply gambar/video/audio dengan `.tourl`' });
    }

    await sock.sendMessage(from, { text: '⏳ Uploading...' });

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
      const buffer = Buffer.from(stream);
      const sizeMB = (buffer.length / (1024 * 1024)).toFixed(2);

      const form = new FormData();
      form.append('reqtype', 'fileupload');
      form.append('fileToUpload', buffer, {
        filename: mediaType === 'image' ? 'image.jpg' : 'file.mp4',
      });

      const res = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: form,
        headers: form.getHeaders(),
      });

      const url = await res.text();

      if (url && url.startsWith('http')) {
        await sock.sendMessage(from, {
          text: `✅ *UPLOAD BERHASIL!*\n\n📁 Tipe: ${mediaType}\n📏 Ukuran: ${sizeMB} MB\n🔗 Link:\n${url.trim()}`,
        });
      } else {
        await sock.sendMessage(from, { text: '❌ Upload gagal. Coba lagi.' });
      }
    } catch (e) {
      console.error('Tourl error:', e.message);
      await sock.sendMessage(from, { text: `❌ Error: ${e.message}` });
    }
  },
};