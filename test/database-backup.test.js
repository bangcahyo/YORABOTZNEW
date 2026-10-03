const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { createSnapshot, createDatabaseBackupManager, listBackups, getBackupStatus, verifyLatestBackup, sendLatestBackup } = require('../lib/database-backup');

test('automatic database backup uses restore-compatible data and rotates old copies', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'yora-backup-test-'));
  const databaseDir = path.join(root, 'database');
  const backupDir = path.join(root, 'backups');
  fs.mkdirSync(databaseDir);
  fs.mkdirSync(path.join(root, 'session'));
  fs.writeFileSync(path.join(databaseDir, 'users.json'), JSON.stringify({ user: { money: 5 } }));
  fs.writeFileSync(path.join(databaseDir, 'groups.json'), JSON.stringify({ group: {} }));
  fs.writeFileSync(path.join(databaseDir, 'mode.json'), JSON.stringify({ mode: 'public' }));
  fs.writeFileSync(path.join(root, 'session', 'creds.json'), 'secret');

  try {
    let flushCount = 0;
    for (let day = 1; day <= 3; day++) {
      await createSnapshot({
        databaseDir,
        backupDir,
        botName: 'Test Bot',
        retentionCount: 2,
        flushDatabase: async () => { flushCount++; },
        now: new Date(`2026-10-0${day}T00:00:00.000Z`),
      });
    }

    const backups = listBackups(backupDir);
    assert.equal(flushCount, 3);
    assert.equal(backups.length, 2);
    assert.match(backups[0].name, /2026-10-03/);
    const data = JSON.parse(fs.readFileSync(backups[0].path, 'utf8'));
    assert.deepEqual(Object.keys(data).sort(), ['botName', 'groups', 'mode', 'timestamp', 'users']);
    assert.equal(data.users.user.money, 5);
    assert.equal(data.mode.mode, 'public');
    assert.equal(fs.statSync(backups[0].path).mode & 0o777, 0o600);
    assert.equal(fs.existsSync(path.join(root, 'session', 'creds.json')), true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('backup manager skips snapshots while the latest backup is fresh', async () => {
  let created = 0;
  const fixedNow = Date.parse('2026-10-03T12:00:00.000Z');
  const manager = createDatabaseBackupManager({
    createSnapshot: async () => { created++; return { path: '/tmp/backup.json' }; },
    now: () => fixedNow,
  });
  const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yora-backup-manager-'));
  const backupPath = path.join(backupDir, 'backup-2026-10-03T11-30-00-000Z.json');
  fs.writeFileSync(backupPath, '{}');

  try {
    await manager.start({
      backupDir,
      config: { databaseBackup: { enabled: true, intervalHours: 24, retentionCount: 7 } },
    });
    await manager.check();
    assert.equal(created, 0);
  } finally {
    manager.stop();
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
});

test('backup failures notify owner once per cooldown and reset after success', async () => {
  const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yora-backup-failure-test-'));
  let now = 1000;
  let fail = true;
  const notifications = [];
  const manager = createDatabaseBackupManager({
    createSnapshot: async () => {
      if (fail) throw new Error('disk full');
      return { path: '/tmp/backup.json' };
    },
    notifyOwner: async (_sock, _config, message) => { notifications.push(message); return true; },
    now: () => now,
    logger: { log() {}, error() {} },
  });
  const config = {
    databaseBackup: {
      enabled: true,
      intervalHours: 24,
      failureAlertCooldownHours: 24,
    },
  };

  try {
    await manager.start({ backupDir, config, sock: {} });
    await manager.check();
    assert.equal(notifications.length, 1);

    now += 23 * 60 * 60 * 1000;
    await manager.check();
    assert.equal(notifications.length, 1);

    fail = false;
    await manager.check();
    fail = true;
    now += 24 * 60 * 60 * 1000;
    await manager.check();
    assert.equal(notifications.length, 2);
    assert.ok(notifications.every(message => message.includes('disk full')));
  } finally {
    manager.stop();
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
});

test('latest automatic backup can be sent as a restore-ready document', async () => {
  const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yora-send-backup-test-'));
  const backupPath = path.join(backupDir, 'backup-2026-10-03T12-00-00-000Z.json');
  const payload = {
    timestamp: '2026-10-03T12:00:00.000Z',
    users: { user: {} },
    groups: { group: {} },
    mode: { mode: 'public' },
  };
  fs.writeFileSync(backupPath, JSON.stringify(payload));

  try {
    let sent;
    await sendLatestBackup({
      sendMessage: async (recipient, message, options) => { sent = { recipient, message, options }; },
    }, 'owner@s.whatsapp.net', { key: 'quoted' }, backupDir);

    assert.equal(sent.recipient, 'owner@s.whatsapp.net');
    assert.equal(sent.message.fileName, path.basename(backupPath));
    assert.equal(sent.message.mimetype, 'application/json');
    assert.deepEqual(JSON.parse(sent.message.document.toString('utf8')), payload);
    assert.ok(sent.message.caption.includes('Gunakan .restore'));
  } finally {
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
});

test('backup status reports count, total size, and staleness', () => {
  const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yora-backup-status-test-'));
  const latestPath = path.join(backupDir, 'backup-2026-10-03T12-00-00-000Z.json');
  const olderPath = path.join(backupDir, 'backup-2026-10-02T12-00-00-000Z.json');
  const now = Date.parse('2026-10-04T13:00:00.000Z');
  fs.writeFileSync(latestPath, 'latest');
  fs.writeFileSync(olderPath, 'older');
  fs.utimesSync(latestPath, new Date(now - 25 * 60 * 60 * 1000), new Date(now - 25 * 60 * 60 * 1000));
  fs.utimesSync(olderPath, new Date(now - 49 * 60 * 60 * 1000), new Date(now - 49 * 60 * 60 * 1000));

  try {
    const status = getBackupStatus({ backupDir, now, intervalMs: 24 * 60 * 60 * 1000 });
    assert.equal(status.count, 2);
    assert.equal(status.totalBytes, 11);
    assert.equal(status.latest.name, path.basename(latestPath));
    assert.equal(status.ageMs, 25 * 60 * 60 * 1000);
    assert.equal(status.isFresh, false);
  } finally {
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
});

test('backup verification accepts restore-compatible data and rejects corrupt snapshots', () => {
  const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'yora-backup-verify-test-'));
  const latestPath = path.join(backupDir, 'backup-2026-10-03T12-00-00-000Z.json');

  try {
    fs.writeFileSync(latestPath, JSON.stringify({
      timestamp: '2026-10-03T12:00:00.000Z',
      users: { user: {} },
      groups: { group: {} },
      mode: { mode: 'public' },
    }));
    const valid = verifyLatestBackup({ backupDir });
    assert.equal(valid.ok, true);
    assert.equal(valid.users, 1);
    assert.equal(valid.groups, 1);

    fs.writeFileSync(latestPath, '{invalid json');
    const corrupt = verifyLatestBackup({ backupDir });
    assert.equal(corrupt.ok, false);
    assert.match(corrupt.error, /JSON tidak valid/);

    fs.writeFileSync(latestPath, JSON.stringify({ users: [], groups: {}, mode: {} }));
    const invalidShape = verifyLatestBackup({ backupDir });
    assert.equal(invalidShape.ok, false);
    assert.match(invalidShape.error, /users/);
  } finally {
    fs.rmSync(backupDir, { recursive: true, force: true });
  }
});