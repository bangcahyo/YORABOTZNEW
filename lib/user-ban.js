const bannedNoticeTimes = new Map();
const BAN_NOTICE_COOLDOWN_MS = 6 * 60 * 60 * 1000;

function identityKeys(identities) {
  const keys = new Set();
  for (const identity of identities || []) {
    if (!identity) continue;
    const value = String(identity).trim();
    if (!value) continue;
    keys.add(value);
    const digits = value.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
    if (digits) keys.add(`${digits}@s.whatsapp.net`);
  }
  return keys;
}

function getBannedUser(users, identities) {
  if (!users || typeof users !== 'object') return null;
  for (const key of identityKeys(identities)) {
    if (users[key]?.banned === true) return { ...users[key], id: key };
  }
  return null;
}

function shouldNotifyBannedUser(identity, now = Date.now()) {
  const key = String(identity || 'unknown');
  const lastNotice = bannedNoticeTimes.get(key);
  if (lastNotice !== undefined && now - lastNotice < BAN_NOTICE_COOLDOWN_MS) return false;
  bannedNoticeTimes.set(key, now);
  if (bannedNoticeTimes.size > 1000) {
    for (const [storedKey, timestamp] of bannedNoticeTimes) {
      if (now - timestamp >= BAN_NOTICE_COOLDOWN_MS) bannedNoticeTimes.delete(storedKey);
    }
  }
  return true;
}

function resetBannedNoticeCooldowns() {
  bannedNoticeTimes.clear();
}

module.exports = { identityKeys, getBannedUser, shouldNotifyBannedUser, resetBannedNoticeCooldowns };