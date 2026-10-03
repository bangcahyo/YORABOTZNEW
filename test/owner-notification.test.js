const assert = require('node:assert/strict');
const test = require('node:test');
const { getOwnerJid, notifyOwner } = require('../lib/owner-notification');

test('owner notifications prefer the live WhatsApp LID mapping', () => {
  assert.equal(
    getOwnerJid('628123456789', '111111111@lid', [
      { jid: '628123456789@s.whatsapp.net', lid: '222222222@lid', exists: true },
    ]),
    '222222222@lid',
  );
});

test('owner notifications use configured LID before falling back to phone JID', () => {
  assert.equal(getOwnerJid('628123456789', '111111111@lid', []), '111111111@lid');
  assert.equal(getOwnerJid('628123456789', '', []), '628123456789@s.whatsapp.net');
  assert.equal(getOwnerJid('', '', []), null);
});

test('owner notifications await WhatsApp delivery and report send errors', async () => {
  const sent = [];
  const sock = {
    onWhatsApp: async number => {
      assert.equal(number, '628123456789');
      return [{ jid: '628123456789@s.whatsapp.net', lid: '222222222@lid', exists: true }];
    },
    sendMessage: async (jid, message) => {
      sent.push({ jid, message });
      return { key: { id: 'sent' } };
    },
  };

  assert.equal(await notifyOwner(sock, { ownerNumber: '+62 812-3456-789', ownerAlerts: {} }, 'test'), true);
  assert.deepEqual(sent, [{ jid: '222222222@lid', message: { text: 'test' } }]);
});

test('owner notifications log asynchronous failures instead of reporting success', async () => {
  const originalError = console.error;
  const logs = [];
  console.error = message => logs.push(message);
  try {
    const result = await notifyOwner(
      {
        onWhatsApp: async () => [{ jid: '628123456789@s.whatsapp.net', exists: true }],
        sendMessage: async () => { throw new Error('bad address'); },
      },
      { ownerNumber: '628123456789', ownerAlerts: {} },
      'test',
    );
    assert.equal(result, false);
    assert.match(logs[0], /gagal mengirim pesan: bad address/);
  } finally {
    console.error = originalError;
  }
});
