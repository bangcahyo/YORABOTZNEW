const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { listStaleFiles, removeStaleFiles } = require('../lib/cleanup');

test('cleanup removes only old allowlisted files and preserves active data', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'yora-cleanup-test-'));
  const tempDir = path.join(root, 'tmp');
  const databaseDir = path.join(root, 'database');
  fs.mkdirSync(tempDir);
  fs.mkdirSync(databaseDir);

  const staleMedia = path.join(tempDir, 'yora-123-abcdef.mp4');
  const recentMedia = path.join(tempDir, 'yora-124-ghijkl.mp4');
  const unrelatedMedia = path.join(tempDir, 'important.mp4');
  const staleDatabaseTemp = path.join(databaseDir, 'autobroadcast.json.tmp');
  const activeDatabaseTemp = path.join(databaseDir, `users.json.${process.pid}.tmp`);
  const candidates = [staleMedia, recentMedia, unrelatedMedia, staleDatabaseTemp, activeDatabaseTemp];
  const now = Date.now();
  const oldTime = new Date(now - 5000);

  try {
    for (const file of candidates) fs.writeFileSync(file, 'test data');
    fs.utimesSync(staleMedia, oldTime, oldTime);
    fs.utimesSync(unrelatedMedia, oldTime, oldTime);
    fs.utimesSync(staleDatabaseTemp, oldTime, oldTime);
    fs.utimesSync(activeDatabaseTemp, oldTime, oldTime);

    const options = { tempDir, databaseDir, now, minimumAgeMs: 1000 };
    const preview = listStaleFiles(options);
    assert.deepEqual(preview.map(file => file.name).sort(), [
      'autobroadcast.json.tmp',
      'yora-123-abcdef.mp4',
    ]);

    const result = removeStaleFiles(options);
    assert.equal(result.deleted, 2);
    assert.equal(result.failed, 0);
    assert.equal(result.bytesFreed, Buffer.byteLength('test data') * 2);
    assert.equal(fs.existsSync(staleMedia), false);
    assert.equal(fs.existsSync(staleDatabaseTemp), false);
    assert.equal(fs.existsSync(recentMedia), true);
    assert.equal(fs.existsSync(unrelatedMedia), true);
    assert.equal(fs.existsSync(activeDatabaseTemp), true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});