const { spawn } = require('node:child_process');

const MAX_INPUT_BYTES = 20 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 15 * 1024 * 1024;
const MAX_DURATION_SECONDS = 60;
const PROCESS_TIMEOUT_MS = 45000;

function enhanceVideo(input) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-hide_banner',
      '-loglevel', 'error',
      '-i', 'pipe:0',
      '-map', '0:v:0',
      '-map', '0:a?',
      '-vf', "scale=w='min(1280,iw*2)':h='min(1280,ih*2)':force_original_aspect_ratio=decrease:force_divisible_by=2,unsharp=5:5:0.5:3:3:0",
      '-t', String(MAX_DURATION_SECONDS),
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '22',
      '-threads', '2',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', 'frag_keyframe+empty_moov',
      '-f', 'mp4',
      'pipe:1',
    ], { stdio: ['pipe', 'pipe', 'pipe'] });
    const chunks = [];
    let outputBytes = 0;
    let errorOutput = '';
    let settled = false;
    const timeout = setTimeout(() => {
      ffmpeg.kill('SIGKILL');
      finish(new Error('Proses video melewati batas waktu 45 detik.'));
    }, PROCESS_TIMEOUT_MS);

    function finish(error, result) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (error) reject(error);
      else resolve(result);
    }

    ffmpeg.stdout.on('data', chunk => {
      outputBytes += chunk.length;
      if (outputBytes > MAX_OUTPUT_BYTES) {
        ffmpeg.kill('SIGKILL');
        finish(new Error('Hasil video melebihi batas kirim 15 MB.'));
        return;
      }
      chunks.push(chunk);
    });
    ffmpeg.stderr.on('data', chunk => {
      errorOutput = `${errorOutput}${chunk}`.slice(-4096);
    });
    ffmpeg.on('error', error => {
      finish(new Error(`FFmpeg tidak dapat dijalankan: ${error.message}`));
    });
    ffmpeg.on('close', code => {
      if (settled) return;
      if (code !== 0) {
        finish(new Error(`FFmpeg gagal memproses video${errorOutput.trim() ? `: ${errorOutput.trim()}` : '.'}`));
        return;
      }
      const output = Buffer.concat(chunks);
      if (!output.length) {
        finish(new Error('FFmpeg menghasilkan video kosong.'));
        return;
      }
      finish(null, output);
    });
    ffmpeg.stdin.on('error', error => {
      if (error.code !== 'EPIPE') finish(new Error(`Gagal mengirim video ke FFmpeg: ${error.message}`));
    });
    ffmpeg.stdin.end(input);
  });
}

module.exports = {
  name: 'hdvideo',
  category: 'tools',
  aliases: ['videohd', 'hdvid'],
  async execute(sock, msg, args, ctx) {
    const { from, downloadMediaMessage } = ctx;
    const quoted = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    const videoMessage = quoted?.videoMessage || msg.message.videoMessage;
    if (!videoMessage) {
      return sock.sendMessage(from, {
        text: 'Balas video dengan `.hdvideo` untuk upscale dan penajaman lokal.',
      }, { quoted: msg });
    }
    if (videoMessage.seconds > MAX_DURATION_SECONDS) {
      return sock.sendMessage(from, { text: '❌ Durasi video maksimal 60 detik.' }, { quoted: msg });
    }

    const fullMessage = quoted?.videoMessage ? {
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
        return sock.sendMessage(from, { text: '❌ Video tidak dapat dibaca.' }, { quoted: msg });
      }
      if (input.length > MAX_INPUT_BYTES) {
        return sock.sendMessage(from, { text: '❌ Ukuran video maksimal 20 MB.' }, { quoted: msg });
      }

      const output = await enhanceVideo(input);
      await sock.sendMessage(from, {
        video: output,
        mimetype: 'video/mp4',
        caption: '✅ Video selesai diproses dan dikompres untuk kualitas HD.',
      }, { quoted: msg });
    } catch (error) {
      console.error('HD video processing error:', error.message);
      await sock.sendMessage(from, { text: `❌ Gagal memproses video: ${error.message}` }, { quoted: msg });
    }
  },
};