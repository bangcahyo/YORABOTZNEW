const fs = require('fs');
const path = require('path');
const config = require('../config');

const DB_PATH = path.join(__dirname, '..', 'database', 'users.json');
const GROUP_PATH = path.join(__dirname, '..', 'database', 'groups.json');
const MODE_PATH = path.join(__dirname, '..', 'database', 'mode.json');

function loadDB() {
  try {
    if (!fs.existsSync(DB_PATH)) return {};
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch { return {}; }
}
function saveDB(data) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
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
    };
    saveDB(db);
  }
  if (db[jid].exp === undefined) {
    db[jid].exp = 0;
    db[jid].lastExpGain = 0;
    saveDB(db);
  }
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  if (now - db[jid].lastLimitReset > oneDay) {
    db[jid].limit = config.defaultLimit;
    db[jid].lastLimitReset = now;
    saveDB(db);
  }
  return db[jid];
}
function updateUser(jid, data) {
  const db = loadDB();
  if (!db[jid]) db[jid] = getUser(jid);
  db[jid] = { ...db[jid], ...data };
  saveDB(db);
  return db[jid];
}

function loadGroups() {
  try {
    if (!fs.existsSync(GROUP_PATH)) return {};
    return JSON.parse(fs.readFileSync(GROUP_PATH, 'utf-8'));
  } catch { return {}; }
}
function saveGroups(data) {
  const dir = path.dirname(GROUP_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(GROUP_PATH, JSON.stringify(data, null, 2));
}
function getGroupSettings(groupJid) {
  const groups = loadGroups();
  if (!groups[groupJid]) {
    groups[groupJid] = {
      antilink: false,
      welcome: false,
      welcomeText: 'Selamat datang @user di grup @group!',
      goodbyeText: 'Selamat tinggal @user',
    };
    saveGroups(groups);
  }
  return groups[groupJid];
}
function updateGroupSettings(groupJid, data) {
  const groups = loadGroups();
  if (!groups[groupJid]) groups[groupJid] = getGroupSettings(groupJid);
  groups[groupJid] = { ...groups[groupJid], ...data };
  saveGroups(groups);
  return groups[groupJid];
}

function loadMode() {
  try {
    if (!fs.existsSync(MODE_PATH)) {
      const dir = path.dirname(MODE_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(MODE_PATH, JSON.stringify({ mode: config.botMode }, null, 2));
      return config.botMode;
    }
    const data = JSON.parse(fs.readFileSync(MODE_PATH, 'utf-8'));
    return data.mode || config.botMode;
  } catch { return config.botMode; }
}
function saveMode(mode) {
  const dir = path.dirname(MODE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(MODE_PATH, JSON.stringify({ mode }, null, 2));
  config.botMode = mode;
}

module.exports = {
  loadDB, saveDB, getUser, updateUser,
  loadGroups, saveGroups, getGroupSettings, updateGroupSettings,
  loadMode, saveMode,
  DB_PATH, GROUP_PATH, MODE_PATH,
};