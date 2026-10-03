const sharp = require('sharp');

const MAX_INPUT_BYTES = 20 * 1024 * 1024;
const MAX_INPUT_PIXELS = 40_000_000;
const MAX_OUTPUT_BYTES = 15 * 1024 * 1024;
const MAX_DIMENSION = 2560;

module.exports = {
  name: 'hd',
  category: 'tools',
  aliases: ['enhance'],
  async execute(sock, msg, args, ctx) {
    const { from, downloadMediaMessage } = ctx;
    const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMessage = quoted?.imageMessage || msg.message.imageMessage;
    if (!imageMessage) {
      return sock.sendMessage(from, {
        text: 'Balas foto dengan `.hd` untuk upscale dan mempertajam gambar.',
      }, { quoted: msg });
    }

    const fullMessage = quoted?.imageMessage ? {
      key: {
        remoteJid: from,
        id: msg.message.extendedTextMessage.contextInfo.stanzaId,
        fromMe: false,
      },
      message: quoted,
    } : msg;

    try {
      const input = await downloadMediaMessage(fullMessage, 'buffer', {}, { logger: console });
      if (!Buffer.isBuffer(input) || input.length === 0) {
        return sock.sendMessage(from, { text: '❌ Foto tidak dapat dibaca.' }, { quoted: msg });
      }
      if (input.length > MAX_INPUT_BYTES) {
        return sock.sendMessage(from, { text: '❌ Ukuran foto maksimal 20 MB.' }, { quoted: msg });
      }

      const image = sharp(input, { limitInputPixels: MAX_INPUT_PIXELS });
      const metadata = await image.metadata();
      if (!metadata.width || !metadata.height || !['jpeg', 'png', 'webp', 'tiff', 'gif'].includes(metadata.format)) {
        return sock.sendMessage(from, { text: '❌ Format foto tidak didukung.' }, { quoted: msg });
      }
      const scale = Math.min(2, MAX_DIMENSION / Math.max(metadata.width, metadata.height));
      const width = Math.max(1, Math.round(metadata.width * scale));
      const height = Math.max(1, Math.round(metadata.height * scale));
      const output = await image
        .rotate()
        .resize(width, height, { fit: 'inside' })
        .sharpen({ sigma: 1.1 })
        .flatten({ background: '#ffffff' })
        .jpeg({ quality: 92, mozjpeg: true })
        .toBuffer();

      if (output.length > MAX_OUTPUT_BYTES) {
        return sock.sendMessage(from, { text: '❌ Hasil foto melebihi batas kirim 15 MB.' }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        image: output,
        mimetype: 'image/jpeg',
        caption: `✅ Foto selesai diproses: ${metadata.width}×${metadata.height} → ${width}×${height}.\n_Upscale dan penajaman lokal; detail yang tidak ada di foto asli tidak dapat dipulihkan._`,
      }, { quoted: msg });
    } catch (error) {
      console.error('HD image processing error:', error.message);
      await sock.sendMessage(from, { text: `❌ Gagal memproses foto: ${error.message}` }, { quoted: msg });
    }
  },
};