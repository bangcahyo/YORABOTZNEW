// ============================================================
//   YORA BOTZ v6.0 — Pairing Code Fixed
//   Baileys 6.7.24
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

// ============ FOLDER ============
['database', 'session', 'assets'].forEach(f => {
  const p = path.join(__dirname, f);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// ============ GAME STATE ============
const gameState = {};
const gameTimers = {};

function setGameTimeout(roomId, cb) {
  clearGameTimeout(roomId);
  gameTimers[roomId] = setTimeout(async () => {
    if (gameState[roomId]) {
      try { await cb(); } catch {}
      delete gameState[roomId];
    }
    delete gameTimers[roomId];
  }, config.gameTimeout || 60000);
}
function clearGameTimeout(roomId) {
  if (gameTimers[roomId]) { clearTimeout(gameTimers[roomId]); delete gameTimers[roomId]; }
}

// ============ LOAD PLUGINS ============
const plugins = new Map();
const pluginList = [];

function loadPlugins() {
  const dir = path.join(__dirname, 'plugins');
  if (!fs.existsSync(dir)) return console.log('⚠️ Folder plugins/ tidak ada');

  const cats = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
  console.log('\n╔══════════════════════════════════╗');
  console.log('║      📦 PLUGINS BERHASIL DIMUAT    ║');
  console.log('╚══════════════════════════════════╝');

  for (const cat of cats) {
    const catPath = path.join(dir, cat);
    const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'));
    let count = 0;
    for (const file of files) {
      try {
        delete require.cache[require.resolve(path.join(catPath, file))];
        const p = require(path.join(catPath, file));
        if (!p.name || !p.execute) continue;
        p.category = p.category || cat;
        p.aliases = p.aliases || [];
        pluginList.push(p);
        plugins.set(p.name.toLowerCase(), p);
        p.aliases.forEach(a => plugins.set(a.toLowerCase(), p));
        count++;
      } catch (err) {
        console.log(`  ❌ ${cat}/${file}: ${err.message}`);
      }
    }
    if (count > 0) console.log(`  📁 ${cat.padEnd(10)} : ${count} plugin`);
  }
  console.log(`  📊 Total    : ${pluginList.length} plugin\n`);
}

// ============ BUILD CONTEXT ============
function buildContext(sock, msg, args) {
  const from = msg.key.remoteJid;
  const sender = msg.key.participantAlt || msg.key.participant || msg.key.remoteJidAlt || msg.key.remoteJid;
  const senderNumber = sender.split('@')[0].replace(/[^0-9]/g, '');
  const pushName = msg.pushName || 'User';
  const mentioned = msg.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
  const user = getUser(sender);

  return {
    config, from, sender, senderNumber, pushName, mentioned, user, args, msg, sock,
    downloadMediaMessage,
    getUser, updateUser, loadDB, saveDB,
    loadGroups, saveGroups, getGroupSettings, updateGroupSettings, saveMode,
    isOwner, isSenderOwner: () => isSenderOwner(msg, sender), isGroup,
    isGroupAllowed, random, formatMoney, checkSpam, spamTracker,
    gameState, gameTimers, setGameTimeout, clearGameTimeout,
    ...level,
  };
}

// ============ START BOT ============
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
  const { version } = await fetchLatestBaileysVersion();

  console.log(`📡 Baileys version: ${version.join('.')}`);

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    syncFullHistory: false,
    markOnlineOnConnect: true,
    getMessage: async () => ({ conversation: '' }),
  });

  sock.ev.on('creds.update', saveCreds);

  // ============================================================
  //   PAIRING CODE — Trigger di event 'qr' (SESUAI DOKUMENTASI)
  // ============================================================
  let codeRequested = false;

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // Trigger pairing code DI EVENT 'qr', bukan 'connecting'
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

      console.log(`📞 Nomor bot: ${phone}`);
      console.log('⏳ Tunggu 5 detik...\n');

      // Delay 5 detik sebelum request code
      setTimeout(async () => {
        try {
          const code = await sock.requestPairingCode(phone);
          const fmt = code.match(/.{1,4}/g)?.join('-') || code;

          console.log('\n╔══════════════════════════════════╗');
          console.log('║   ✅ PAIRING CODE BERHASIL        ║');
          console.log('╚══════════════════════════════════╝');
          console.log(`\n   📱 Nomor: ${phone}`);
          console.log(`   🔑 Kode : ${fmt}\n`);
          console.log('══════════════════════════════════');
          console.log('📌 CARA PAKAI:');
          console.log('   1. Buka WhatsApp di HP nomor bot');
          console.log('   2. Pengaturan → Perangkat Tertaut');
          console.log('   3. Tautkan Perangkat');
          console.log('   4. Pilih "Tautkan dengan nomor telepon saja"');
          console.log('   5. Masukkan kode: ' + fmt);
          console.log('   ⏱️ Kode berlaku 60 detik — cepat!\n');
        } catch (e) {
          console.log('❌ Gagal pairing:', e.message);
          console.log('💡 Restart bot untuk coba lagi.\n');
        }
      }, 5000);
    }

    // Handle connection close
    if (connection === 'close') {
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        console.log('⚠️ Bot logout. Hapus session & pairing ulang.');
        fs.rmSync(path.join(__dirname, config.sessionName), { recursive: true, force: true });
        process.exit(0);
      } else {
        console.log(`🔄 Reconnect (code ${code}) dalam 5 detik...`);
        setTimeout(() => startBot(), 5000);
      }
    } else if (connection === 'open') {
      console.log('\n╔══════════════════════════════════╗');
      console.log('║   ✅ BOT BERHASIL TERHUBUNG!      ║');
      console.log('╚══════════════════════════════════╝');
      console.log(`🤖 ${config.botName}`);
      console.log(`📞 ${config.botNumber}`);
      console.log(`📌 Mode: ${config.botMode.toUpperCase()}`);
      console.log(`📦 Plugins: ${pluginList.length}\n`);
    }
  });

  // ==================== GROUP EVENTS ====================
  sock.ev.on('group-participants.update', async (update) => {
    try {
      const { id, participants, action } = update;
      const botJid = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const botAdded = participants.some(p => p === botJid);

      if (action === 'add' && botAdded && !isGroupAllowed(id)) {
        let name = 'Grup';
        try { name = (await sock.groupMetadata(id)).subject; } catch {}
        try {
          await sock.sendMessage(id, { text: `❌ Bot hanya untuk grup resmi.\n\nOwner: ${config.ownerNumber}\n\nBot keluar dalam 5 detik...` });
          await new Promise(r => setTimeout(r, 5000));
        } catch {}
        try { await sock.groupLeave(id); } catch {}
        try {
          await sock.sendMessage(config.ownerNumber + '@s.whatsapp.net', {
            text: `🔔 Bot keluar dari grup non-whitelist:\n${name}\nID: ${id}`,
          });
        } catch {}
        return;
      }

      const gs = getGroupSettings(id);
      let groupName = '';
      try { groupName = (await sock.groupMetadata(id)).subject; } catch { return; }

      for (const p of participants) {
        if (p === botJid) continue;
        const num = p.split('@')[0];
        if (action === 'add' && gs.welcome) {
          const t = gs.welcomeText.replace('@user', `@${num}`).replace('@group', groupName);
          await sock.sendMessage(id, { text: `👋 *WELCOME*\n\n${t}`, mentions: [p] });
        } else if (action === 'remove' && gs.welcome) {
          const t = gs.goodbyeText.replace('@user', `@${num}`).replace('@group', groupName);
          await sock.sendMessage(id, { text: `👋 *GOODBYE*\n\n${t}`, mentions: [p] });
        }
      }
    } catch (e) { console.error('Group event:', e.message); }
  });

  // ==================== MESSAGES ====================
  sock.ev.on('messages.upsert', async (m) => {
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
            const isAdmin = gm.participants.find(p => p.id === sender)?.admin;
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

      // ANTI-SPAM
      if (isGroup(from) && !isSenderOwner(msg, sender)) {
        const sc = checkSpam(sender);
        if (sc.spam) {
          try { await sock.sendMessage(from, { delete: msg.key }); } catch {}
          if (sc.muted) {
            if (!spamTracker[sender]?.notified || Date.now() - spamTracker[sender].notified > 30000) {
              spamTracker[sender].notified = Date.now();
              await sock.sendMessage(from, {
                text: `🚫 *ANTI-SPAM*\n\n@${senderNumber} di-mute ${sc.sisa} detik!`,
                mentions: [sender],
              });
            }
          } else {
            await sock.sendMessage(from, {
              text: `⚠️ *PERINGATAN* (${sc.warned}/${config.warningBeforeMute})\n\n@${senderNumber}, jangan spam!`,
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

      // RANDOM QUESTION (tanpa prefix)
      if (!text.startsWith(config.prefix)) {
        const lower = text.toLowerCase();
        const rq = [
          { keys: ['kapankah aku menikah', 'kapan aku menikah', 'kapan nikah'], ans: ['💍 *2 tahun lagi* nih!', '💍 Menikah *tahun depan*!', '💍 Sabar ya, *3-5 tahun*!'] },
          { keys: ['akankah aku', 'apakah aku akan', 'apakah aku bisa'], ans: ['🔮 *Ya, kemungkinan bisa!*', '🔮 *Tergantung usahamu.*', '🔮 *InsyaAllah bisa.*'] },
          { keys: ['apakah dia suka aku', 'dia suka aku gak'], ans: ['❤️ *Dia diam-diam suka kamu.*', '❤️ *Tanya langsung aja!*', '❤️ *Peluang 70%!*'] },
          { keys: ['ramalan', 'zodiak', 'nasib'], ans: ['🌟 *Hari ini penuh keberuntungan!*', '🌟 *Energi positif mengelilingimu.*'] },
        ];
        for (const q of rq) {
          if (q.keys.some(k => lower.includes(k))) {
            await sock.sendMessage(from, { text: random(q.ans) }, { quoted: msg });
            return;
          }
        }
        return;
      }

      // PARSE
      const args = text.slice(config.prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();

      // AUTO-DETECT JAWABAN GAME
      if (gameState[from] && gameState[from].sender === sender) {
        const g = gameState[from];
        const lower = text.trim().toLowerCase();
        const accepted = Array.isArray(g.jawab) ? g.jawab : [g.jawab];
        const isCorrect = accepted.some(j => String(j).toLowerCase() === lower || lower.includes(String(j).toLowerCase()));

        if (isCorrect) {
          clearGameTimeout(from);
          const u = getUser(sender);
          const rewards = { tebakangka: [5, 500], quiz: [10, 1000], tebakkata: [3, 750], math: [2, 500], tebakemoji: [3, 800] };
          const [pt, mn] = rewards[g.game] || [3, 500];
          updateUser(sender, { point: u.point + pt, money: u.money + mn });
          delete gameState[from];
          await sock.sendMessage(from, { text: `🎉 *BENAR!*\n\n+${pt} Point\n+${formatMoney(mn)}` }, { quoted: msg });
          return;
        }
      }

      // LEVEL SYSTEM
      if (config.levelSystem?.enabled && isGroup(from)) {
        const res = level.addExp(sender);
        if (res) {
          const r = res.reward || {};
          let txt = '';
          if (r.money) txt += `💰 +${formatMoney(r.money)}\n`;
          if (r.point) txt += `⭐ +${r.point} Point\n`;
          if (r.limit) txt += `🎫 +${r.limit} Limit\n`;
          await sock.sendMessage(from, {
            text: `🎉 *LEVEL UP!*\n\nSelamat @${senderNumber}!\n\n📊 Level: *${res.oldLevel}* → *${res.newLevel}*\n\n🎁 Hadiah:\n${txt}`,
            mentions: [sender],
          });
        }
      }

      // LIMIT CHECK
      const noLimit = ['menu','help','menugame','menugames','menufun','menuhiburan','menuekonomi','menueco','menulevel','menugroup','menuadmin','menuowner','menuown','runtime','uptime','rt','profile','profil','owner','info','botinfo','mode','self','public','limit','point','uang','money','daily','shop','ping','wiki','cuaca','jodoh','sifat','tourl','sticker','stiker','s'];

      const user = getUser(sender);
      const ownerUser = isSenderOwner(msg, sender);

      if (!noLimit.includes(command) && !ownerUser && user.limit <= 0) {
        return sock.sendMessage(from, {
          text: `⚠️ *Limit habis!*\n\nTunggu reset besok atau hubungi owner.\n\n👑 ${config.ownerName}\n📞 ${config.ownerNumber}`,
        }, { quoted: msg });
      }
      if (!noLimit.includes(command) && !ownerUser) {
        updateUser(sender, { limit: user.limit - 1 });
      }

      // CARI PLUGIN
      const plugin = plugins.get(command);
      if (!plugin) return;

      // EXECUTE
      const ctx = buildContext(sock, msg, args);
      try {
        await plugin.execute(sock, msg, args, ctx);
      } catch (err) {
        console.error(`❌ Error plugin "${plugin.name}":`, err.message);
      }

    } catch (err) {
      console.error('❌ Handler error:', err.message);
    }
  });
}

// ============ LOAD & START ============
loadPlugins();
startBot().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});