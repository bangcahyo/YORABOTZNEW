const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const projectRoot = path.join(__dirname, '..');

function createIsolatedDatabase(t) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'yorabotz-db-test-'));
  const libRoot = path.join(tempRoot, 'lib');
  const databaseRoot = path.join(tempRoot, 'database');
  fs.mkdirSync(libRoot);
  fs.mkdirSync(databaseRoot);
  fs.copyFileSync(path.join(projectRoot, 'lib', 'database.js'), path.join(libRoot, 'database.js'));
  fs.copyFileSync(path.join(projectRoot, 'config.js'), path.join(tempRoot, 'config.js'));
  const database = require(path.join(libRoot, 'database.js'));
  t.after(async () => {
    try {
      await database.flushDatabase();
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });
  return { database, databaseRoot };
}

test('warm reads use the in-memory cache and explicit reload sees restored files', t => {
  const { database, databaseRoot } = createIsolatedDatabase(t);
  const usersPath = path.join(databaseRoot, 'users.json');
  fs.writeFileSync(usersPath, JSON.stringify({ before: { money: 10 } }));

  const firstRead = database.loadDB();
  assert.equal(database.loadDB(), firstRead);

  fs.writeFileSync(usersPath, JSON.stringify({ after: { money: 20 } }));
  assert.equal(database.loadDB(), firstRead);

  database.reloadDatabase();
  assert.deepEqual(database.loadDB(), { after: { money: 20 } });
});

test('multiple updates are persisted as one atomic write with the latest state', async t => {
  const { database, databaseRoot } = createIsolatedDatabase(t);
  const usersPath = path.join(databaseRoot, 'users.json');
  const jid = 'batch-user@s.whatsapp.net';
  const originalWriteFile = fs.promises.writeFile;
  let writeCount = 0;
  fs.promises.writeFile = function(...args) {
    writeCount++;
    return originalWriteFile.apply(this, args);
  };
  try {
    database.getUser(jid);
    database.updateUser(jid, { money: 2000 });
    database.updateUser(jid, { money: 3000, point: 10 });
    await database.flushDatabase();
  } finally {
    fs.promises.writeFile = originalWriteFile;
  }

  assert.equal(writeCount, 1);
  const saved = JSON.parse(fs.readFileSync(usersPath, 'utf8'))[jid];
  assert.equal(saved.money, 3000);
  assert.equal(saved.point, 10);
  assert.equal(saved.limit, 20);
  assert.equal(saved.registered, false);
  assert.equal(Number.isFinite(saved.lastLimitReset), true);
  assert.deepEqual(Object.keys(saved).sort(), [
    'exp', 'lastExpGain', 'lastLimitReset', 'limit', 'money', 'name',
    'point', 'premium', 'premiumUntil', 'registered', 'registeredAt',
    'totalCommands',
  ]);
});

test('Premium balances are capped and daily reset uses configured allowance', async t => {
  const { database } = createIsolatedDatabase(t);
  const jid = 'premium-user@s.whatsapp.net';
  database.getUser(jid);
  database.updateUser(jid, {
    premium: true,
    premiumUntil: Date.now() + 24 * 60 * 60 * 1000,
    limit: 12000,
  });
  assert.equal(database.getUser(jid).limit, 9999);

  database.updateUser(jid, { lastLimitReset: Date.now() - 25 * 60 * 60 * 1000 });
  const user = database.getUser(jid);
  assert.equal(user.premium, true);
  assert.equal(user.limit, 100);
  await database.flushDatabase();
});

test('expired Premium does not retain the Premium daily allowance', async t => {
  const { database } = createIsolatedDatabase(t);
  const jid = 'expired-user@s.whatsapp.net';
  database.getUser(jid);
  database.updateUser(jid, {
    premium: true,
    premiumUntil: Date.now() - 1000,
    limit: 100,
    lastLimitReset: Date.now() - 25 * 60 * 60 * 1000,
  });

  const user = database.getUser(jid);
  assert.equal(user.premium, false);
  assert.equal(user.limit, 20);
  await database.flushDatabase();
});
