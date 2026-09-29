const config = require('../config');
const spamTracker = {};

function isOwner(jid) {
  if (!jid) return false;
  const n = String(jid).split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
  return n === config.ownerNumber;
}

function isSenderOwner(msg, sender) {
  const cleanOwner = config.ownerNumber.replace(/[^0-9]/g, '');
  const ownerLID = (config.ownerLID || '').replace(/[^0-9]/g, '');

  const fields = [
    sender,
    msg?.key?.participant,
    msg?.key?.participantAlt,
    msg?.key?.participantPn,
    msg?.key?.remoteJid,
    msg?.key?.remoteJidAlt,
    msg?.key?.senderPn,
  ].filter(Boolean);

  for (const f of fields) {
    const clean = String(f).split('@')[0].split(':')[0].replace(/[^0-9]/g, '');
    if (clean === cleanOwner) return true;
    if (ownerLID && clean === ownerLID) return true;
  }
  return false;
}

function isGroup(jid) { return jid.endsWith('@g.us'); }
function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function formatMoney(a) { return 'Rp ' + a.toLocaleString('id-ID'); }

function isGroupAllowed(jid) {
  if (!config.whitelistGroup?.enabled) return true;
  if (!config.whitelistGroup.groups?.length) return false;
  return config.whitelistGroup.groups.includes(jid);
}

function checkSpam(senderJid) {
  if (!config.antiSpam) return { spam: false };
  const now = Date.now();
  const u = spamTracker[senderJid] || { count: 0, firstMsg: now, warned: 0, mutedUntil: 0, notified: 0 };
  if (u.mutedUntil > now) return { spam: true, muted: true, sisa: Math.ceil((u.mutedUntil - now) / 1000) };
  if (now - u.firstMsg > config.spamInterval) { u.count = 0; u.firstMsg = now; u.warned = 0; }
  u.count++;
  if (u.count > config.spamLimit) {
    u.warned++;
    if (u.warned >= config.warningBeforeMute) {
      u.mutedUntil = now + config.spamMuteDuration;
      spamTracker[senderJid] = u;
      return { spam: true, muted: true, sisa: Math.ceil(config.spamMuteDuration / 1000) };
    }
    spamTracker[senderJid] = u;
    return { spam: true, muted: false, warned: u.warned };
  }
  spamTracker[senderJid] = u;
  return { spam: false };
}

module.exports = {
  isOwner, isSenderOwner, isGroup, random, formatMoney,
  isGroupAllowed, checkSpam, spamTracker,
};