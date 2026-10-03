const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DEFAULT_MINIMUM_AGE_MS = 60 * 60 * 1000;
const MEDIA_TEMP_PATTERN = /^yora-\d+-[a-z0-9]{1,12}(?:\.[a-z0-9_-]+)*$/i;
const DATABASE_TEMP_PATTERN = /^(?:users|groups|mode|command-stats|activity-log|autobroadcast|autobroadcast-state)\.json(?:\.(\d+))?\.tmp$/;

function processIsRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === 'EPERM';
  }
}

function scanDirectory(directory, pattern, kind, now, minimumAgeMs) {
  let names;
  try {
    names = fs.readdirSync(directory);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }

  const candidates = [];
  for (const name of names) {
    const match = name.match(pattern);
    if (!match) continue;

    const filePath = path.join(directory, name);
    let stat;
    try {
      stat = fs.lstatSync(filePath);
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }
    if (!stat.isFile() || now - stat.mtimeMs < minimumAgeMs) continue;

    const pid = match[1] ? Number(match[1]) : null;
    if (pid && processIsRunning(pid)) continue;
    candidates.push({
      path: filePath,
      name,
      kind,
      size: stat.size,
      mtimeMs: stat.mtimeMs,
      dev: stat.dev,
      ino: stat.ino,
      pid,
    });
  }
  return candidates;
}

function listStaleFiles(options = {}) {
  const now = options.now ?? Date.now();
  const minimumAgeMs = options.minimumAgeMs ?? DEFAULT_MINIMUM_AGE_MS;
  const tempDir = options.tempDir || os.tmpdir();
  const databaseDir = options.databaseDir || path.join(ROOT, 'database');
  return [
    ...scanDirectory(tempDir, MEDIA_TEMP_PATTERN, 'media-temp', now, minimumAgeMs),
    ...scanDirectory(databaseDir, DATABASE_TEMP_PATTERN, 'database-temp', now, minimumAgeMs),
  ];
}

function removeStaleFiles(options = {}) {
  const candidates = listStaleFiles(options);
  const now = options.now ?? Date.now();
  const minimumAgeMs = options.minimumAgeMs ?? DEFAULT_MINIMUM_AGE_MS;
  let deleted = 0;
  let failed = 0;
  let bytesFreed = 0;

  for (const candidate of candidates) {
    try {
      const stat = fs.lstatSync(candidate.path);
      if (!stat.isFile() || stat.dev !== candidate.dev || stat.ino !== candidate.ino) continue;
      if (stat.mtimeMs !== candidate.mtimeMs || now - stat.mtimeMs < minimumAgeMs) continue;
      if (candidate.pid && processIsRunning(candidate.pid)) continue;
      fs.unlinkSync(candidate.path);
      deleted++;
      bytesFreed += stat.size;
    } catch (error) {
      if (error.code !== 'ENOENT') failed++;
    }
  }

  return { candidates: candidates.length, deleted, failed, bytesFreed };
}

module.exports = { listStaleFiles, removeStaleFiles, DEFAULT_MINIMUM_AGE_MS };