const fs = require('fs');
const path = require('path');
const config = require('../config');

const ROOT = path.join(__dirname, '..');
const DB_PATH = path.join(ROOT, 'database', 'users.json');
const GROUP_PATH = path.join(ROOT, 'database', 'groups.json');
const MODE_PATH = path.join(ROOT, 'database', 'mode.json');
const COMMAND_STATS_PATH = path.join(ROOT, 'database', 'command-stats.json');
const ACTIVITY_LOG_PATH = path.join(ROOT, 'database', 'activity-log.json');
const jsonCache = new Map();
const pendingWrites = new Map();
const WRITE_DEBOUNCE_MS = 25;
const WRITE_RETRY_MS = 1000;
let flushTimer = null;
let flushPromise = null;
let writeRevision = 0;

function loadJSON(filePath, defaultValue) {
  if (jsonCache.has(filePath)) return jsonCache.get(filePath);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    jsonCache.set(filePath, data);
    return data;
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.error(`❌ Gagal membaca database ${filePath}: ${e.message}`);
    }
    jsonCache.set(filePath, defaultValue);
    return defaultValue;
  }
}

function saveJSON(filePath, data) {
  jsonCache.set(filePath, data);
  pendingWrites.set(filePath, { data, revision: ++writeRevision });
  scheduleFlush();
}

function scheduleFlush(delay = WRITE_DEBOUNCE_MS) {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushDatabase().catch(error => {
      console.error(`❌ Background database flush gagal; perubahan tetap antre: ${error.message}`);
    });
  }, delay);
}

async function flushDatabase() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (flushPromise) return flushPromise;

  flushPromise = (async () => {
    while (pendingWrites.size) {
      const batch = [...pendingWrites.entries()];
      for (const [filePath, write] of batch) {
        const tempPath = `${filePath}.${process.pid}.tmp`;
        try {
          const content = JSON.stringify(write.data, null, 2);
          await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
          await fs.promises.writeFile(tempPath, content);
          await fs.promises.rename(tempPath, filePath);
          if (pendingWrites.get(filePath)?.revision === write.revision) pendingWrites.delete(filePath);
        } catch (error) {
          console.error(`❌ Gagal menyimpan database ${filePath}: ${error.message}`);
          try { await fs.promises.unlink(tempPath); } catch (cleanupError) {
            if (cleanupError.code !== 'ENOENT') {
              console.error(`❌ Gagal membersihkan file sementara ${tempPath}: ${cleanupError.message}`);
            }
          }
          throw error;
        }
      }
    }
  })();

  try {
    await flushPromise;
  } catch (error) {
    scheduleFlush(WRITE_RETRY_MS);
    throw error;
  } finally {
    flushPromise = null;
  }
}

process.once('beforeExit', () => {
  if (pendingWrites.size) {
    flushDatabase().catch(error => {
      console.error(`❌ Flush database sebelum proses berhenti gagal: ${error.message}`);
    });
  }
});

function reloadDatabase() {
  jsonCache.clear();
  config.botMode = loadMode();
}

function loadDB() {
  return loadJSON(DB_PATH, {});
}

function saveDB(data) {
  saveJSON(DB_PATH, data);
}

function loadCommandStats() {
  return loadJSON(COMMAND_STATS_PATH, {});
}

function recordCommandUsage(commandName) {
  const stats = loadCommandStats();
  const current = stats[commandName] || {};
  stats[commandName] = {
    count: (Number(current.count) || 0) + 1,
    lastUsed: Date.now(),
  };
  saveJSON(COMMAND_STATS_PATH, stats);
  return stats[commandName];
}

function resetCommandStats() {
  saveJSON(COMMAND_STATS_PATH, {});
}

function loadActivityLog() {
  return loadJSON(ACTIVITY_LOG_PATH, []);
}

function pushActivity(entry) {
  const logs = loadActivityLog();
  const data = {
    id: Date.now() + Math.random().toString(16).slice(2),
    timestamp: Date.now(),
    ...entry,
  };
  logs.unshift(data);
  saveJSON(ACTIVITY_LOG_PATH, logs.slice(0, 200));
  return data;
}

function clearActivityLog() {
  saveJSON(ACTIVITY_LOG_PATH, []);
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
    const dailyLimit = isPrem ? (config.premium?.dailyLimit || 100) : config.defaultLimit;
    const maxLimit = Math.max(0, Number(config.premium?.maxLimit) || 9999);
    u.limit = isPrem ? Math.min(dailyLimit, maxLimit) : dailyLimit;
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
  const u = db[jid];
  if (u.premium && u.premiumUntil && Date.now() < u.premiumUntil) {
    const maxLimit = Math.max(0, Number(config.premium?.maxLimit) || 9999);
    u.limit = Math.min(Number(u.limit) || 0, maxLimit);
  }
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
  loadCommandStats: loadCommandStats,
  recordCommandUsage: recordCommandUsage,
  resetCommandStats: resetCommandStats,
  loadActivityLog: loadActivityLog,
  pushActivity: pushActivity,
  clearActivityLog: clearActivityLog,
  flushDatabase: flushDatabase,
  getUser: getUser,
  updateUser: updateUser,
  loadGroups: loadGroups,
  saveGroups: saveGroups,
  getGroupSettings: getGroupSettings,
  updateGroupSettings: updateGroupSettings,
  loadMode: loadMode,
  saveMode: saveMode,
  reloadDatabase: reloadDatabase,
};