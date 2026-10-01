const { loadDB, saveDB, getUser, updateUser } = require('./database');
const config = require('../config');

const DAY = 24 * 60 * 60 * 1000;

// Cek apakah user premium aktif
function isPremium(user) {
  if (!user) return false;
  if (!user.premium) return false;
  if (!user.premiumUntil) return false;
  return Date.now() < user.premiumUntil;
}

// Sisa hari premium
function premiumRemainingDays(user) {
  if (!isPremium(user)) return 0;
  return Math.ceil((user.premiumUntil - Date.now()) / DAY);
}

// Tambah durasi premium (hari)
function addPremium(jid, days) {
  const u = getUser(jid);
  const now = Date.now();
  const base = (u.premium && u.premiumUntil && u.premiumUntil > now) ? u.premiumUntil : now;
  const until = base + (days * DAY);
  updateUser(jid, { premium: true, premiumUntil: until });
  return until;
}

// Hapus premium
function removePremium(jid) {
  updateUser(jid, { premium: false, premiumUntil: null });
}

// Daftar semua user premium aktif
function listPremium() {
  const db = loadDB();
  const now = Date.now();
  const list = [];
  for (const [jid, data] of Object.entries(db)) {
    if (data.premium && data.premiumUntil && data.premiumUntil > now) {
      list.push({ jid, name: data.name || jid.split('@')[0], until: data.premiumUntil, days: Math.ceil((data.premiumUntil - now) / DAY) });
    }
  }
  return list.sort((a, b) => b.until - a.until);
}

// Format tanggal
function formatDate(ts) {
  if (!ts) return '-';
  const d = new Date(ts);
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

// Apakah command butuh premium
function isPremiumOnly(command) {
  if (!config.premium?.enabled) return false;
  return (config.premiumOnly || []).includes(String(command).toLowerCase());
}

module.exports = {
  isPremium, premiumRemainingDays, addPremium, removePremium,
  listPremium, formatDate, isPremiumOnly, DAY,
};
