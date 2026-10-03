// ============================================================
//   YORA BOTZ v7.2.1
//   Owner: Cahyo Store (08139525985)
// ============================================================

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  getContentType,
  downloadMediaMessage,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// ============ LOAD LIB ============
const database = require('./lib/database');
const helper = require('./lib/helper');
const level = require('./lib/level');
const premiumLib = require('./lib/premium');
const { getCommandPolicy } = require('./lib/command-policy');

const getUser = database.getUser;
const updateUser = database.updateUser;
const loadDB = database.loadDB;
const saveDB = database.saveDB;
const loadGroups = database.loadGroups;
const saveGroups = database.saveGroups;
const getGroupSettings = database.getGroupSettings;
const updateGroupSettings = database.updateGroupSettings;
const loadMode = database.loadMode;
const saveMode = database.saveMode;

const isOwner = helper.isOwner;
const isSenderOwner = helper.isSenderOwner;
const isGroup = helper.isGroup;
const random = helper.random;
const formatMoney = helper.formatMoney;
const isGroupAllowed = helper.isGroupAllowed;
const checkSpam = helper.checkSpam;
const spamTracker = helper.spamTracker;

config.botMode = loadMode();

// ============ FOLDER ============
const folders = ['database', 'session', 'assets'];
folders.forEach(function(f) {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// ============ GAME STATE ============
const gameState = {};
const gameTimers = {};

function setGameTimeout(roomId, cb) {
  clearGameTimeout(roomId);
  gameTimers[roomId] = setTimeout(async function() {
    if (gameState[roomId]) {
      try { await cb(); } catch (e) {}
      delete gameState[roomId];
    }
    delete gameTimers[roomId];
  }, config.gameTimeout || 60000);
}

function clearGameTimeout(roomId) {
  if (gameTimers[roomId]) {
    clearTimeout(gameTimers[roomId]);
    delete gameTimers[roomId];
  }
}

// ============ LIMIT & PREMIUM HELPER ============
// Biaya limit sebuah command (0 = gratis)
function getLimitCost(command) {
  const costs = config.limitCost || {};
  if (Object.prototype.hasOwnProperty.call(costs, command)) return costs[command];
  return costs.default !== undefined ? costs.default : 1;
}

// Apakah command khusus premium
function isPremiumCommand(command) {
  return premiumLib.isPremiumOnly(command);
}

// Command yang TIDAK memotong limit (gratis / info / menu / owner)
const noLimitCommands = [
  'menu', 'help', 'menugame', 'menugames', 'menufun', 'menuhiburan',
  'menuekonomi', 'menueco', 'menulevel', 'menugroup', 'menuadmin',
  'menuowner', 'menuown', 'menutools', 'menudownload', 'menu',
  'runtime', 'uptime', 'rt', 'profile', 'profil',
  'owner', 'ownerku', 'own', 'info', 'botinfo',
  'mode', 'botmode', 'self', 'public', 'ping',
  'tqto', 'thanks', 'credit', 'fitur', 'features', 'commands',
  'daftar', 'register', 'reg',
  'limit', 'point', 'uang', 'money', 'daily', 'shop',
  'level', 'lvl', 'rank', 'peringkat', 'leaderboard', 'lb', 'top',
  'antilink', 'antispam', 'unmute', 'welcome', 'setwelcome', 'setgoodbye',
  'kick', 'promote', 'demote', 'tagall', 'groupinfo',
  'id', 'groupid', 'cekid',
  'addlimit', 'addmoney', 'addpoint', 'setlimit', 'setmoney', 'resetuser',
  'broadcast', 'backup', 'backupdb', 'restore', 'restoredb', 'restoreyes', 'restoreno',
  'getcfg', 'getconfig', 'setcfg', 'setconfig', 'reloadcfg', 'reloadconfig',
  'showconfig', 'showcfg', 'toggle', 'readfile', 'listfiles', 'ls',
  'savefile', 'sf', 'reloadplugins', 'reloadp', 'reload',
  'restartbot', 'restart', 'reboot', 'autobroadcast', 'ab', 'waktubc',
  'premium', 'prem', 'buypremium', 'addpremium', 'delpremium', 'listpremium', 'cekpremium',
  'nyerah', 'menyerah', 'giveup', 'skip',
];

// ============ LOAD PLUGINS ============
const plugins = new Map();
const pluginList = [];

function loadPlugins() {
  const dir = path.join(__dirname, 'plugins');
  if (!fs.existsSync(dir)) {
    console.log('⚠️ Folder plugins tidak ada');
    return { loaded: pluginList.length, failed: 1, applied: false };
  }

  const cats = fs.readdirSync(dir).sort().filter(function(f) {
    return fs.statSync(path.join(dir, f)).isDirectory();
  });

  console.log('\n╔══════════════════════════════════╗');
  console.log('║      📦 PLUGINS BERHASIL DIMUAT    ║');
  console.log('╚══════════════════════════════════╝');

  const loadedPlugins = [];
  const nextPlugins = new Map();
  const nextPluginList = [];
  let failed = 0;
  for (const cat of cats) {
    const catPath = path.join(dir, cat);
    const files = fs.readdirSync(catPath).sort().filter(function(f) {
      return f.endsWith('.js');
    });

    let count = 0;
    for (const file of files) {
      try {
        const fullPath = path.join(catPath, file);
        delete require.cache[require.resolve(fullPath)];
        const p = require(fullPath);
        if (!p || !p.name || typeof p.execute !== 'function') {
          failed++;
          console.log('  ❌ ' + cat + '/' + file + ': metadata plugin tidak valid');
          continue;
        }
        p.category = p.category || cat;
        p.aliases = p.aliases || [];
        nextPluginList.push(p);
        loadedPlugins.push({ plugin: p, file: cat + '/' + file });
        count++;
      } catch (err) {
        failed++;
        console.log('  ❌ ' + cat + '/' + file + ': ' + err.message);
      }
    }
    if (count > 0) {
      console.log('  📁 ' + cat.padEnd(10) + ' : ' + count + ' plugin');
    }
  }

  for (const { plugin, file } of loadedPlugins) {
    const name = plugin.name.toLowerCase();
    if (nextPlugins.has(name)) {
      failed++;
      console.error('  ❌ Nama command bentrok "' + name + '" di ' + file);
      continue;
    }
    nextPlugins.set(name, plugin);
  }

  for (const { plugin, file } of loadedPlugins) {
    const acceptedAliases = [];
    for (const alias of plugin.aliases) {
      const key = String(alias).toLowerCase();
      if (nextPlugins.has(key)) {
        const existing = nextPlugins.get(key);
        if (existing !== plugin) {
          console.error('  ⚠️ Alias "' + key + '" diabaikan (' + file + '), sudah dipakai command "' + existing.name + '"');
        }
        continue;
      }
      nextPlugins.set(key, plugin);
      acceptedAliases.push(alias);
    }
    plugin.aliases = acceptedAliases;
  }

  if (failed > 0 && pluginList.length > 0) {
    console.error('  ⚠️ Reload dibatalkan; daftar plugin aktif sebelumnya dipertahankan.');
    console.log('  📊 Total    : ' + pluginList.length + ' plugin aktif\n');
    return { loaded: pluginList.length, failed: failed, applied: false };
  }

  plugins.clear();
  for (const [name, plugin] of nextPlugins) plugins.set(name, plugin);
  pluginList.splice(0, pluginList.length, ...nextPluginList);
  console.log('  📊 Total    : ' + pluginList.length + ' plugin\n');
  return { loaded: pluginList.length, failed: failed, applied: true };
}

function levenshteinDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[a.length][b.length];
}

function findClosestCommand(input) {
  const keys = [...plugins.keys()];
  if (!keys.length) return [];
  const scored = keys.map((key) => ({ key, score: levenshteinDistance(input, key) })).filter((item) => item.score <= 3 || item.key.startsWith(input.slice(0, 2)));
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, 3).map((item) => item.key);
}

// ============ BUILD CONTEXT ============
function notifyOwner(sock, text) {
  try {
    if (config.ownerAlerts?.enabled === false) return false;
    const ownerJid = (config.ownerNumber || '').replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    if (!ownerJid || ownerJid === '@s.whatsapp.net') return false;
    sock.sendMessage(ownerJid, { text: text });
    return true;
  } catch (err) {
    console.error('❌ notifyOwner error: ' + err.message);
    return false;
  }
}

function buildContext(sock, msg, args) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participantAlt || msg.key.participant || msg.key.remoteJidAlt || msg.key.remoteJid;
  const senderNumber = sender.split('@')[0].replace(/[^0-9]/g, '');
  const pushName = msg.pushName || 'User';
  const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const user = getUser(sender);

  const ctx = {
    config: config,
    from: from,
    sender: sender,
    senderNumber: senderNumber,
    pushName: pushName,
    mentioned: mentioned,
    user: user,
    args: args,
    msg: msg,
    sock: sock,
    downloadMediaMessage: downloadMediaMessage,
    getUser: getUser,
    updateUser: updateUser,
    loadDB: loadDB,
    saveDB: saveDB,
    flushDatabase: database.flushDatabase,
    DB_PATH: path.join(__dirname, 'database', 'users.json'),
    GROUP_PATH: path.join(__dirname, 'database', 'groups.json'),
    MODE_PATH: path.join(__dirname, 'database', 'mode.json'),
    loadCommandStats: database.loadCommandStats,
    resetCommandStats: database.resetCommandStats,
    loadActivityLog: database.loadActivityLog,
    pushActivity: database.pushActivity,
    clearActivityLog: database.clearActivityLog,
    notifyOwner: function(text) {
      return notifyOwner(sock, text);
    },
    loadGroups: loadGroups,
    saveGroups: saveGroups,
    getGroupSettings: getGroupSettings,
    updateGroupSettings: updateGroupSettings,
    saveMode: saveMode,
    reloadDatabase: database.reloadDatabase,
    isOwner: isOwner,
    isSenderOwner: function() { return isSenderOwner(msg, sender); },
    isGroup: isGroup,
    isGroupAllowed: isGroupAllowed,
    random: random,
    formatMoney: formatMoney,
    checkSpam: checkSpam,
    spamTracker: spamTracker,
    gameState: gameState,
    gameTimers: gameTimers,
    setGameTimeout: setGameTimeout,
    clearGameTimeout: clearGameTimeout,
    getLevelFromExp: level.getLevelFromExp,
    getExpForLevel: level.getExpForLevel,
    getExpProgress: level.getExpProgress,
    addExp: level.addExp,
    // Premium 🅟
    isPremium: function() { return premiumLib.isPremium(user); },
    premiumRemainingDays: function() { return premiumLib.premiumRemainingDays(user); },
    addPremium: premiumLib.addPremium,
    removePremium: premiumLib.removePremium,
    listPremium: premiumLib.listPremium,
    formatDate: premiumLib.formatDate,
    isPremiumOnly: premiumLib.isPremiumOnly,
    premiumLib: premiumLib,
    // Limit 🅛
    getLimitCost: getLimitCost,
    noLimit: noLimitCommands,
    pluginList: pluginList,
    reloadPlugins: loadPlugins,
  };

  return ctx;
}

// ============ START BOT ============
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
  const { version } = await fetchLatestBaileysVersion();

  console.log('📡 Baileys version: ' + version.join('.'));

  const sock = makeWASocket({
    version: version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    syncFullHistory: false,
    markOnlineOnConnect: true,
    getMessage: async function() { return { conversation: '' }; },
  });

  sock.ev.on('creds.update', saveCreds);

  // ==================== PAIRING CODE ====================
  let codeRequested = false;

  sock.ev.on('connection.update', async function(update) {
    const connection = update.connection;
    const lastDisconnect = update.lastDisconnect;
    const qr = update.qr;

    if (qr && !sock.authState.creds.registered && !codeRequested) {
      codeRequested = true;

      console.log('\n╔══════════════════════════════════╗');
      console.log('║   🔐 PAIRING CODE BOT            ║');
      console.log('╚══════════════════════════════════╝\n');

      let phone = String(config.botNumber || '').replace(/[^0-9]/g, '');
      if (phone.startsWith('0')) phone = '62' + phone.slice(1);

      if (phone.length < 10 || phone.length > 15) {
        console.log('❌ Nomor bot tidak valid di config.js!');
        process.exit(1);
      }

      console.log('📞 Nomor bot: ' + phone);
      console.log('⏳ Tunggu 5 detik...\n');

      setTimeout(async function() {
        try {
          const code = await sock.requestPairingCode(phone);
          const fmt = code.match(/.{1,4}/g)?.join('-') || code;

          console.log('\n╔══════════════════════════════════╗');
          console.log('║   ✅ PAIRING CODE BERHASIL        ║');
          console.log('╚══════════════════════════════════╝');
          console.log('\n   📱 Nomor: ' + phone);
          console.log('   🔑 Kode : ' + fmt + '\n');
          console.log('══════════════════════════════════');
          console.log('📌 CARA PAKAI:');
          console.log('   1. Buka WhatsApp di HP nomor bot');
          console.log('   2. Pengaturan → Perangkat Tertaut');
          console.log('   3. Tautkan Perangkat');
          console.log('   4. Pilih "Tautkan dengan nomor telepon saja"');
          console.log('   5. Masukkan kode: ' + fmt);
          console.log('   ⏱️ Kode berlaku 60 detik\n');
        } catch (e) {
          console.log('❌ Gagal pairing: ' + e.message);
        }
      }, 5000);
    }

    if (connection === 'close') {
      // hentikan scheduler lama; akan dinyalakan lagi dengan socket baru saat 'open'
      try { require('./lib/autobroadcast').stopAutoBroadcast(); } catch (e) {}
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        const sp = path.join(__dirname, config.sessionName);
        if (fs.existsSync(sp)) fs.rmSync(sp, { recursive: true, force: true });
        try {
          await database.flushDatabase();
        } catch (err) {
          console.error('❌ Gagal menyimpan perubahan database sebelum keluar: ' + err.message);
        }
        process.exit(0);
      } else {
        console.log('🔄 Reconnect (code ' + code + ')...');
        setTimeout(function() { startBot(); }, 5000);
      }
    } else if (connection === 'open') {
      console.log('\n╔══════════════════════════════════╗');
      console.log('║   ✅ BOT BERHASIL TERHUBUNG!      ║');
      console.log('╚══════════════════════════════════╝');
      console.log('🤖 ' + config.botName);
      console.log('📞 ' + config.botNumber);
      console.log('📌 Mode: ' + config.botMode.toUpperCase());
      console.log('📦 Plugins: ' + pluginList.length + '\n');

      // Start auto broadcast
      try {
        const autobc = require('./lib/autobroadcast');
        autobc.startAutoBroadcast(sock);
      } catch (e) {
        console.log('⚠️ Auto broadcast tidak aktif: ' + e.message);
      }
    }
  });

  // ==================== GROUP EVENTS ====================
  sock.ev.on('group-participants.update', async function(update) {
    try {
      const id = update.id;
      const participants = update.participants;
      const action = update.action;

      const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const botAdded = participants.some(function(p) { return p === botJid; });

      if (action === 'add' && botAdded && !isGroupAllowed(id)) {
        let name = 'Grup';
        try {
          const meta = await sock.groupMetadata(id);
          name = meta.subject;
        } catch (e) {}

        try {
          await sock.sendMessage(id, {
            text: '❌ Bot hanya untuk grup resmi.\n\nOwner: ' + config.ownerNumber + '\n\nBot keluar dalam 5 detik...',
          });
          await new Promise(function(r) { setTimeout(r, 5000); });
        } catch (e) {}

        try { await sock.groupLeave(id); } catch (e) {}

        try {
          await sock.sendMessage(config.ownerNumber + '@s.whatsapp.net', {
            text: '🔔 Bot keluar dari grup non-whitelist:\n' + name + '\nID: ' + id,
          });
        } catch (e) {}
        return;
      }

      const gs = getGroupSettings(id);
      let groupName = '';
      try {
        const meta = await sock.groupMetadata(id);
        groupName = meta.subject;
      } catch (e) {
        return;
      }

      for (const p of participants) {
        if (p === botJid) continue;
        const num = p.split('@')[0];

        if (action === 'add' && gs.welcome) {
          const t = gs.welcomeText.replace('@user', '@' + num).replace('@group', groupName);
          await sock.sendMessage(id, { text: '👋 *WELCOME*\n\n' + t, mentions: [p] });
        } else if (action === 'remove' && gs.welcome) {
          const t = gs.goodbyeText.replace('@user', '@' + num).replace('@group', groupName);
          await sock.sendMessage(id, { text: '👋 *GOODBYE*\n\n' + t, mentions: [p] });
        }
      }
    } catch (e) {
      console.error('Group event: ' + e.message);
    }
  });

  // ==================== MESSAGES ====================
  sock.ev.on('messages.upsert', async function(m) {
    try {
      const msg = m.messages[0];
      if (!msg.message) return;
      if (msg.key.fromMe) return;

      const from = msg.key.remoteJid;
      const sender = msg.key.participantAlt || msg.key.participant || msg.key.remoteJidAlt || msg.key.remoteJid;
      const senderNumber = sender.split('@')[0].replace(/[^0-9]/g, '');
      const pushName = msg.pushName || 'User';
      const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const type = getContentType(msg.message);

      // SELF MODE
      if (config.botMode === 'self' && !isSenderOwner(msg, sender)) return;

      // ANTI-LINK
      if (isGroup(from)) {
        const gs = getGroupSettings(from);
        if (gs.antilink) {
          let textCek = '';
          if (type === 'conversation') textCek = msg.message.conversation;
          else if (type === 'extendedTextMessage') textCek = msg.message.extendedTextMessage.text || '';

          const linkRe = /(https?:\/\/[^\s]+|wa\.me\/[^\s]+|chat\.whatsapp\.com\/[^\s]+)/gi;
          if (textCek && linkRe.test(textCek)) {
            const gm = await sock.groupMetadata(from);
            const isAdmin = gm.participants.find(function(p) { return p.id === sender; })?.admin;
            if (!isAdmin && !isSenderOwner(msg, sender)) {
              try { await sock.sendMessage(from, { delete: msg.key }); } catch (e) {}
              await sock.sendMessage(from, {
                text: '⚠️ *ANTI-LINK*\n\n@' + senderNumber + ' mengirim link!',
                mentions: [sender],
              });
              return;
            }
          }
        }
      }

      // ANTI-SPAM
      if (isGroup(from) && !isSenderOwner(msg, sender)) {
        const sc = checkSpam(sender);
        if (sc.spam) {
          try { await sock.sendMessage(from, { delete: msg.key }); } catch (e) {}
          if (sc.muted) {
            if (!spamTracker[sender]?.notified || Date.now() - spamTracker[sender].notified > 30000) {
              spamTracker[sender].notified = Date.now();
              await sock.sendMessage(from, {
                text: '🚫 *ANTI-SPAM*\n\n@' + senderNumber + ' di-mute ' + sc.sisa + ' detik!',
                mentions: [sender],
              });
            }
          } else {
            await sock.sendMessage(from, {
              text: '⚠️ *PERINGATAN* (' + sc.warned + '/' + config.warningBeforeMute + ')\n\n@' + senderNumber + ', jangan spam!',
              mentions: [sender],
            });
          }
          return;
        }
      }

      // AMBIL TEXT
      let text = '';
      if (type === 'conversation') text = msg.message.conversation;
      else if (type === 'extendedTextMessage') text = msg.message.extendedTextMessage.text;
      else if (type === 'imageMessage') text = msg.message.imageMessage.caption || '';
      else if (type === 'videoMessage') text = msg.message.videoMessage.caption || '';

      // HANDLE BUTTON REPLY
      const btnId = msg.message?.buttonsResponseMessage?.selectedButtonId
        || msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId
        || msg.message?.templateButtonReplyMessage?.selectedId;
      if (btnId) text = config.prefix + btnId;

      if (!text) return;

      // AUTO-JAWAB GAME
      if (gameState[from] && gameState[from].sender === sender) {
        const g = gameState[from];
        const lower = text.trim().toLowerCase();

        // NYERAH
        if (lower === 'nyerah' || lower === 'menyerah' || lower === 'giveup' || lower === 'skip') {
          clearGameTimeout(from);
          let jawabanBenar = '';
          if (g.game === 'tebakangka') jawabanBenar = g.angka;
          else if (g.game === 'hangman') jawabanBenar = g.kata;
          else if (Array.isArray(g.jawab)) jawabanBenar = g.jawab[0];
          else if (g.jawab) jawabanBenar = g.jawab;

          delete gameState[from];
          await sock.sendMessage(from, {
            text: '🏳️ *NYERAH!*\n\nJawaban: *' + jawabanBenar + '*\n\n_Coba lagi kapan-kapan!_',
          });
          return;
        }

        // HANGMAN — 1 huruf
        if (g.game === 'hangman' && lower.length === 1 && /[a-z]/.test(lower)) {
          const huruf = lower;
          if (!g.tebakan.includes(huruf)) {
            g.tebakan.push(huruf);
            if (!g.kata.includes(huruf)) g.nyawa--;
            const tampil = g.kata.split('').map(function(c) {
              return g.tebakan.includes(c) ? c : '_';
            }).join(' ');
            const nyawaBar = '❤️'.repeat(g.nyawa) + '🖤'.repeat(6 - g.nyawa);

            if (g.nyawa <= 0) {
              clearGameTimeout(from);
              delete gameState[from];
              await sock.sendMessage(from, { text: '💀 *GAME OVER!*\nKata: *' + g.kata + '*' });
              return;
            }
            if (!tampil.includes('_')) {
              clearGameTimeout(from);
              const u = getUser(sender);
              updateUser(sender, { money: u.money + 1000, point: u.point + 5 });
              delete gameState[from];
              await sock.sendMessage(from, { text: '🎉 *MENANG!*\nKata: *' + g.kata + '*\n\n+Rp 1.000\n+5 Point' });
              return;
            }
            await sock.sendMessage(from, {
              text: '🎯 *HANGMAN*\n\nKata: ' + tampil + '\nNyawa: ' + nyawaBar + '\nHuruf: ' + g.tebakan.join(', '),
            });
            return;
          }
        }

        // CEK JAWABAN
        const accepted = Array.isArray(g.jawab) ? g.jawab : [g.jawab];
        const isCorrect = accepted.some(function(j) {
          const cleanJ = String(j).toLowerCase().trim();
          return lower === cleanJ || lower.includes(cleanJ);
        });

        if (isCorrect) {
          clearGameTimeout(from);
          const u = getUser(sender);
          const rewards = {
            tebakangka: [5, 500],
            quiz: [10, 1000],
            tebakkata: [3, 750],
            math: [2, 500],
            tebakemoji: [3, 800],
            hangman: [5, 1000],
            tebakibukota: [3, 700],
            tebakfilm: [4, 900],
            tebakpemainbola: [4, 900],
            tebaklagu: [4, 900],
            tebakgambar: [3, 800],
            tebakbendera: [3, 700],
            tebaksurah: [4, 900],
            tebakpresiden: [4, 900],
            tebakplanet: [3, 700],
            tebakanime: [4, 900],
            asahotak: [3, 700],
            siapakahaku: [3, 750],
            caklontong: [3, 800],
            lengkapikalimat: [3, 750],
            family100: [4, 900],
          };
          const rw = rewards[g.game] || [3, 500];
          updateUser(sender, { point: u.point + rw[0], money: u.money + rw[1] });
          delete gameState[from];
          await sock.sendMessage(from, {
            text: '🎉 *BENAR!*\n\n+' + rw[0] + ' Point\n+' + formatMoney(rw[1]),
          });
          return;
        }
      }

      // RANDOM QUESTION
      if (!text.startsWith(config.prefix)) {
        const lower = text.toLowerCase();
        const rq = [
          { keys: ['kapankah aku menikah', 'kapan aku menikah', 'kapan nikah'], ans: ['💍 *2 tahun lagi* nih!', '💍 Menikah *tahun depan*!', '💍 Sabar ya, *3-5 tahun*!'] },
          { keys: ['akankah aku', 'apakah aku akan', 'apakah aku bisa'], ans: ['🔮 *Ya, kemungkinan bisa!*', '🔮 *Tergantung usahamu.*', '🔮 *InsyaAllah bisa.*'] },
          { keys: ['apakah dia suka aku', 'dia suka aku gak'], ans: ['❤️ *Dia diam-diam suka kamu.*', '❤️ *Tanya langsung aja!*', '❤️ *Peluang 70%!*'] },
          { keys: ['ramalan', 'zodiak', 'nasib'], ans: ['🌟 *Hari ini penuh keberuntungan!*', '🌟 *Energi positif mengelilingimu.*'] },
        ];
        for (const q of rq) {
          if (q.keys.some(function(k) { return lower.includes(k); })) {
            await sock.sendMessage(from, { text: random(q.ans) });
            return;
          }
        }
        return;
      }

      // PARSE
      const args = text.slice(config.prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();
      const commandPolicy = getCommandPolicy(
        command,
        plugins,
        getLimitCost,
        noLimitCommands,
        isPremiumCommand,
      );
      const { plugin, canonicalCommand, limitCost, isFree } = commandPolicy;

      // LEVEL SYSTEM
      if (config.levelSystem?.enabled && isGroup(from)) {
        const res = level.addExp(sender);
        if (res) {
          const r = res.reward || {};
          let txt = '';
          if (r.money) txt += '💰 +' + formatMoney(r.money) + '\n';
          if (r.point) txt += '⭐ +' + r.point + ' Point\n';
          if (r.limit) txt += '🎫 +' + r.limit + ' Limit\n';
          await sock.sendMessage(from, {
            text: '🎉 *LEVEL UP!*\n\nSelamat @' + senderNumber + '!\n\n📊 Level: *' + res.oldLevel + '* → *' + res.newLevel + '*\n\n🎁 Hadiah:\n' + txt,
            mentions: [sender],
          });
        }
      }

      const user = getUser(sender);
      const ownerUser = isSenderOwner(msg, sender);
      const userPremium = premiumLib.isPremium(user);

      // REGISTRATION GATE
      if (config.registrationRequired) {
        const gateAllowed = [
          'menu', 'help', 'daftar', 'register', 'reg',
          'owner', 'ownerku', 'own', 'runtime', 'uptime', 'rt',
          'ping', 'botinfo', 'info', 'tqto', 'thanks', 'credit',
          'fitur', 'features', 'commands', 'premium', 'prem',
        ];

        if (!gateAllowed.includes(command) && !gateAllowed.includes(canonicalCommand) && !user.registered && !ownerUser) {
          return sock.sendMessage(from, {
            text: '╔══════════════════════════════════╗\n' +
              '║   🚫 *REGISTRATION REQUIRED*     ║\n' +
              '╚══════════════════════════════════╝\n\n' +
              '⚠️ Kamu *belum terdaftar*!\n\n' +
              '📝 Daftar dulu:\n\n' +
              '    *' + config.prefix + 'daftar <namamu>*\n\n' +
              'Contoh:\n' +
              '*' + config.prefix + 'daftar Cahyo Store*\n\n' +
              '━━━━━━━━━━━━━━━━━━━━━━\n\n' +
              '✅ *Keuntungan daftar:*\n' +
              '• Akses semua fitur bot\n' +
              '• Data tersimpan permanen\n' +
              '• Bisa main game & ekonomi\n\n' +
              '_' + config.botName + '_',
          });
        }
      }

      // PREMIUM-ONLY CHECK 🅟
      if (commandPolicy.isPremiumOnly && !userPremium && !ownerUser) {
        return sock.sendMessage(from, {
          text: '╔══════════════════════════════════╗\n' +
            '║      🅟 *FITUR PREMIUM*          ║\n' +
            '╚══════════════════════════════════╝\n\n' +
            '🔒 Command *' + config.prefix + command + '* hanya untuk *user premium*.\n\n' +
            '💎 Upgrade ke premium untuk membuka:\n' +
            '• Semua fitur download (YouTube, TikTok, IG)\n' +
            '• Limit harian lebih banyak (' + (config.premium?.dailyLimit || 100) + ')\n' +
            '• Hadiah daily & EXP berlipat\n' +
            '• Diskon shop ' + (config.premium?.shopDiscount || 20) + '%\n\n' +
            '📝 Ketik *' + config.prefix + 'premium* untuk info & cara beli.\n\n' +
            '_' + config.botName + '_',
        });
      }

      // LIMIT CHECK 🅛
      if (!isFree && !ownerUser && !userPremium && user.limit < limitCost) {
        return sock.sendMessage(from, {
          text: '⚠️ *Limit tidak cukup!*\n\n' +
            '🅛 Command *' + config.prefix + command + '* butuh *' + limitCost + ' limit*.\n' +
            '💳 Limit kamu: *' + user.limit + '*\n\n' +
            'Tunggu reset besok, beli premium, atau hubungi owner.\n\n' +
            '👑 ' + config.ownerName + '\n📞 ' + config.ownerNumber,
        });
      }

      if (!isFree && !ownerUser && !userPremium) {
        updateUser(sender, { limit: user.limit - limitCost, totalCommands: (user.totalCommands || 0) + 1 });
      } else if (!isFree && (ownerUser || userPremium)) {
        updateUser(sender, { totalCommands: (user.totalCommands || 0) + 1 });
      }

      // CARI PLUGIN
      if (!plugin) {
        const suggestions = findClosestCommand(command);
        const suggestionLine = suggestions.length ? '\nMungkin yang kamu maksud:\n' + suggestions.map((s) => '• *' + config.prefix + s + '*').join('\n') + '\n\n' : '';
        const helpText = '❓ *Command tidak dikenal*\n\n' +
          'Coba salah satu dari opsi berikut:\n\n' +
          '• *' + config.prefix + 'menu* — menu utama\n' +
          '• *' + config.prefix + 'tutorial* — panduan cepat\n' +
          '• *' + config.prefix + 'commands* — daftar semua command\n' +
          '• *' + config.prefix + 'premium* — info premium\n\n' +
          suggestionLine +
          'Jika butuh bantuan, kirim *' + config.prefix + 'help* atau hubungi owner.';
        try {
          database.pushActivity({
            type: 'unknown_command',
            command: command,
            user: sender,
            senderNumber: senderNumber,
            from: from,
            text: text || command,
            success: false,
          });
          if (config.ownerAlerts?.enabled !== false && config.ownerAlerts?.onUnknownCommand !== false) {
            notifyOwner(sock, '⚠️ Command tidak dikenal diterima\n' +
              'Command: *' + command + '*\n' +
              'Pengguna: *' + senderNumber + '*\n' +
              'Grup/Chat: *' + from + '*');
          }
        } catch (err) {
          console.error('❌ Gagal menyimpan log command tidak dikenal: ' + err.message);
        }
        await sock.sendMessage(from, { text: helpText }, { quoted: msg });
        return;
      }

      // EXECUTE
      const ctx = buildContext(sock, msg, args);
      try {
        await plugin.execute(sock, msg, args, ctx);
        if (plugin.name !== 'commandstats' && plugin.name !== 'activitylog') {
          try {
            database.recordCommandUsage(plugin.name);
            database.pushActivity({
              type: 'command',
              command: plugin.name,
              user: sender,
              senderNumber: senderNumber,
              from: from,
              text: text || plugin.name,
              success: true,
            });
          } catch (err) {
            console.error('❌ Gagal menyimpan statistik command: ' + err.message);
          }
        }
      } catch (err) {
        console.error('❌ Error plugin "' + plugin.name + '": ' + err.message);
      }

    } catch (err) {
      console.error('❌ Handler error: ' + err.message);
    }
  });
}

// ============ LOAD & START ============
loadPlugins();
startBot().catch(function(err) {
  console.error('❌ Fatal: ' + err);
  process.exit(1);
});