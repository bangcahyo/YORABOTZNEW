const fs = require('fs');
const path = require('path');
const { notifyOwner } = require('./owner-notification');

const ROOT = path.join(__dirname, '..');
const DEFAULT_INTERVAL_MS = 24 * 60 * 60 * 1000;
const BACKUP_PATTERN = /^backup-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z\.json$/;

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw error;
  }
}

function listBackups(backupDir) {
  let names;
  try {
    names = fs.readdirSync(backupDir);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }

  return names.flatMap(name => {
    if (!BACKUP_PATTERN.test(name)) return [];
    const filePath = path.join(backupDir, name);
    try {
      const stat = fs.lstatSync(filePath);
      return stat.isFile() ? [{ path: filePath, name, mtimeMs: stat.mtimeMs, size: stat.size }] : [];
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }).sort((a, b) => b.name.localeCompare(a.name));
}

function pruneBackups(backupDir, retentionCount = 7) {
  const keep = Math.max(1, Math.floor(Number(retentionCount) || 7));
  const backups = listBackups(backupDir);
  for (const backup of backups.slice(keep)) fs.unlinkSync(backup.path);
  return backups.length - Math.min(backups.length, keep);
}

function getBackupStatus(options = {}) {
  const backupDir = options.backupDir || path.join(ROOT, 'database', 'backups');
  const intervalMs = options.intervalMs || DEFAULT_INTERVAL_MS;
  const backups = listBackups(backupDir);
  const latest = backups[0] || null;
  const ageMs = latest ? Math.max(0, (options.now ?? Date.now()) - latest.mtimeMs) : null;
  return {
    count: backups.length,
    totalBytes: backups.reduce((total, backup) => total + backup.size, 0),
    latest,
    ageMs,
    isFresh: ageMs !== null && ageMs < intervalMs,
  };
}

function verifyLatestBackup(options = {}) {
  const backupDir = options.backupDir || path.join(ROOT, 'database', 'backups');
  const latest = listBackups(backupDir)[0];
  if (!latest) return { ok: false, latest: null, error: 'Belum ada backup otomatis.' };

  try {
    const backupData = JSON.parse(fs.readFileSync(latest.path, 'utf8'));
    const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    for (const field of ['users', 'groups', 'mode']) {
      if (!isObject(backupData?.[field])) {
        return { ok: false, latest, error: `Data "${field}" tidak ada atau formatnya tidak valid.` };
      }
    }
    return {
      ok: true,
      latest,
      timestamp: backupData.timestamp || null,
      users: Object.keys(backupData.users).length,
      groups: Object.keys(backupData.groups).length,
    };
  } catch (error) {
    return { ok: false, latest, error: `JSON tidak valid: ${error.message}` };
  }
}

async function sendLatestBackup(sock, recipient, msg, backupDir = path.join(ROOT, 'database', 'backups')) {
  const latest = listBackups(backupDir)[0];
  if (!latest) {
    await sock.sendMessage(recipient, {
      text: 'Belum ada backup otomatis. Tunggu backup terjadwal atau gunakan .backup untuk membuat backup baru.',
    }, { quoted: msg });
    return false;
  }

  const document = await fs.promises.readFile(latest.path);
  const backupData = JSON.parse(document.toString('utf8'));
  await sock.sendMessage(recipient, {
    document,
    mimetype: 'application/json',
    fileName: latest.name,
    caption: `✅ Backup otomatis terbaru\n\nTanggal: ${backupData.timestamp || 'Tidak diketahui'}\nUsers: ${Object.keys(backupData.users || {}).length}\nGroups: ${Object.keys(backupData.groups || {}).length}\n\nGunakan .restore untuk memulihkan backup ini.`,
  }, { quoted: msg });
  return true;
}

async function createSnapshot(options = {}) {
  const databaseDir = options.databaseDir || path.join(ROOT, 'database');
  const backupDir = options.backupDir || path.join(databaseDir, 'backups');
  const now = options.now ? new Date(options.now) : new Date();
  const flushDatabase = options.flushDatabase || (async () => {});
  const retentionCount = options.retentionCount ?? 7;
  await flushDatabase();

  const timestamp = now.toISOString();
  const backupData = {
    timestamp,
    botName: options.botName || 'Yora Botz',
    users: readJson(path.join(databaseDir, 'users.json'), {}),
    groups: readJson(path.join(databaseDir, 'groups.json'), {}),
    mode: readJson(path.join(databaseDir, 'mode.json'), {}),
  };

  await fs.promises.mkdir(backupDir, { recursive: true, mode: 0o700 });
  const name = `backup-${timestamp.replace(/[:.]/g, '-')}.json`;
  const filePath = path.join(backupDir, name);
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  try {
    await fs.promises.writeFile(temporaryPath, JSON.stringify(backupData, null, 2), { mode: 0o600 });
    await fs.promises.rename(temporaryPath, filePath);
    await fs.promises.chmod(filePath, 0o600);
  } catch (error) {
    try { await fs.promises.unlink(temporaryPath); } catch (cleanupError) {
      if (cleanupError.code !== 'ENOENT') console.error('Gagal menghapus temp backup:', cleanupError.message);
    }
    throw error;
  }

  pruneBackups(backupDir, retentionCount);
  return { path: filePath, timestamp, users: Object.keys(backupData.users).length, groups: Object.keys(backupData.groups).length };
}

function createDatabaseBackupManager(dependencies = {}) {
  const createBackup = dependencies.createSnapshot || createSnapshot;
  const setIntervalFn = dependencies.setInterval || setInterval;
  const clearIntervalFn = dependencies.clearInterval || clearInterval;
  const now = dependencies.now || Date.now;
  const sendNotification = dependencies.notifyOwner || notifyOwner;
  const logger = dependencies.logger || console;
  let timer = null;
  let inProgress = false;
  let currentOptions = null;
  let lastFailureAlertAt = null;

  async function check() {
    if (!currentOptions || inProgress) return null;
    const intervalMs = currentOptions.intervalMs;
    const backupDir = currentOptions.backupDir || path.join(currentOptions.databaseDir || path.join(ROOT, 'database'), 'backups');
    const latest = listBackups(backupDir)[0];
    if (latest && now() - latest.mtimeMs < intervalMs) return null;

    inProgress = true;
    try {
      const backup = await createBackup(currentOptions);
      lastFailureAlertAt = null;
      logger.log(`✅ Backup database otomatis tersimpan: ${path.basename(backup.path)}`);
      return backup;
    } catch (error) {
      logger.error('❌ Backup database otomatis gagal:', error.message);
      const backupConfig = currentOptions.config?.databaseBackup || {};
      const cooldownMs = (Number(backupConfig.failureAlertCooldownHours) || 24) * 60 * 60 * 1000;
      const failedAt = now();
      if (backupConfig.notifyOnFailure !== false
        && currentOptions.sock
        && (lastFailureAlertAt === null || failedAt - lastFailureAlertAt >= cooldownMs)) {
        lastFailureAlertAt = failedAt;
        try {
          await sendNotification(currentOptions.sock, currentOptions.config,
            `⚠️ *BACKUP DATABASE GAGAL*\n\n` +
            `Backup otomatis tidak berhasil dibuat: ${error.message}\n` +
            `Bot akan mencoba lagi sesuai jadwal. Periksa ruang disk dengan .storage.`,
          );
        } catch (notificationError) {
          logger.error('❌ Gagal mengirim notifikasi backup:', notificationError.message);
        }
      }
      return null;
    } finally {
      inProgress = false;
    }
  }

  function start(options = {}) {
    stop();
    const config = options.config || {};
    if (config.databaseBackup?.enabled === false) return;
    lastFailureAlertAt = null;
    const intervalHours = Number(config.databaseBackup?.intervalHours) || 24;
    currentOptions = {
      ...options,
      intervalMs: intervalHours * 60 * 60 * 1000,
      retentionCount: config.databaseBackup?.retentionCount ?? 7,
    };
    const checkInterval = Math.min(currentOptions.intervalMs, 60 * 60 * 1000);
    timer = setIntervalFn(() => { void check(); }, checkInterval);
    timer.unref?.();
    return check();
  }

  function stop() {
    if (timer) clearIntervalFn(timer);
    timer = null;
    currentOptions = null;
  }

  return { start, stop, check };
}

const manager = createDatabaseBackupManager();

module.exports = {
  createSnapshot,
  listBackups,
  pruneBackups,
  getBackupStatus,
  verifyLatestBackup,
  sendLatestBackup,
  createDatabaseBackupManager,
  startDatabaseBackup: manager.start,
  stopDatabaseBackup: manager.stop,
};