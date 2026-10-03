const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { getDirectoryUsage } = require('../lib/storage-usage');
const storagePlugin = require('../plugins/owner/storage');

test('storage usage counts regular files recursively without following symlinks', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'yora-storage-test-'));
  const nested = path.join(root, 'nested');
  const outside = path.join(root, '..', `yora-storage-outside-${process.pid}`);
  fs.mkdirSync(nested);

  try {
    fs.writeFileSync(path.join(root, 'small.json'), '1234');
    fs.writeFileSync(path.join(nested, 'large.bin'), '123456789');
    fs.mkdirSync(outside);
    fs.writeFileSync(path.join(outside, 'external.bin'), 'must not count');
    fs.symlinkSync(outside, path.join(root, 'linked'));

    const usage = getDirectoryUsage(root);
    assert.equal(usage.files, 2);
    assert.equal(usage.bytes, 13);
    assert.deepEqual(usage.largestFiles.map(file => file.path), ['nested/large.bin', 'small.json']);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});

test('.storage is owner-only and reports session usage to the owner', async () => {
  let response;
  const sock = {
    sendMessage: async (_jid, message) => { response = message.text; },
  };

  await storagePlugin.execute(sock, {}, [], {
    from: 'test@g.us',
    config: { prefix: '.' },
    isSenderOwner: () => false,
  });
  assert.match(response, /khusus untuk owner/);

  await storagePlugin.execute(sock, {}, [], {
    from: 'test@g.us',
    config: { prefix: '.' },
    isSenderOwner: () => true,
  });
  assert.match(response, /session: \*\d+(?:\.\d+)? (?:B|KB|MB|GB)\* · \d+ file/);
  assert.match(response, /Ruang tersedia:/);
  assert.match(response, /tidak ada session atau key yang dihapus/);
});