const assert = require('node:assert/strict');
const test = require('node:test');
const { getBannedUser, shouldNotifyBannedUser, resetBannedNoticeCooldowns } = require('../lib/user-ban');
const ban = require('../plugins/owner/ban');
const unban = require('../plugins/owner/unban');

test('ban lookup accepts JID and normalized phone identity variants', () => {
  const users = {
    '628123456789@s.whatsapp.net': { banned: true, banReason: 'spam' },
  };
  assert.equal(getBannedUser(users, ['628123456789@lid']).banReason, 'spam');
  assert.equal(getBannedUser(users, ['628123456789@s.whatsapp.net']).banned, true);
  assert.equal(getBannedUser(users, ['628999999999@s.whatsapp.net']), null);
});

test('banned notices are rate-limited to one per six hours per identity', () => {
  resetBannedNoticeCooldowns();
  const first = shouldNotifyBannedUser('user@s.whatsapp.net', 1000);
  const withinCooldown = shouldNotifyBannedUser('user@s.whatsapp.net', 1001);
  const afterCooldown = shouldNotifyBannedUser('user@s.whatsapp.net', 1000 + 6 * 60 * 60 * 1000);
  assert.equal(first, true);
  assert.equal(withinCooldown, false);
  assert.equal(afterCooldown, true);
  resetBannedNoticeCooldowns();
});

test('.ban and .unban are owner-only and persist status on the user record', async () => {
  const users = {};
  const sent = [];
  const sock = { sendMessage: async (_jid, message) => { sent.push(message.text); } };
  const baseContext = {
    from: 'owner@s.whatsapp.net',
    config: { prefix: '.', ownerNumber: '628139525985', ownerLID: '33033365233764@lid' },
    mentioned: ['628123456789@s.whatsapp.net'],
    sender: 'owner@s.whatsapp.net',
    isSenderOwner: () => true,
    updateUser: (jid, updates) => { users[jid] = { ...users[jid], ...updates }; },
    loadDB: () => users,
  };

  await ban.execute(sock, {}, ['@628123456789', 'spam'], baseContext);
  assert.equal(users['628123456789@s.whatsapp.net'].banned, true);
  assert.match(sent.at(-1), /hubungi owner/);

  await unban.execute(sock, {}, ['@628123456789'], baseContext);
  assert.equal(users['628123456789@s.whatsapp.net'].banned, false);
  assert.match(sent.at(-1), /di-unban/);

  const denied = [];
  await ban.execute({ sendMessage: async (_jid, message) => denied.push(message.text) }, {}, [], {
    ...baseContext,
    isSenderOwner: () => false,
  });
  assert.match(denied[0], /khusus untuk owner/);
});