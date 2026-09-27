const config = require('../config');

const spamTracker = {};

function isOwner(jid) {
  if (!jid) return false;
  const number = String(jid).split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
  return number === config.ownerNumber;
}
function isSenderOwner(msg, sender) {
  if (isOwner(sender)) return true;
  if (msg.key.participantPn && isOwner(msg.key.participantPn)) return true;
  if (msg.key.senderPn && isOwner(msg.key.senderPn)) return true;
  if (msg.key.remoteJidAlt && isOwner(msg.key.remoteJidAlt)) return true;
  if (msg.key.participantAlt && isOwner(msg.key.participantAlt)) return true;
  if (msg.key.participant && isOwner(msg.key.participant)) return true;
  return false;
}
function isGroup(jid) { return jid.endsWith('@g.us'); }
function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function formatMoney(amount) { return 'Rp ' + amount.toLocaleString('id-ID'); }

function isGroupAllowed(groupJid) {
  if (!config.whitelistGroup || !config.whitelistGroup.enabled) return true;
  if (!config.whitelistGroup.groups || config.whitelistGroup.groups.length === 0) return false;
  return config.whitelistGroup.groups.includes(groupJid);
}

function checkSpam(senderJid) {
  if (!config.antiSpam) return { spam: false };
  const now = Date.now();
  const user = spamTracker[senderJid] || {
    count: 0, firstMsg: now, warned: 0, mutedUntil: 0, notified: 0,
  };
  if (user.mutedUntil > now) {
    return { spam: true, muted: true, sisa: Math.ceil((user.mutedUntil - now) / 1000) };
  }
  if (now - user.firstMsg > config.spamInterval) {
    user.count = 0;
    user.firstMsg = now;
    user.warned = 0;
  }
  user.count++;
  if (user.count > config.spamLimit) {
    user.warned++;
    if (user.warned >= config.warningBeforeMute) {
      user.mutedUntil = now + config.spamMuteDuration;
      spamTracker[senderJid] = user;
      return { spam: true, muted: true, sisa: Math.ceil(config.spamMuteDuration / 1000) };
    }
    spamTracker[senderJid] = user;
    return { spam: true, muted: false, warned: user.warned };
  }
  spamTracker[senderJid] = user;
  return { spam: false };
}

module.exports = {
  isOwner, isSenderOwner, isGroup, random, formatMoney,
  isGroupAllowed, checkSpam, spamTracker,
};