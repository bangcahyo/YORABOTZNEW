// ============================================================
//  AUTO BROADCAST WAKTU
//  - Pengaturan  : database/autobroadcast.json  (diubah lewat .ab)
//  - Status kirim: database/autobroadcast-state.json (tahan restart,
//                  jadi pesan tidak terkirim dobel saat bot restart)
// ============================================================

const fs = require('fs');
const path = require('path');
const config = require('../config');

const AB_PATH = path.join(__dirname, '..', 'database', 'autobroadcast.json');
const STATE_PATH = path.join(__dirname, '..', 'database', 'autobroadcast-state.json');

const TICK_MS = 30 * 1000;       // cek jadwal tiap 30 detik
const SEND_DELAY_MS = 2000;      // jeda antar target (hindari spam/limit WA)
const MAX_ATTEMPTS = 3;          // batas percobaan ulang jika semua target gagal

let timer = null;
let currentSock = null;          // selalu socket terbaru (aman saat reconnect)
let running = false;
const attempts = {};
const warned = {};

// ============ FILE HELPER ============
function readJSON(file, fallback) {
  try {
    if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) { /* file rusak → pakai default */ }
  return fallback;
}

function writeJSON(file, data) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);       // tulis atomik → file tidak pernah setengah jadi
}

// ============ SETTINGS ============
function defaults() {
  const c = config.autoBroadcast || {};
  return {
    enabled: c.enabled ?? true,
    timezone: c.timezone || 'Asia/Jakarta',
    targets: Array.isArray(c.targets) ? [...c.targets] : [],
    allGroups: !!c.allGroups,
  };
}

function loadAB() {
  const base = defaults();
  const d = readJSON(AB_PATH, {});
  return {
    enabled: d.enabled !== undefined ? !!d.enabled : base.enabled,
    timezone: d.timezone || base.timezone,
    targets: Array.isArray(d.targets) ? d.targets : base.targets,
    allGroups: d.allGroups !== undefined ? !!d.allGroups : base.allGroups,
  };
}

function saveAB(data) {
  writeJSON(AB_PATH, {
    enabled: !!data.enabled,
    timezone: data.timezone,
    targets: Array.isArray(data.targets) ? data.targets : [],
    allGroups: !!data.allGroups,
  });
}

// ============ STATE (sudah terkirim) ============
function loadState() {
  const s = readJSON(STATE_PATH, {});
  return { sent: s && typeof s.sent === 'object' && s.sent ? s.sent : {} };
}

function saveState(state, todayKey) {
  // buang catatan lama (> 3 hari) supaya file tidak membengkak
  const cutoff = new Date(todayKey + 'T00:00:00Z');
  cutoff.setUTCDate(cutoff.getUTCDate() - 3);
  const cutoffKey = cutoff.toISOString().slice(0, 10);
  for (const k of Object.keys(state.sent)) {
    if (k.slice(-10) < cutoffKey) delete state.sent[k];
  }
  writeJSON(STATE_PATH, state);
}

// ============ WAKTU ============
function getTimeInTimezone(timezone = 'Asia/Jakarta') {
  const now = new Date();
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(now);
    const get = (t) => parts.find(p => p.type === t)?.value;
    const hour = parseInt(get('hour'), 10) % 24;   // "24" → 0
    return {
      hour,
      minute: parseInt(get('minute'), 10),
      dateKey: `${get('year')}-${get('month')}-${get('day')}`,
      fullTime: `${String(hour).padStart(2, '0')}:${get('minute')}`,
      fullDate: `${get('day')}/${get('month')}/${get('year')}`,
    };
  } catch {
    const pad = (n) => String(n).padStart(2, '0');
    return {
      hour: now.getHours(),
      minute: now.getMinutes(),
      dateKey: now.toISOString().slice(0, 10),
      fullTime: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
      fullDate: `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`,
    };
  }
}

// ============ JADWAL ============
function isInWindow(jam, hour) {
  const catchUp = Math.max(1, Number(config.autoBroadcast?.catchUpHours) || 1);
  return hour >= jam && hour < jam + catchUp;
}

function getDuePeriods(ab, time, state) {
  const pesan = config.waktuPesan || {};
  return Object.entries(pesan)
    .filter(([nama, data]) => {
      if (!data || typeof data.text !== 'string' || !data.text) return false;
      if (!isInWindow(Number(data.jam), time.hour)) return false;
      return !state.sent[`${nama}_${time.dateKey}`];
    })
    .map(([nama, data]) => ({ nama, data, key: `${nama}_${time.dateKey}` }));
}

function getSchedule() {
  const ab = loadAB();
  const time = getTimeInTimezone(ab.timezone);
  const state = loadState();
  return Object.entries(config.waktuPesan || {}).map(([nama, data]) => ({
    nama,
    jam: data.jam,
    done: !!state.sent[`${nama}_${time.dateKey}`],
    isNow: isInWindow(Number(data.jam), time.hour),
  }));
}

// ============ TARGET ============
async function resolveTargets(sock, ab = loadAB()) {
  const list = new Set(ab.targets);
  if (ab.allGroups && sock) {
    try {
      const groups = await sock.groupFetchAllParticipating();
      Object.keys(groups || {}).forEach(id => list.add(id));
    } catch (e) {
      console.log('⚠️ AutoBC: gagal ambil daftar grup → ' + e.message);
    }
  }
  return [...list];
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function sendToTargets(sock, targets, text) {
  let ok = 0, fail = 0;
  for (const target of targets) {
    try {
      await sock.sendMessage(target, { text });
      ok++;
      console.log(`  ✅ → ${target}`);
    } catch (e) {
      fail++;
      console.log(`  ❌ ${target}: ${e.message}`);
    }
    await sleep(SEND_DELAY_MS);
  }
  return { ok, fail, total: targets.length };
}

// Kirim pesan sebuah periode SEKARANG (dipakai .ab send) tanpa menandai "sudah terkirim"
async function broadcastNow(sock, nama) {
  const data = (config.waktuPesan || {})[nama];
  if (!data) throw new Error(`Periode "${nama}" tidak ada. Pilihan: ${Object.keys(config.waktuPesan || {}).join(', ')}`);
  const targets = await resolveTargets(sock);
  if (!targets.length) throw new Error('Belum ada target. Pakai .ab add atau .ab addall');
  return sendToTargets(sock, targets, data.text);
}

// ============ PENGECEKAN JADWAL ============
async function checkAndBroadcast(sock) {
  if (running) return;                       // jangan tumpang tindih
  running = true;
  try {
    const ab = loadAB();
    if (!ab.enabled) return;
    if (!sock || !sock.user) return;         // belum login / koneksi belum siap

    const time = getTimeInTimezone(ab.timezone);
    const state = loadState();
    const due = getDuePeriods(ab, time, state);
    if (!due.length) return;

    const targets = await resolveTargets(sock, ab);
    if (!targets.length) {
      const wkey = due[0].key;
      if (!warned[wkey]) {
        warned[wkey] = true;
        console.log(`⚠️ AutoBC: sudah waktunya (${due[0].nama}) tapi BELUM ADA TARGET. Ketik .ab add di grup tujuan atau .ab addall`);
      }
      return;
    }

    for (const { nama, data, key } of due) {
      console.log(`\n🌅 ${nama.toUpperCase()} — ${time.fullTime} ${ab.timezone} → ${targets.length} target`);
      const res = await sendToTargets(sock, targets, data.text);

      attempts[key] = (attempts[key] || 0) + 1;
      if (res.ok > 0 || attempts[key] >= MAX_ATTEMPTS) {
        state.sent[key] = Date.now();
        saveState(state, time.dateKey);
        console.log(`✅ Broadcast ${nama} selesai (${res.ok}/${res.total} berhasil)\n`);
      } else {
        console.log(`⚠️ Broadcast ${nama} gagal semua, akan dicoba lagi (${attempts[key]}/${MAX_ATTEMPTS})\n`);
      }
    }
  } finally {
    running = false;
  }
}

function startAutoBroadcast(sock) {
  currentSock = sock;                        // reconnect → socket baru menggantikan yang lama
  if (timer) clearInterval(timer);

  const ab = loadAB();
  const time = getTimeInTimezone(ab.timezone);
  console.log(`⏰ Auto broadcast: ${ab.timezone} | ${time.fullTime} ${time.fullDate} | ${ab.enabled ? 'AKTIF' : 'NONAKTIF'} | ${ab.allGroups ? 'SEMUA GRUP' : ab.targets.length + ' target'}`);
  if (ab.enabled && !ab.allGroups && ab.targets.length === 0) {
    console.log('⚠️ Auto broadcast belum punya target! Ketik .ab add di grup tujuan (atau .ab addall).');
  }

  const tick = () => checkAndBroadcast(currentSock).catch(e => console.log('❌ AutoBC:', e.message));
  timer = setInterval(tick, TICK_MS);
  setTimeout(tick, 10000);
}

function stopAutoBroadcast() {
  if (timer) { clearInterval(timer); timer = null; }
}

module.exports = {
  startAutoBroadcast, stopAutoBroadcast, checkAndBroadcast,
  getTimeInTimezone, loadAB, saveAB, getSchedule,
  resolveTargets, broadcastNow,
};
