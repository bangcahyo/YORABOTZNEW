const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const config = require('../config');
const { getCommandPolicy } = require('../lib/command-policy');
const premium = require('../lib/premium');

const pluginRoot = path.join(__dirname, '..', 'plugins');

function loadPlugins() {
  const plugins = new Map();
  const pluginList = [];

  for (const category of fs.readdirSync(pluginRoot).sort()) {
    const categoryPath = path.join(pluginRoot, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    for (const file of fs.readdirSync(categoryPath).sort()) {
      if (!file.endsWith('.js')) continue;
      const plugin = require(path.join(categoryPath, file));
      assert.equal(typeof plugin.name, 'string', `${category}/${file} must define a command name`);
      assert.equal(typeof plugin.execute, 'function', `${category}/${file} must define execute`);
      plugin.category ||= category;
      plugin.aliases ||= [];
      pluginList.push(plugin);
    }
  }

  for (const plugin of pluginList) {
    const name = plugin.name.toLowerCase();
    assert.equal(plugins.has(name), false, `duplicate command name: ${name}`);
    plugins.set(name, plugin);
  }

  for (const plugin of pluginList) {
    for (const alias of plugin.aliases) {
      const key = String(alias).toLowerCase();
      if (!plugins.has(key)) plugins.set(key, plugin);
    }
  }

  return { plugins, pluginList };
}

const loaded = loadPlugins();
const noLimitCommands = ['menu', 'commands', 'shop'];
const policyFor = command => getCommandPolicy(
  command,
  loaded.plugins,
  name => config.limitCost[name] ?? config.limitCost.default,
  noLimitCommands,
  premium.isPremiumOnly,
);

test('all loaded canonical plugin commands appear in the generated command list', async () => {
  let response;
  await loaded.plugins.get('commands').execute(
    { sendMessage: async (_jid, message) => { response = message.text; } },
    {},
    [],
    { config, from: 'test@s.whatsapp.net', pluginList: loaded.pluginList },
  );

  assert.ok(response.includes(`Total plugin command: *${loaded.pluginList.length}*`));
  for (const plugin of loaded.pluginList) {
    assert.ok(response.includes(`${config.prefix}${plugin.name}`), `missing ${plugin.name}`);
  }
});

test('premium and limit policy use canonical commands for downloader aliases', () => {
  for (const alias of ['yt', 'ytmp4', 'youtube']) {
    const policy = policyFor(alias);
    assert.equal(policy.canonicalCommand, 'youtube');
    assert.equal(policy.isPremiumOnly, true);
    assert.equal(policy.limitCost, 3);
    assert.equal(policy.isFree, false);
  }

  for (const alias of ['tt', 'tiktok']) {
    const policy = policyFor(alias);
    assert.equal(policy.canonicalCommand, 'tiktok');
    assert.equal(policy.isPremiumOnly, true);
    assert.equal(policy.limitCost, 3);
  }

  for (const alias of ['ig', 'igdl', 'instagram']) {
    const policy = policyFor(alias);
    assert.equal(policy.canonicalCommand, 'instagram');
    assert.equal(policy.isPremiumOnly, true);
    assert.equal(policy.limitCost, 3);
  }

  assert.equal(policyFor('emix').isPremiumOnly, true);
});

test('unknown commands remain free and game/fun plugins do not cost limit', () => {
  assert.equal(policyFor('not-a-command').isFree, true);
  assert.equal(policyFor('quiz').isFree, true);
  assert.equal(policyFor('quote').isFree, true);
});

test('premium-only commands become available when Premium is disabled globally', () => {
  const previous = config.premium.enabled;
  config.premium.enabled = false;
  try {
    assert.equal(premium.isPremiumOnly('youtube'), false);
  } finally {
    config.premium.enabled = previous;
  }
});
