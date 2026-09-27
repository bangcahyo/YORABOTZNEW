const { getUser, updateUser } = require('./database');
const config = require('../config');

function getLevelFromExp(exp) {
  return Math.floor(Math.sqrt(exp / 100)) + 1;
}
function getExpForLevel(level) {
  return Math.pow(level - 1, 2) * 100;
}
function getExpProgress(exp) {
  const level = getLevelFromExp(exp);
  const currentLevelExp = getExpForLevel(level);
  const nextLevelExp = getExpForLevel(level + 1);
  const progressExp = exp - currentLevelExp;
  const neededExp = nextLevelExp - currentLevelExp;
  const percent = Math.floor((progressExp / neededExp) * 100);
  return { level, progressExp, neededExp, percent, nextLevelExp };
}
function addExp(jid) {
  if (!config.levelSystem || !config.levelSystem.enabled) return null;
  const u = getUser(jid);
  const now = Date.now();
  const cooldown = config.levelSystem.expCooldown || 30000;
  if (u.lastExpGain && now - u.lastExpGain < cooldown) return null;
  const oldLevel = getLevelFromExp(u.exp || 0);
  const newExp = (u.exp || 0) + config.levelSystem.expPerMessage;
  const newLevel = getLevelFromExp(newExp);
  updateUser(jid, { exp: newExp, lastExpGain: now });
  if (newLevel > oldLevel && newLevel <= (config.levelSystem.maxLevel || 100)) {
    const reward = config.levelSystem.rewardPerLevelUp || {};
    const updates = {};
    if (reward.money) updates.money = (u.money || 0) + reward.money;
    if (reward.point) updates.point = (u.point || 0) + reward.point;
    if (reward.limit) updates.limit = (u.limit || 0) + reward.limit;
    if (Object.keys(updates).length > 0) updateUser(jid, updates);
    return { oldLevel, newLevel, reward };
  }
  return null;
}

module.exports = { getLevelFromExp, getExpForLevel, getExpProgress, addExp };