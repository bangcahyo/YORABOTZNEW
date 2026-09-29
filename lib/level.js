const { getUser, updateUser } = require('./database');
const config = require('../config');

function getLevelFromExp(exp) { return Math.floor(Math.sqrt(exp / 100)) + 1; }
function getExpForLevel(level) { return Math.pow(level - 1, 2) * 100; }
function getExpProgress(exp) {
  const level = getLevelFromExp(exp);
  const cur = getExpForLevel(level);
  const nxt = getExpForLevel(level + 1);
  const prog = exp - cur;
  const need = nxt - cur;
  const percent = Math.floor((prog / need) * 100);
  return { level, progressExp: prog, neededExp: need, percent, nextLevelExp: nxt };
}
function addExp(jid) {
  if (!config.levelSystem?.enabled) return null;
  const u = getUser(jid);
  const now = Date.now();
  if (u.lastExpGain && now - u.lastExpGain < (config.levelSystem.expCooldown || 30000)) return null;
  const oldL = getLevelFromExp(u.exp || 0);
  const newExp = (u.exp || 0) + config.levelSystem.expPerMessage;
  const newL = getLevelFromExp(newExp);
  updateUser(jid, { exp: newExp, lastExpGain: now });
  if (newL > oldL && newL <= (config.levelSystem.maxLevel || 100)) {
    const r = config.levelSystem.rewardPerLevelUp || {};
    const upd = {};
    if (r.money) upd.money = (u.money || 0) + r.money;
    if (r.point) upd.point = (u.point || 0) + r.point;
    if (r.limit) upd.limit = (u.limit || 0) + r.limit;
    if (Object.keys(upd).length) updateUser(jid, upd);
    return { oldLevel: oldL, newLevel: newL, reward: r };
  }
  return null;
}
module.exports = { getLevelFromExp, getExpForLevel, getExpProgress, addExp };