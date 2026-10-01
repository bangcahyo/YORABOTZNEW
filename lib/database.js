const fs = require('fs');
const path = require('path');
const config = require('../config');

const ROOT = path.join(__dirname, '..');
const DB_PATH = path.join(ROOT, 'database', 'users.json');
const GROUP_PATH = path.join(ROOT, 'database', 'groups.json');
const MODE_PATH = path.join(ROOT, 'database', 'mode.json');

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadJSON(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return defaultValue;
  }
}

function saveJSON(filePath, data) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function loadDB() {
  return loadJSON(DB_PATH, {});
}

function saveDB(data) {
  saveJSON(DB_PATH, data);
}

function getUser(jid) {
  const db = loadDB();
  if (!db[jid]) {
    db[jid] = {
      limit: config.defaultLimit,
      money: config.defaultMoney,
      point: config.defaultPoint,
      exp: 0,
      lastExpGain: 0,
      lastLimitReset: Date.now(),
      registered: false,
      name: null,
      registeredAt: null,
      premium: false,
      premiumUntil: null,
      totalCommands: 0,
    };
    saveDB(db);
  }
  const u = db[jid];
  let changed = false;
  if (u.exp === undefined) { u.exp = 0; u.lastExpGain = 0; changed = true; }
  if (u.premium === undefined) { u.premium = false; u.premiumUntil = null; changed = true; }
  if (u.totalCommands === undefined) { u.totalCommands = 0; changed = true; }

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // Auto-expire premium
  if (u.premium && u.premiumUntil && now > u.premiumUntil) {
    u.premium = false;
    u.premiumUntil = null;
    changed = true;
  }

  // Reset limit harian (premium dapat limit lebih banyak)
  if (now - u.lastLimitReset > oneDay) {
    const isPrem = u.premium && u.premiumUntil && now < u.premiumUntil;
    u.limit = isPrem ? (config.premium?.dailyLimit || 100) : config.defaultLimit;
    u.lastLimitReset = now;
    changed = true;
  }

  if (changed) saveDB(db);
  return u;
}

function updateUser(jid, updates) {
  const db = loadDB();
  if (!db[jid]) {
    db[jid] = getUser(jid);
  }
  db[jid] = Object.assign({}, db[jid], updates);
  saveDB(db);
  return db[jid];
}

function loadGroups() {
  return loadJSON(GROUP_PATH, {});
}

function saveGroups(data) {
  saveJSON(GROUP_PATH, data);
}

function getGroupSettings(jid) {
  const groups = loadGroups();
  if (!groups[jid]) {
    groups[jid] = {
      antilink: false,
      welcome: false,
      welcomeText: 'Selamat datang @user di grup @group!',
      goodbyeText: 'Selamat tinggal @user',
    };
    saveGroups(groups);
  }
  return groups[jid];
}

function updateGroupSettings(jid, updates) {
  const groups = loadGroups();
  if (!groups[jid]) {
    groups[jid] = getGroupSettings(jid);
  }
  groups[jid] = Object.assign({}, groups[jid], updates);
  saveGroups(groups);
  return groups[jid];
}

function loadMode() {
  const data = loadJSON(MODE_PATH, { mode: config.botMode });
  return data.mode || config.botMode;
}

function saveMode(mode) {
  saveJSON(MODE_PATH, { mode: mode });
  config.botMode = mode;
}

module.exports = {
  loadDB: loadDB,
  saveDB: saveDB,
  getUser: getUser,
  updateUser: updateUser,
  loadGroups: loadGroups,
  saveGroups: saveGroups,
  getGroupSettings: getGroupSettings,
  updateGroupSettings: updateGroupSettings,
  loadMode: loadMode,
  saveMode: saveMode,
};