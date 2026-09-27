const fs = require('fs');
const path = require('path');
const config = require('../config');
const CONFIG_PATH = path.join(__dirname, '..', 'config.js');

function readConfigRaw() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) return null;
    return fs.readFileSync(CONFIG_PATH, 'utf-8');
  } catch { return null; }
}
function updateConfigKey(key, value) {
  try {
    let content = fs.readFileSync(CONFIG_PATH, 'utf-8');
    let formattedValue;
    if (value === 'true' || value === 'false') formattedValue = value;
    else if (!isNaN(value) && value !== '') formattedValue = value;
    else formattedValue = `'${String(value).replace(/'/g, "\\'")}'`;
    const regex = new RegExp(`^(\\s{2}${key}\\s*:\\s*)([^,\\n}]+)(,?)`, 'm');
    if (!regex.test(content)) return { success: false, error: `Key "${key}" tidak ditemukan` };
    content = content.replace(regex, `$1${formattedValue}$3`);
    fs.writeFileSync(CONFIG_PATH, content, 'utf-8');
    return { success: true };
  } catch (err) { return { success: false, error: err.message }; }
}
function readConfigKey(key) {
  try {
    const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const regex = new RegExp(`^\\s{2}${key}\\s*:\\s*([^,\\n}]+)`, 'm');
    const match = content.match(regex);
    if (!match) return null;
    return match[1].trim().replace(/^['"]|['"]$/g, '');
  } catch { return null; }
}
function listConfigKeys() {
  try {
    const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const regex = /^\s{2}([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
    const keys = [];
    let match;
    while ((match = regex.exec(content)) !== null) keys.push(match[1]);
    return [...new Set(keys)];
  } catch { return []; }
}
function reloadConfig() {
  try {
    delete require.cache[require.resolve('../config')];
    const newConfig = require('../config');
    Object.keys(newConfig).forEach(k => { config[k] = newConfig[k]; });
    return { success: true };
  } catch (err) { return { success: false, error: err.message }; }
}

module.exports = { readConfigRaw, updateConfigKey, readConfigKey, listConfigKeys, reloadConfig, CONFIG_PATH };