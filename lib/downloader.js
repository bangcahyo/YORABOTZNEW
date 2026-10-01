// ============================================================
//  DOWNLOADER TANPA API KEY
//  - TikTok    : tikwm.com (publik, tanpa key)  → cadangan yt-dlp
//  - YouTube   : @distube/ytdl-core (library JS) → cadangan yt-dlp
//  - Instagram : halaman embed publik            → cadangan yt-dlp
//
//  yt-dlp OPSIONAL. Kalau terpasang di server (perintah `yt-dlp`
//  atau path di env YTDLP_PATH) otomatis dipakai sebagai cadangan.
//
//  Hasil berupa { buffer } atau { url }. Pakai toMedia(x) untuk
//  dikirim lewat sock.sendMessage.
// ============================================================

// matikan cek-update ytdl-core (hanya bikin log berisik / error 403)
process.env.YTDL_NO_UPDATE = process.env.YTDL_NO_UPDATE || '1';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const MAX_BYTES = 60 * 1024 * 1024;   // batas ukuran file yang dikirim ke WhatsApp
const MAX_YT_SECONDS = 15 * 60;       // batas durasi YouTube (15 menit)

// ───────────────────────── util dasar ─────────────────────────

function toMedia(item) {
  if (!item) return null;
  return item.buffer ? item.buffer : { url: item.url };
}

function userError(msg) {
  const e = new Error(msg);
  e.userFacing = true;   // pesan ini aman ditampilkan langsung ke user
  return e;
}

async function fetchJson(url, options = {}, timeout = 20000) {
  const res = await fetch(url, {
    ...options,
    headers: { 'User-Agent': UA, ...(options.headers || {}) },
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchText(url, options = {}, timeout = 20000) {
  const res = await fetch(url, {
    ...options,
    headers: { 'User-Agent': UA, ...(options.headers || {}) },
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function fetchBuffer(url, { headers = {}, maxBytes = MAX_BYTES, timeout = 90000 } = {}) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, ...headers },
    redirect: 'follow',
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const len = Number(res.headers.get('content-length') || 0);
  if (len > maxBytes) throw userError('File terlalu besar untuk dikirim lewat WhatsApp.');

  const chunks = [];
  let size = 0;
  for await (const chunk of res.body) {
    size += chunk.length;
    if (size > maxBytes) throw userError('File terlalu besar untuk dikirim lewat WhatsApp.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function streamToBuffer(stream, maxBytes = MAX_BYTES) {
  const chunks = [];
  let size = 0;
  for await (const chunk of stream) {
    size += chunk.length;
    if (size > maxBytes) {
      if (typeof stream.destroy === 'function') stream.destroy();
      throw userError('File terlalu besar untuk dikirim lewat WhatsApp.');
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// Unduh ke buffer; kalau gagal, kembalikan { url } supaya Baileys yang mengunduh.
async function materialize(url, headers) {
  try {
    return { buffer: await fetchBuffer(url, { headers }), url };
  } catch (e) {
    if (e.userFacing) throw e;
    return { url };
  }
}

// ───────────────────────── yt-dlp (opsional) ─────────────────────────

const YTDLP_BIN = process.env.YTDLP_PATH || 'yt-dlp';
let ytDlpAvailable = null;

function run(cmd, args, timeout) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { timeout, maxBuffer: 20 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) {
        const last = (stderr || err.message || '').toString().trim().split('\n').pop();
        return reject(new Error(last || 'perintah gagal'));
      }
      resolve(stdout.toString());
    });
  });
}

async function hasYtDlp() {
  if (ytDlpAvailable !== null) return ytDlpAvailable;
  try {
    await run(YTDLP_BIN, ['--version'], 8000);
    ytDlpAvailable = true;
  } catch {
    ytDlpAvailable = false;
  }
  return ytDlpAvailable;
}

// Unduh media lewat yt-dlp. kind: 'video' | 'audio'
async function viaYtDlp(url, kind = 'video') {
  if (!(await hasYtDlp())) throw new Error('yt-dlp tidak terpasang');

  const tmp = os.tmpdir();
  const prefix = `yora-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const format = kind === 'audio'
    ? 'ba[ext=m4a]/ba[acodec^=mp4a]'
    : 'b[ext=mp4][height<=720]/b[ext=mp4]/b[height<=720]/b';

  const args = [
    '--no-playlist', '--no-warnings', '--no-progress',
    '--max-filesize', `${Math.floor(MAX_BYTES / 1024 / 1024)}M`,
    '-f', format,
    '-o', path.join(tmp, `${prefix}.%(ext)s`),
    '--print', 'title', '--no-simulate',
    url,
  ];

  const cleanup = () => {
    try {
      for (const f of fs.readdirSync(tmp)) {
        if (f.startsWith(prefix)) { try { fs.unlinkSync(path.join(tmp, f)); } catch {} }
      }
    } catch {}
  };

  try {
    const out = await run(YTDLP_BIN, args, 180000);
    const title = out.trim().split('\n')[0] || 'Media';
    const file = fs.readdirSync(tmp).find(f => f.startsWith(prefix));
    if (!file) throw new Error('file hasil yt-dlp tidak ditemukan');
    const buffer = fs.readFileSync(path.join(tmp, file));
    if (buffer.length > MAX_BYTES) throw userError('File terlalu besar untuk dikirim lewat WhatsApp.');
    return { buffer, title, mimetype: kind === 'audio' ? 'audio/mp4' : 'video/mp4' };
  } finally {
    cleanup();
  }
}

// Jalankan beberapa strategi berurutan; berhenti di yang pertama berhasil.
async function tryChain(label, steps) {
  const errors = [];
  for (const [name, fn] of steps) {
    try {
      return await fn();
    } catch (e) {
      if (e.userFacing) throw e;           // pesan sudah ramah → langsung tampilkan
      errors.push(`${name}: ${e.message}`);
    }
  }
  console.error(`[${label}] semua metode gagal → ${errors.join(' | ')}`);
  return null;
}

// ───────────────────────── YouTube ─────────────────────────

async function ytViaYtdl(url, type) {
  const ytdl = require('@distube/ytdl-core');
  const info = await ytdl.getInfo(url);
  const d = info.videoDetails;

  if (Number(d.lengthSeconds) > MAX_YT_SECONDS) {
    throw userError(`Durasi video terlalu panjang (maks ${MAX_YT_SECONDS / 60} menit).`);
  }
  if (d.isLiveContent && Number(d.lengthSeconds) === 0) throw userError('Video live tidak bisa diunduh.');

  let format;
  if (type === 'mp3') {
    // audio m4a bisa langsung diputar WhatsApp tanpa ffmpeg
    const audios = info.formats.filter(f => f.hasAudio && !f.hasVideo && f.container === 'mp4');
    if (!audios.length) throw new Error('format audio m4a tidak tersedia');
    format = audios.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];
  } else {
    // video + audio sudah menyatu (progressive), maks 720p
    const vids = info.formats
      .filter(f => f.hasVideo && f.hasAudio && f.container === 'mp4' && (f.height || 0) <= 720)
      .sort((a, b) => (b.height || 0) - (a.height || 0));
    if (!vids.length) throw new Error('format video mp4 tidak tersedia');
    format = vids[0];
  }

  const stream = ytdl.downloadFromInfo(info, { format, highWaterMark: 1 << 25 });
  const buffer = await streamToBuffer(stream);
  return { buffer, title: d.title, mimetype: type === 'mp3' ? 'audio/mp4' : 'video/mp4' };
}

async function downloadYT(url, type = 'mp4') {
  const kind = type === 'mp3' ? 'mp3' : 'mp4';
  const result = await tryChain('YT', [
    ['ytdl-core', () => ytViaYtdl(url, kind)],
    ['yt-dlp', () => viaYtDlp(url, kind === 'mp3' ? 'audio' : 'video')],
  ]);
  if (!result) throw new Error('Gagal download YouTube. Coba link lain atau ulangi sebentar lagi.');
  return result;
}

// ───────────────────────── TikTok ─────────────────────────

async function ttViaTikwm(url) {
  let json;
  try {
    json = await fetchJson('https://www.tikwm.com/api/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: new URLSearchParams({ url, hd: '1' }).toString(),
    });
  } catch {
    json = await fetchJson(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
  }
  if (!json || json.code !== 0 || !json.data) throw new Error(json?.msg || 'respon tikwm tidak valid');

  const d = json.data;
  const abs = u => (u && u.startsWith('/') ? `https://www.tikwm.com${u}` : u);
  const title = d.title || 'TikTok';

  // Postingan slideshow (foto)
  if (Array.isArray(d.images) && d.images.length) {
    return { images: d.images.map(abs).filter(Boolean), title };
  }

  const videoUrl = abs(d.hdplay || d.play);
  if (!videoUrl) throw new Error('link video tidak ditemukan');
  return { ...(await materialize(videoUrl)), title };
}

async function downloadTT(url) {
  const result = await tryChain('TT', [
    ['tikwm', () => ttViaTikwm(url)],
    ['yt-dlp', () => viaYtDlp(url, 'video')],
  ]);
  if (!result) throw new Error('Gagal download TikTok. Pastikan video publik lalu coba lagi.');
  return result;
}

// ───────────────────────── Instagram ─────────────────────────

function unescapeJsonString(s) {
  try { return JSON.parse(`"${s}"`); } catch { return s.replace(/\\\//g, '/').replace(/\\u0026/g, '&'); }
}

async function igViaEmbed(url) {
  const m = url.match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
  if (!m) throw userError('Link Instagram tidak valid. Gunakan link post atau reel.');

  const html = await fetchText(`https://www.instagram.com/p/${m[2]}/embed/captioned/`, {
    headers: { 'Accept-Language': 'en-US,en;q=0.9' },
  });

  const items = [];
  const v = html.match(/"video_url"\s*:\s*"([^"]+)"/);
  if (v) {
    items.push({ type: 'video', ...(await materialize(unescapeJsonString(v[1]))) });
  } else {
    const img = html.match(/<img[^>]+class="[^"]*EmbeddedMediaImage[^"]*"[^>]+src="([^"]+)"/i)
      || html.match(/<img[^>]+src="([^"]+)"[^>]+class="[^"]*EmbeddedMediaImage[^"]*"/i);
    if (img) items.push({ type: 'image', ...(await materialize(img[1].replace(/&amp;/g, '&'))) });
  }

  if (!items.length) throw new Error('media tidak ditemukan di halaman embed');
  return { items };
}

async function igViaYtDlp(url) {
  const r = await viaYtDlp(url, 'video');
  return { items: [{ type: 'video', buffer: r.buffer }] };
}

async function downloadIG(url) {
  const result = await tryChain('IG', [
    ['embed', () => igViaEmbed(url)],
    ['yt-dlp', () => igViaYtDlp(url)],
  ]);
  if (!result) {
    throw new Error('Gagal download Instagram. Pastikan postingan publik (story & akun private tidak didukung).');
  }
  return result;
}

module.exports = { downloadYT, downloadTT, downloadIG, toMedia };
