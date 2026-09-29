const fs = require('fs');
const path = require('path');
const config = require('../config');

const DB_PATH = path.join(__dirname, '..', 'database', 'users.json');
const GROUP_PATH = path.join(__dirname, '..', 'database', 'groups.json');
const MODE_PATH = path.join(__dirname, '..', 'database', 'mode.json');

function ensureDir(p) {
  const d = path.dirname(p);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function loadDB() {
  try { return fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) : {}; }
  catch { return {}; }
}
function saveDB(data) { ensureDir(DB_PATH); fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); }

function getUser(jid) {
  const db = loadDB();
  if (!db[jid]) {
    db[jid] = {
      limit: config.defaultLimit,
      money: config.defaultMoney,
      point: config.defaultPoint,
      exp: 0, lastExpGain: 0,
      lastLimitReset: Date.now(),
    };
    saveDB(db);
  }
  if (db[jid].exp === undefined) { db[jid].exp = 0; db[jid].lastExpGain = 0; saveDB(db); }
  const now = Date.now();
  if (now - db[jid].lastLimitReset > 86400000) {
    db[jid].limit = config.defaultLimit;
    db[jid].lastLimitReset = now;
    saveDB(db);
  }
  return db[jid];
}
function updateUser(jid, data) {
  const db = loadDB();
  db[jid] = { ...(db[jid] || getUser(jid)), ...data };
  saveDB(db);
  return db[jid];
}

function loadGroups() {
  try { return fs.existsSync(GROUP_PATH) ? JSON.parse(fs.readFileSync(GROUP_PATH, 'utf-8')) : {}; }
  catch { return {}; }
}
function saveGroups(data) { ensureDir(GROUP_PATH); fs.writeFileSync(GROUP_PATH, JSON.stringify(data, null, 2)); }
function getGroupSettings(jid) {
  const g = loadGroups();
  if (!g[jid]) {
    g[jid] = { antilink: false, welcome: false, welcomeText: 'Selamat datang @user di @group!', goodbyeText: 'Selamat tinggal @user' };
    saveGroups(g);
  }
  return g[jid];
}
function updateGroupSettings(jid, data) {
  const g = loadGroups();
  g[jid] = { ...(g[jid] || getGroupSettings(jid)), ...data };
  saveGroups(g);
  return g[jid];
}

function loadMode() {
  try {
    if (!fs.existsSync(MODE_PATH)) {
      ensureDir(MODE_PATH);
      fs.writeFileSync(MODE_PATH, JSON.stringify({ mode: config.botMode }, null, 2));
      return config.botMode;
    }
    return JSON.parse(fs.readFileSync(MODE_PATH, 'utf-8')).mode || config.botMode;
  } catch { return config.botMode; }
}
function saveMode(mode) {
  ensureDir(MODE_PATH);
  fs.writeFileSync(MODE_PATH, JSON.stringify({ mode }, null, 2));
  config.botMode = mode;
}

module.exports = {
  loadDB, saveDB, getUser, updateUser,
  loadGroups, saveGroups, getGroupSettings, updateGroupSettings,
  loadMode, saveMode,
  DB_PATH, GROUP_PATH, MODE_PATH,
};