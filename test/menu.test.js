const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const config = require('../config');
const { loadVoiceMessage, renderMenu } = require('../lib/menu-layout');

const hasFfmpeg = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;
const pluginRoot = path.join(__dirname, '..', 'plugins');
const commandNames = new Set();

function createSilentWav() {
  const sampleRate = 8000;
  const sampleCount = sampleRate;
  const data = Buffer.alloc(sampleCount * 2);
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

for (const category of fs.readdirSync(pluginRoot)) {
  const categoryPath = path.join(pluginRoot, category);
  if (!fs.statSync(categoryPath).isDirectory()) continue;

  for (const file of fs.readdirSync(categoryPath)) {
    if (!file.endsWith('.js')) continue;
    const plugin = require(path.join(categoryPath, file));
    commandNames.add(String(plugin.name).toLowerCase());
    for (const alias of plugin.aliases || []) commandNames.add(String(alias).toLowerCase());
  }
}

const menuDirectory = path.join(pluginRoot, 'menu');
const menuPlugins = fs.readdirSync(menuDirectory)
  .filter(file => file.endsWith('.js'))
  .map(file => require(path.join(menuDirectory, file)));
const loadedPlugins = [];

for (const category of fs.readdirSync(pluginRoot)) {
  const categoryPath = path.join(pluginRoot, category);
  if (!fs.statSync(categoryPath).isDirectory()) continue;
  for (const file of fs.readdirSync(categoryPath)) {
    if (file.endsWith('.js')) loadedPlugins.push(require(path.join(categoryPath, file)));
  }
}

const menuCategories = {
  menugame: ['game'],
  menufun: ['fun'],
  menuekonomi: ['ekonomi'],
  menulevel: ['level'],
  menugroup: ['group'],
  menutools: ['tools', 'sticker', 'download'],
  menuowner: ['owner'],
};

const escapedPrefix = config.prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('main menu greeting follows the configured timezone', async () => {
  const menuPlugin = menuPlugins.find(plugin => plugin.name === 'menu');
  const OriginalDate = global.Date;
  const originalRandom = Math.random;
  const fixedInstant = OriginalDate.parse('2026-10-03T16:30:00.000Z');
  global.Date = class extends OriginalDate {
    constructor(...args) {
      super(...(args.length ? args : [fixedInstant]));
    }
    static now() { return fixedInstant; }
  };
  Math.random = () => 0.6;

  try {
    let response;
    const testConfig = {
      ...config,
      autoBroadcast: { ...config.autoBroadcast, timezone: 'Asia/Jakarta' },
      sendMenuAs: 'text',
      menuImageUrl: '',
      voiceMenuUrl: '',
    };
    await menuPlugin.execute({
      sendMessage: async (_jid, message) => { response = message.text; },
    }, {}, [], {
      config: testConfig,
      from: 'test@g.us',
      user: { limit: 20, money: 1000, point: 0, exp: 0, registered: true },
      pushName: 'Pengguna',
      isSenderOwner: () => false,
      isPremium: () => false,
      loadDB: () => ({}),
    });

    assert.ok(response.includes('Selamat malam'));
  } finally {
    global.Date = OriginalDate;
    Math.random = originalRandom;
  }
});

test('photo enhancement commands stay split between sharp and ai paths', () => {
  const names = [...commandNames];
  assert.ok(names.includes('hd'), 'regular sharp hd command should be available');
  assert.ok(names.includes('hda') || names.includes('hdai'), 'separate AI-enhancement command should be available');
});

test('all menu pages render cleanly and list only registered commands', async () => {
  const testConfig = { ...config, sendMenuAs: 'text', menuImageUrl: '', voiceMenuUrl: '' };
  for (const plugin of menuPlugins) {
    let response;
    const sock = {
      sendMessage: async (_jid, message) => {
        response = message.text || message.caption;
      },
    };
    const ctx = {
      config: testConfig,
      from: 'test@g.us',
      user: { limit: 20, money: 1000, point: 0, exp: 0, registered: true },
      pushName: 'Pengguna',
      formatMoney: amount => `Rp ${amount}`,
      isSenderOwner: () => true,
      isPremium: () => false,
      isGroup: () => true,
      loadDB: () => ({}),
      pluginList: loadedPlugins,
    };

    await plugin.execute(sock, {}, [], ctx);

    assert.equal(typeof response, 'string', `${plugin.name} should send text`);
    assert.ok(!response.includes('\uFFFD'), `${plugin.name} contains a broken replacement character`);
    if (plugin.name === 'menu') assert.ok(response.includes(`${config.prefix}sc`), 'main menu should list .sc');
    for (const category of menuCategories[plugin.name] || []) {
      for (const command of loadedPlugins.filter(item => item.category === category)) {
        const names = [command.name, ...(command.aliases || [])];
        assert.ok(names.some(name => response.includes(`\`${config.prefix}${name}\``)),
          `${plugin.name} should list ${command.name}`);
      }
    }
    const listedCommands = [...response.matchAll(new RegExp(`(?:^|\\s)${escapedPrefix}([a-z][a-z0-9_-]*)`, 'gim'))]
      .map(match => match[1].toLowerCase());
    const unknownCommands = [...new Set(listedCommands.filter(name => !commandNames.has(name)))];
    assert.deepEqual(unknownCommands, [], `${plugin.name} lists unknown commands`);
  }
});

test('main menu sends its image before voice-note processing finishes', async () => {
  const menuPlugin = menuPlugins.find(plugin => plugin.name === 'menu');
  const originalFetch = global.fetch;
  const audio = createSilentWav();
  let finishFetch;
  let markImageSent;
  const fetchStarted = new Promise(resolve => {
    global.fetch = async () => {
      resolve();
      return new Promise(resolveFetch => { finishFetch = resolveFetch; });
    };
  });
  const imageSent = new Promise(resolve => { markImageSent = resolve; });
  const sentMessages = [];
  const testConfig = {
    ...config,
    sendMenuAs: 'both',
    voiceMenuUrl: 'https://files.example/menu.wav',
    menuImageUrl: 'https://files.example/menu.png',
  };
  const sock = {
    sendMessage: async (_jid, message) => {
      sentMessages.push(message);
      if (message.image) markImageSent();
    },
  };
  const ctx = {
    config: testConfig,
    from: 'test@g.us',
    user: { limit: 20, money: 1000, point: 0, exp: 0, registered: true },
    pushName: 'Pengguna',
    isSenderOwner: () => false,
    isPremium: () => false,
    loadDB: () => ({}),
  };

  try {
    const execution = menuPlugin.execute(sock, {}, [], ctx);
    await fetchStarted;
    const imageArrivedFirst = await Promise.race([
      imageSent.then(() => true),
      new Promise(resolve => setTimeout(() => resolve(false), 1000)),
    ]);
    assert.equal(imageArrivedFirst, true, 'menu image should not wait for voice conversion');

    finishFetch(new Response(audio, {
      status: 200,
      headers: { 'content-type': 'audio/wav', 'content-length': String(audio.length) },
    }));
    await execution;
    if (hasFfmpeg) {
      assert.ok(sentMessages.some(message => message.audio && message.ptt));
    } else {
      assert.ok(sentMessages.some(message => message.text?.includes('audio gagal dikirim')));
    }
  } finally {
    if (finishFetch) {
      finishFetch(new Response(audio, {
        status: 200,
        headers: { 'content-type': 'audio/wav', 'content-length': String(audio.length) },
      }));
    }
    global.fetch = originalFetch;
  }
});

test('shared menu layout separates the title, sections, and footer consistently', () => {
  const rendered = renderMenu({
    botName: 'Yora Botz',
    title: 'MENU UJI',
    prefix: '!',
    sections: [
      { icon: '📚', title: 'KATEGORI PERTAMA', items: ['!menu'] },
      { icon: '⚙️', title: 'KATEGORI KEDUA', items: ['!ping', '!help'] },
    ],
    footer: ['🅟 = Premium'],
  });
  const lines = rendered.split('\n');

  assert.equal(lines[0], '╭━━━━━━━━━━━━━━━━━━━━━━╮');
  assert.equal(lines[1], '│  ✨ *YORA BOTZ* ✨');
  assert.equal(lines[2], '│  _MENU UJI_');
  assert.equal(lines[3], '╰━━━━━━━━━━━━━━━━━━━━━━╯');
  assert.ok(lines.indexOf('╭─ 📚 *KATEGORI PERTAMA*') < lines.indexOf('╭─ ⚙️ *KATEGORI KEDUA*'));
  assert.ok(lines.some(line => line.includes('└ `!menu`')));
  assert.ok(lines.some(line => line.includes('├ `!ping`')));
  assert.ok(lines.includes('╭─ ✨ *KETERANGAN*'));
  assert.ok(lines.some(line => line.includes('🅟 = Premium')));
});

test('menu command styling does not alter website or WhatsApp URLs', () => {
  const rendered = renderMenu({
    botName: config.botName,
    title: 'MENU UJI',
    prefix: config.prefix,
    sections: [{
      icon: 'ℹ️',
      title: 'INFORMASI BOT',
      items: [
        `Situs: ${config.website}`,
        `Grup resmi: ${config.officialGroup.link}`,
        `${config.prefix}menu — menu utama`,
      ],
    }],
  });

  assert.ok(rendered.includes(`Situs: ${config.website}`));
  assert.ok(rendered.includes(`Grup resmi: ${config.officialGroup.link}`));
  assert.ok(rendered.includes(`\`${config.prefix}menu\` — menu utama`));
  assert.ok(!rendered.includes('netlify`'));
  assert.ok(!rendered.includes('chat`'));
});

test('menu audio is converted to an OGG/Opus WhatsApp voice note', { skip: !hasFfmpeg }, async () => {
  const originalFetch = global.fetch;
  const audio = createSilentWav();
  global.fetch = async () => new Response(audio, {
    status: 200,
    headers: { 'content-type': 'audio/wav', 'content-length': String(audio.length) },
  });

  try {
    const result = await loadVoiceMessage('https://files.example/menu-conversion-test.wav');
    assert.ok(Buffer.isBuffer(result.audio));
    assert.equal(result.audio.subarray(0, 4).toString(), 'OggS');
    assert.ok(result.audio.includes(Buffer.from('OpusHead')));
    assert.equal(result.mimetype, 'audio/ogg; codecs=opus');
    assert.equal(result.ptt, true);
  } finally {
    global.fetch = originalFetch;
  }
});

test('menu OGG/Opus audio skips conversion and is cached', async () => {
  const originalFetch = global.fetch;
  const oggOpus = Buffer.from('OggS test OpusHead');
  let fetchCount = 0;
  global.fetch = async () => {
    fetchCount++;
    return new Response(oggOpus, {
      status: 200,
      headers: { 'content-type': 'audio/ogg', 'content-length': String(oggOpus.length) },
    });
  };

  try {
    const url = 'https://files.example/menu-cache-test.ogg';
    const [first, second] = await Promise.all([
      loadVoiceMessage(url),
      loadVoiceMessage(url),
    ]);
    const cached = await loadVoiceMessage(url);

    assert.equal(fetchCount, 1);
    assert.ok(first.audio.equals(oggOpus));
    assert.strictEqual(first, second);
    assert.strictEqual(second, cached);
    assert.equal(first.ptt, true);
  } finally {
    global.fetch = originalFetch;
  }
});

test('menu voice audio rejects empty files and non-audio responses', async () => {
  const originalFetch = global.fetch;
  try {
    global.fetch = async () => new Response(null, {
      status: 200,
      headers: { 'content-type': 'audio/mpeg' },
    });
    await assert.rejects(loadVoiceMessage('https://files.example/empty.mp3'), /File voice menu kosong/);

    global.fetch = async () => new Response('not audio', {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
    await assert.rejects(loadVoiceMessage('https://files.example/error.mp3'), /tidak mengembalikan file audio/);
  } finally {
    global.fetch = originalFetch;
  }
});
