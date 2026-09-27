// ============================================================
//   YORA BOTZ v4.0 - PLUGIN ARCHITECTURE
//   Owner: Cahyo Store (08139525985)
// ============================================================

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  getContentType,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// ==================== LOAD LIB ====================
const database = require('./lib/database');
const helper = require('./lib/helper');
const level = require('./lib/level');
const sender = require('./lib/sender');

const {
  getUser, updateUser, loadDB, saveDB,
  loadGroups, saveGroups, getGroupSettings, updateGroupSettings,
  loadMode, saveMode,
} = database;

const {
  isOwner, isSenderOwner, isGroup, random, formatMoney,
  isGroupAllowed, checkSpam, spamTracker,
} = helper;

config.botMode = loadMode();

// ==================== GAME STATE ====================
const gameState = {};
const gameTimers = {};

function setGameTimeout(roomId, onTimeout) {
  clearGameTimeout(roomId);
  gameTimers[roomId] = setTimeout(async () => {
    if (gameState[roomId]) {
      try { await onTimeout(); } catch {}
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

// ==================== LOAD PLUGINS ====================
const plugins = new Map();       // command → plugin
const pluginList = [];           // daftar semua plugin
const categoryList = {};         // kategori → jumlah

function loadPlugins() {
  const pluginDir = path.join(__dirname, 'plugins');
  if (!fs.existsSync(pluginDir)) {
    console.log('⚠️ Folder plugins/ tidak ada!');
    return;
  }

  const categories = fs.readdirSync(pluginDir).filter(f => 
    fs.statSync(path.join(pluginDir, f)).isDirectory()
  );

  for (const category of categories) {
    const categoryPath = path.join(pluginDir, category);
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

    let count = 0;
    for (const file of files) {
      try {
        const plugin = require(path.join(categoryPath, file));
        if (!plugin.name || !plugin.execute) {
          console.log(`  ⚠️ Skip ${category}/${file}: format tidak valid`);
          continue;
        }

        plugin.category = plugin.category || category;
        plugin.aliases = plugin.aliases || [];
        pluginList.push(plugin);

        // Daftarkan nama utama
        plugins.set(plugin.name.toLowerCase(), plugin);

        // Daftarkan alias
        for (const alias of plugin.aliases) {
          plugins.set(alias.toLowerCase(), plugin);
        }
        count++;
      } catch (err) {
        console.log(`  ❌ Error load ${category}/${file}: ${err.message}`);
      }
    }
    categoryList[category] = count;
  }

  console.log('\n╔══════════════════════════════════════╗');
  console.log('║      📦 PLUGINS BERHASIL DIMUAT       ║');
  console.log('╚══════════════════════════════════════╝');
  for (const [cat, count] of Object.entries(categoryList)) {
    console.log(`  📁 ${cat.padEnd(10)} : ${count} plugin`);
  }
  console.log(`  📊 Total    : ${pluginList.length} plugin\n`);
}
loadPlugins();

// ==================== CONTEXT UNTUK PLUGIN ====================
function buildContext(sock, msg, args) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participant || msg.key.remoteJid;
  const senderNumber = sender.split('@')[0].replace(/[^0-9]/g, '');
  const pushName = msg.pushName || 'User';
  const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const user = getUser(sender);

  return {
    config,
    from,
    sender,
    senderNumber,
    pushName,
    mentioned,
    user,
    args,
    msg,
    sock,
    // Functions
    getUser,
    updateUser,
    loadDB,
    saveDB,
    loadGroups,
    getGroupSettings,
    updateGroupSettings,
    saveMode,
    isOwner,
    isSenderOwner: () => isSenderOwner(msg, sender),
    isGroup,
    isGroupAllowed,
    random,
    formatMoney,
    checkSpam,
    // Game state
    gameState,
    gameTimers,
    setGameTimeout,
    clearGameTimeout,
    // Level
    ...level,
    // Sender
    sendVoiceNote: sender.sendVoiceNote,
    sendImageCaption: sender.sendImageCaption,
  };
}

// ==================== SESSION CHECK ====================
function checkSessionExists() {
  try {
    const SESSION_PATH = path.join(__dirname, config.sessionName);
    const credsPath = path.join(SESSION_PATH, 'creds.json');
    if (fs.existsSync(credsPath)) {
      const creds = JSON.parse(fs.readFileSync(credsPath, 'utf-8'));
      if (creds.me && creds.me.id) return { exists: true, registered: true, me: creds.me.id };
      return { exists: true, registered: false, me: null };
    }
    return { exists: false, registered: false, me: null };
  } catch {
    return { exists: false, registered: false, me: null };
  }
}

// ==================== MAIN BOT ====================
async function startBot() {
  const SESSION_PATH = path.join(__dirname, config.sessionName);
  const sessionInfo = checkSessionExists();

  if (sessionInfo.registered) {
    console.log('\n╔══════════════════════════════════════╗');
    console.log('║   📁 SESSION DITEMUKAN & VALID       ║');
    console.log('╚══════════════════════════════════════╝');
    console.log(`✅ Bot sudah pernah login: ${sessionInfo.me}`);
    console.log('🚀 Tidak perlu pairing, langsung connect...\n');
  } else if (sessionInfo.exists) {
    console.log('\n⚠️ Session ada tapi belum terdaftar.\n');
  } else {
    console.log('\n📭 Belum ada session. Akan minta pairing code.\n');
  }

  const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state,
    browser: ['Mac OS', 'Chrome', '14.4.1'],
    getMessage: async () => ({ conversation: '' }),
    syncFullHistory: false,
    markOnlineOnConnect: true,
  });

  sock.ev.on('creds.update', async () => {
    try { await saveCreds(); console.log('💾 Session tersimpan'); } catch {}
  });

  // ==================== PAIRING CODE ====================
  if (!sock.authState.creds.registered) {
    console.log('╔══════════════════════════════════════╗');
    console.log('║   🔐 PAIRING CODE WHATSAPP BOT       ║');
    console.log('╚══════════════════════════════════════╝\n');

    let phoneNumber = String(config.botNumber).replace(/[^0-9]/g, '');
    if (phoneNumber.startsWith('0')) phoneNumber = '62' + phoneNumber.slice(1);

    if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
      console.error('❌ Nomor bot tidak valid!');
      process.exit(1);
    }

    let codeRequested = false;
    const requestCode = async () => {
      try {
        const pairingCode = await sock.requestPairingCode(phoneNumber);
        const formatted = pairingCode.match(/.{1,4}/g)?.join('-') || pairingCode;
        console.log(`\n   📱 Nomor Bot : ${phoneNumber}`);
        console.log(`   🔑 Kode      : ${formatted}\n`);
        console.log('📌 Masukkan kode ke WhatsApp (tanpa tanda -)\n');
      } catch (err) {
        console.error('❌ Gagal:', err.message);
      }
    };
    const listener = (update) => {
      if (update.connection === 'connecting' && !codeRequested) {
        codeRequested = true;
        sock.ev.off('connection.update', listener);
        setTimeout(requestCode, 3000);
      }
    };
    sock.ev.on('connection.update', listener);
  }

  // ==================== CONNECTION ====================
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (statusCode === DisconnectReason.loggedOut) {
        try { fs.rmSync(SESSION_PATH, { recursive: true, force: true }); } catch {}
        process.exit(0);
      } else {
        console.log(`🔄 Reconnect dalam 5 detik (${statusCode})...`);
        setTimeout(() => startBot(), 5000);
      }
    } else if (connection === 'open') {
      console.log('\n╔══════════════════════════════════════╗');
      console.log('║      ✅ BOT BERHASIL TERHUBUNG!       ║');
      console.log('╚══════════════════════════════════════╝');
      console.log(`🤖 Bot      : ${config.botName}`);
      console.log(`📞 Nomor    : ${config.botNumber}`);
      console.log(`📌 Mode     : ${config.botMode.toUpperCase()}`);
      console.log(`📦 Plugins  : ${pluginList.length}`);
      console.log('════════════════════════════════════════\n');
    }
  });

  // ==================== GROUP PARTICIPANTS ====================
  sock.ev.on('group-participants.update', async (update) => {
    try {
      const { id, participants, action } = update;
      const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const botWasAdded = participants.some(p => p === botJid);

      if (action === 'add' && botWasAdded) {
        if (!isGroupAllowed(id)) {
          let groupName = 'Grup';
          try { const gm = await sock.groupMetadata(id); groupName = gm.subject; } catch {}
          try {
            await sock.sendMessage(id, {
              text: `❌ *AKSES DITOLAK*\n\nBot ini hanya untuk grup resmi.\n\nOwner: ${config.ownerNumber}\n\nBot akan keluar dalam 5 detik...`,
            });
            await new Promise(r => setTimeout(r, 5000));
          } catch {}
          try {
            await sock.groupLeave(id);
            try {
              await sock.sendMessage(config.ownerNumber + '@s.whatsapp.net', {
                text: `🔔 Bot keluar dari grup non-whitelist:\n${groupName}\nID: ${id}`,
              });
            } catch {}
          } catch {}
        }
      }

      const groupSettings = getGroupSettings(id);
      let groupName = '';
      try { const gm = await sock.groupMetadata(id); groupName = gm.subject; } catch { return; }

      for (const participant of participants) {
        if (participant === botJid) continue;
        const p = participant.split('@')[0];
        if (action === 'add' && groupSettings.welcome) {
          const teks = groupSettings.welcomeText.replace('@user', `@${p}`).replace('@group', groupName);
          await sock.sendMessage(id, { text: `👋 *WELCOME*\n\n${teks}`, mentions: [participant] });
        } else if (action === 'remove' && groupSettings.welcome) {
          const teks = groupSettings.goodbyeText.replace('@user', `@${p}`).replace('@group', groupName);
          await sock.sendMessage(id, { text: `👋 *GOODBYE*\n\n${teks}`, mentions: [participant] });
        }
      }
    } catch (e) { console.error('Group update error:', e.message); }
  });

  // ==================== MESSAGES ====================
  sock.ev.on('messages.upsert', async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg.message) return;
      if (msg.key.fromMe) return;

      const from = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const senderNumber = sender.split('@')[0].replace(/[^0-9]/g, '');
      const type = getContentType(msg.message);

      let text = '';
      if (type === 'conversation') text = msg.message.conversation;
      else if (type === 'extendedTextMessage') text = msg.message.extendedTextMessage.text;
      else if (type === 'imageMessage') text = msg.message.imageMessage.caption || '';
      else if (type === 'videoMessage') text = msg.message.videoMessage.caption || '';
      if (!text) return;

      // Mode self check
      if (config.botMode === 'self' && !isSenderOwner(msg, sender)) return;

      // Anti-link
      if (isGroup(from)) {
        const gs = getGroupSettings(from);
        if (gs.antilink) {
          const linkRegex = /(https?:\/\/[^\s]+|wa\.me\/[^\s]+|chat\.whatsapp\.com\/[^\s]+)/gi;
          if (linkRegex.test(text)) {
            const gm = await sock.groupMetadata(from);
            const isAdmin = gm.participants.find((p) => p.id === sender)?.admin;
            if (!isAdmin && !isSenderOwner(msg, sender)) {
              try { await sock.sendMessage(from, { delete: msg.key }); } catch {}
              await sock.sendMessage(from, {
                text: `⚠️ *ANTI-LINK*\n\n@${senderNumber} mengirim link!`,
                mentions: [sender],
              });
              return;
            }
          }
        }
      }

      // Anti-spam
      if (isGroup(from) && !isSenderOwner(msg, sender)) {
        const spamCheck = checkSpam(sender);
        if (spamCheck.spam) {
          try { await sock.sendMessage(from, { delete: msg.key }); } catch {}
          if (spamCheck.muted) {
            if (!spamTracker[sender]?.notified || Date.now() - spamTracker[sender].notified > 30000) {
              spamTracker[sender].notified = Date.now();
              await sock.sendMessage(from, {
                text: `🚫 *ANTI-SPAM*\n\n@${senderNumber} di-mute *${spamCheck.sisa} detik*!`,
                mentions: [sender],
              });
            }
          } else {
            await sock.sendMessage(from, {
              text: `⚠️ *PERINGATAN* (${spamCheck.warned}/${config.warningBeforeMute})\n\n@${senderNumber}, jangan spam!`,
              mentions: [sender],
            });
          }
          return;
        }
      }

      // Random question (tanpa prefix)
      if (!text.startsWith(config.prefix)) {
        const lower = text.toLowerCase();
        const randoms = [
          { keys: ['kapankah aku menikah','kapan aku menikah','kapan nikah'], ans: ['💍 Ramalan: *2 tahun lagi* nih!','💍 Kamu akan menikah *tahun depan*!','💍 Sabar ya, *3-5 tahun* lagi!'] },
          { keys: ['akankah aku','apakah aku akan','apakah aku bisa'], ans: ['🔮 *Ya, kemungkinan besar bisa!*','🔮 *Tergantung usahamu.* Rajin, pasti tercapai!','🔮 *Peluangnya 50:50.*'] },
          { keys: ['apakah dia suka aku','dia suka aku gak'], ans: ['❤️ *Dia diam-diam memperhatikanmu.*','❤️ *Sinyal cinta belum jelas.* Tanya langsung!','❤️ *Peluang 70% dia suka kamu.* Tembak aja!'] },
          { keys: ['ramalan','zodiak','nasib'], ans: ['🌟 *Bintangmu berkata:* hari ini penuh keberuntungan!','🌟 *Energi positif* sedang mengelilingimu.'] },
        ];
        for (const q of randoms) {
          if (q.keys.some((k) => lower.includes(k))) {
            await sock.sendMessage(from, { text: random(q.ans) }, { quoted: msg });
            return;
          }
        }
        return;
      }

      // Parse command
      const args = text.slice(config.prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();

      // Level system
      if (config.levelSystem?.enabled && isGroup(from)) {
        const levelResult = level.addExp(sender);
        if (levelResult) {
          const r = levelResult.reward || {};
          let rewardText = '';
          if (r.money) rewardText += `💰 +${formatMoney(r.money)}\n`;
          if (r.point) rewardText += `⭐ +${r.point} Point\n`;
          if (r.limit) rewardText += `🎫 +${r.limit} Limit\n`;
          await sock.sendMessage(from, {
            text: `🎉 *LEVEL UP!*\n\nSelamat @${senderNumber}!\n\n📊 Level: *${levelResult.oldLevel}* → *${levelResult.newLevel}*\n\n🎁 Hadiah:\n${rewardText}`,
            mentions: [sender],
          });
        }
      }

      // Cari plugin
      const plugin = plugins.get(command);
      if (!plugin) return; // Command tidak dikenal

      // Limit check
      const user = getUser(sender);
      const isOwnerUser = isSenderOwner(msg, sender);
      const noLimitCategories = ['menu', 'info', 'owner', 'level', 'group'];
      const noLimitCommands = ['menu','help','profile','profil','owner','limit','point','uang','daily','shop','level','lvl','rank','leaderboard','tqto','backup','restore','showconfig','getcfg','setcfg','toggle','reloadcfg','readfile','listfiles','nyerah'];

      if (!noLimitCommands.includes(command) && !isOwnerUser && !noLimitCategories.includes(plugin.category)) {
        if (user.limit <= 0) {
          return sock.sendMessage(from, {
            text: `⚠️ *Limit habis!*\n\nTunggu reset besok atau hubungi owner.\n\n👑 ${config.ownerName}\n📞 ${config.ownerNumber}`,
          }, { quoted: msg });
        }
        updateUser(sender, { limit: user.limit - 1 });
      }

      // Execute plugin
      const ctx = buildContext(sock, msg, args);
      try {
        await plugin.execute(sock, msg, args, ctx);
      } catch (err) {
        console.error(`❌ Error plugin "${plugin.name}":`, err.message);
        await sock.sendMessage(from, { text: `❌ Terjadi error di command *${command}*` }, { quoted: msg });
      }

    } catch (err) {
      console.error('❌ Error handler:', err.message);
    }
  });
}

// ==================== START ====================
startBot().catch((err) => {
  console.error('❌ Fatal Error:', err);
  process.exit(1);
});