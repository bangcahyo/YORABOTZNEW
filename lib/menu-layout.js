const { spawn } = require('node:child_process');
const voiceMessageCache = new Map();
const pendingVoiceMessages = new Map();
const MAX_CACHED_VOICE_MESSAGES = 4;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function styleMenuItem(item, prefix) {
  if (!prefix) return item;
  const commandPattern = new RegExp(`(^|\\s)(${escapeRegExp(prefix)}[a-z][a-z0-9_-]*)`, 'gi');
  return item.replace(commandPattern, (_match, boundary, command) => `${boundary}\`${command}\``);
}

function getVoiceMessageOptions(url) {
  const pathname = new URL(url).pathname.toLowerCase();
  if (/\.(ogg|opus|oga)$/.test(pathname)) {
    return { audio: { url }, mimetype: 'audio/ogg; codecs=opus', ptt: true };
  }
  if (/\.m4a$/.test(pathname)) {
    return { audio: { url }, mimetype: 'audio/mp4', ptt: false };
  }
  return { audio: { url }, mimetype: 'audio/mpeg', ptt: false };
}

function convertToVoiceNote(input) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-hide_banner',
      '-loglevel', 'error',
      '-i', 'pipe:0',
      '-vn',
      '-c:a', 'libopus',
      '-b:a', '64k',
      '-application', 'voip',
      '-f', 'ogg',
      'pipe:1',
    ], { stdio: ['pipe', 'pipe', 'pipe'] });
    const chunks = [];
    let outputBytes = 0;
    let errorOutput = '';
    let settled = false;
    const maxBytes = 10 * 1024 * 1024;
    const timeout = setTimeout(() => {
      ffmpeg.kill('SIGKILL');
      finish(new Error('Konversi audio voice menu melewati batas waktu 20 detik.'));
    }, 20000);

    function finish(error, result) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (error) reject(error);
      else resolve(result);
    }

    ffmpeg.stdout.on('data', chunk => {
      outputBytes += chunk.length;
      if (outputBytes > maxBytes) {
        ffmpeg.kill('SIGKILL');
        finish(new Error('Hasil konversi voice menu melebihi batas 10 MB.'));
        return;
      }
      chunks.push(chunk);
    });
    ffmpeg.stderr.on('data', chunk => {
      errorOutput = `${errorOutput}${chunk}`.slice(-4096);
    });
    ffmpeg.on('error', error => {
      finish(new Error(`FFmpeg tidak dapat dijalankan untuk membuat voice note: ${error.message}`));
    });
    ffmpeg.on('close', code => {
      if (settled) return;
      if (code !== 0) {
        finish(new Error(`FFmpeg gagal mengonversi audio menu${errorOutput.trim() ? `: ${errorOutput.trim()}` : '.'}`));
        return;
      }
      const audio = Buffer.concat(chunks);
      if (!audio.length) {
        finish(new Error('FFmpeg menghasilkan voice note kosong.'));
        return;
      }
      finish(null, audio);
    });
    ffmpeg.stdin.on('error', error => {
      if (error.code !== 'EPIPE') finish(new Error(`Gagal mengirim audio ke FFmpeg: ${error.message}`));
    });
    ffmpeg.stdin.end(input);
  });
}

async function loadVoiceMessage(url) {
  const parsedUrl = new URL(url);
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error('URL voice menu harus menggunakan HTTP atau HTTPS.');
  }

  const cacheKey = parsedUrl.href;
  if (voiceMessageCache.has(cacheKey)) return voiceMessageCache.get(cacheKey);
  if (pendingVoiceMessages.has(cacheKey)) return pendingVoiceMessages.get(cacheKey);

  const pendingMessage = fetchAndConvertVoiceMessage(parsedUrl);
  pendingVoiceMessages.set(cacheKey, pendingMessage);
  try {
    const message = await pendingMessage;
    voiceMessageCache.set(cacheKey, message);
    if (voiceMessageCache.size > MAX_CACHED_VOICE_MESSAGES) {
      voiceMessageCache.delete(voiceMessageCache.keys().next().value);
    }
    return message;
  } finally {
    pendingVoiceMessages.delete(cacheKey);
  }
}

async function fetchAndConvertVoiceMessage(parsedUrl) {
  const response = await fetch(parsedUrl, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Gagal mengambil audio voice menu (HTTP ${response.status}).`);

  const contentType = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (!contentType.startsWith('audio/')) {
    throw new Error(`URL voice menu tidak mengembalikan file audio (${contentType || 'tipe file tidak diketahui'}).`);
  }

  const declaredSize = Number(response.headers.get('content-length') || 0);
  const maxBytes = 10 * 1024 * 1024;
  if (declaredSize > maxBytes) throw new Error('File voice menu melebihi batas 10 MB.');

  const buffer = Buffer.from(await response.arrayBuffer());
  if (!buffer.length) throw new Error('File voice menu kosong.');
  if (buffer.length > maxBytes) throw new Error('File voice menu melebihi batas 10 MB.');

  const isOggOpus = buffer.subarray(0, 4).toString() === 'OggS'
    && buffer.includes(Buffer.from('OpusHead'));
  const audio = isOggOpus ? buffer : await convertToVoiceNote(buffer);
  return { audio, mimetype: 'audio/ogg; codecs=opus', ptt: true };
}

function renderMenu({ botName, title, sections, footer = [], prefix = '.' }) {
  const menuSections = sections;
  const lines = [
    '╭━━━━━━━━━━━━━━━━━━━━━━╮',
    `│  ✨ *${botName.toUpperCase()}* ✨`,
    `│  _${title}_`,
    '╰━━━━━━━━━━━━━━━━━━━━━━╯',
  ];

  for (const section of menuSections) {
    lines.push('', `╭─ ${section.icon || '▪️'} *${section.title}*`);
    section.items.forEach((item, index) => {
      const connector = index === section.items.length - 1 ? '└' : '├';
      lines.push(`│  ${connector} ${styleMenuItem(item, prefix)}`);
    });
    if (section.items.length) lines.push('╰──────────────────────');
  }

  if (footer.length) {
    lines.push('', '╭─ ✨ *KETERANGAN*');
    footer.forEach((item, index) => {
      const connector = index === footer.length - 1 ? '└' : '├';
      lines.push(`│  ${connector} ${item}`);
    });
    lines.push('╰──────────────────────');
  }

  lines.push('', `✦ _${botName} · Bot Resmi_ ✦`, '╰━━━━━━━━━━━━━━━━━━━━━━╯');
  return lines.join('\n');
}

function getVoiceMessageCacheStats() {
  let bytes = 0;
  for (const message of voiceMessageCache.values()) bytes += message.audio.length;
  return { entries: voiceMessageCache.size, bytes };
}

function clearVoiceMessageCache() {
  const stats = getVoiceMessageCacheStats();
  voiceMessageCache.clear();
  return stats;
}

module.exports = {
  getVoiceMessageOptions,
  loadVoiceMessage,
  renderMenu,
  getVoiceMessageCacheStats,
  clearVoiceMessageCache,
};
