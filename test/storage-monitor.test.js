const assert = require('node:assert/strict');
const test = require('node:test');
const { createStorageMonitor } = require('../lib/storage-monitor');

test('storage monitor alerts below threshold, observes cooldown, and rearms after recovery', async () => {
  let availableBytes = 10;
  let now = 1000;
  const notifications = [];
  const monitor = createStorageMonitor({
    getUsage: () => ({ totalBytes: 100, availableBytes }),
    notifyOwner: async (_sock, _config, text) => {
      notifications.push(text);
      return true;
    },
    now: () => now,
  });
  const config = {
    storageMonitor: {
      enabled: true,
      thresholdPercent: 15,
      cooldownMs: 100,
    },
  };

  await monitor.check({}, config);
  await monitor.check({}, config);
  assert.equal(notifications.length, 1);

  now += 100;
  await monitor.check({}, config);
  assert.equal(notifications.length, 2);

  availableBytes = 50;
  await monitor.check({}, config);
  availableBytes = 10;
  await monitor.check({}, config);
  assert.equal(notifications.length, 3);
  assert.ok(notifications.every(message => message.includes('Session dan database tidak dihapus')));
});

test('storage monitor respects disabled configuration', async () => {
  let notified = false;
  const monitor = createStorageMonitor({
    getUsage: () => ({ totalBytes: 100, availableBytes: 1 }),
    notifyOwner: async () => { notified = true; return true; },
  });

  await monitor.check({}, { storageMonitor: { enabled: false } });
  assert.equal(notified, false);
});