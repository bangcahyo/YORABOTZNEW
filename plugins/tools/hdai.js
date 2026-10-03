const sharp = require('sharp');
const { upscaleWithAi, validateAiDimensions } = require('../../lib/ai-upscaler');

const MAX_INPUT_BYTES = 20 * 1024 * 1024;
const MAX_INPUT_PIXELS = 40_000_000;
const MAX_OUTPUT_BYTES = 15 * 1024 * 1024;

module.exports = {
  name: 'hda',
  category: 'tools',
  aliases: ['hdai', 'aihd', 'superhd'],
  async execute(sock, msg, args, ctx) {
    const { from, downloadMediaMessage } = ctx;
    const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    const imageMessage = quoted?.imageMessage || msg.message.imageMessage;
    if (!imageMessage) {
      return sock.sendMessage(from, {
        text: 'Balas foto dengan `.hda` untuk AI super-resolution yang terpisah dari `.hd` biasa.',
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

      validateAiDimensions(metadata.width, metadata.height);

      const result = await upscaleWithAi(input);
      if (result.buffer.length > MAX_OUTPUT_BYTES) {
        return sock.sendMessage(from, { text: '❌ Hasil foto melebihi batas kirim 15 MB.' }, { quoted: msg });
      }

      await sock.sendMessage(from, {
        image: result.buffer,
        mimetype: 'image/jpeg',
        caption: `✅ AI super-resolution selesai: ${metadata.width}×${metadata.height} → ${result.width}×${result.height}.\n_Mode AI ini dipisah dari `.hd` biasa agar proses Sharp tetap aman dan stabil._`,
      }, { quoted: msg });
    } catch (error) {
      console.error('AI HD image processing error:', error.message);
      await sock.sendMessage(from, { text: `❌ Gagal memproses foto AI: ${error.message}` }, { quoted: msg });
    }
  },
};