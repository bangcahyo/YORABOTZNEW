const fs = require('fs');
const path = require('path');

const GREETINGS = ['✨ Hai', '🔥 Welcome', '⚡ Yo', '🌙 Malam', '🌞 Pagi', '💫 Halo', '🎯 Hai hai', '🎨 Salam', '🌟 Yo bro', '👋 Halo'];

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 11) return '🌞 Selamat pagi';
  if (h < 15) return '☀️ Selamat siang';
  if (h < 18) return '🌤️ Selamat sore';
  if (h < 21) return '🌆 Selamat petang';
  return '🌙 Selamat malam';
}

function formatTanggal() {
  const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const d = new Date();
  return `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

function getTotalUsers() {
  try {
    const p = path.join(__dirname, '..', '..', 'database', 'users.json');
    if (!fs.existsSync(p)) return 0;
    return Object.keys(JSON.parse(fs.readFileSync(p, 'utf-8'))).length;
  } catch { return 0; }
}

module.exports = {
  name: 'menu',
  category: 'menu',
  aliases: ['help', 'start'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const user = ctx.user || { limit: 0, money: 0, point: 0, exp: 0, registered: false };
    const pushName = ctx.pushName || 'User';
    const formatMoney = ctx.formatMoney || (a => 'Rp ' + a);

    const greeting = Math.random() < 0.5 ? GREETINGS[Math.floor(Math.random() * GREETINGS.length)] : getTimeGreeting();
    let ownerTag = '';
    try { if (ctx.isSenderOwner && ctx.isSenderOwner()) ownerTag = ' 👑'; } catch {}

    const totalUsers = getTotalUsers();
    const uptime = process.uptime();
    const upJam = Math.floor(uptime / 3600);
    const upMenit = Math.floor((uptime % 3600) / 60);
    const getLevel = (exp) => Math.floor(Math.sqrt(exp / 100)) + 1;
    const level = getLevel(user.exp || 0);
    let isPrem = false;
    try { isPrem = ctx.isPremium && ctx.isPremium(); } catch {}
    const roleText = ownerTag ? 'Owner' : (isPrem ? 'Premium 🅟' : (user.registered ? 'Member' : 'Belum Daftar'));

    let tqtoText = '';
    if (config.tqto?.contributors?.length) {
      tqtoText = `\n╭─────────────────────────────────────╮\n│  🙏  *${config.tqto.title}*                     │\n╰─────────────────────────────────────╯\n\n`;
      config.tqto.contributors.forEach((c, i) => {
        const nama = typeof c === 'string' ? c : (c.name || 'Unknown');
        tqtoText += `  ${i + 1}. ${nama}\n`;
      });
    }

    const menuText = `╔══════════════════════════════════════╗
║                                      ║
║      ⚡  *${config.botName.toUpperCase()}*  ⚡
║      ━━━━━━━━━━━━━━━━━━━
║                                      ║
╚══════════════════════════════════════╝

  ${greeting}, *${pushName}*!${ownerTag}

╭─────────────────────────────────────╮
│  📊  *STATISTICS*                    │
╰─────────────────────────────────────╯

  ◆  👤  Role   : *${roleText}*
  ◆  ⭐  Level  : *${level}*
  ◆  📈  EXP    : *${user.exp || 0}*
  ◆  🎫  Limit  : *${user.limit}*
  ◆  💰  Uang   : *${formatMoney(user.money)}*
  ◆  🌟  Point  : *${user.point}*

╭─────────────────────────────────────╮
│  📂  *MENU UTAMA*                    │
╰─────────────────────────────────────╯

  ◈  🎮  *GAME & HIBURAN*    → ${config.prefix}menugame
  ◈  🎭  *FUN & RANDOM*      → ${config.prefix}menufun
  ◈  💰  *EKONOMI & SHOP*    → ${config.prefix}menuekonomi
  ◈  📊  *LEVEL SYSTEM*      → ${config.prefix}menulevel
  ◈  🛡️  *GROUP ADMIN*       → ${config.prefix}menugroup
  ◈  🛠️  *TOOLS & UTILITY*   → ${config.prefix}menutools
  ◈  👑  *OWNER TOOLS*       → ${config.prefix}menuowner

╭─────────────────────────────────────╮
│  ⚡  *FITUR CEPAT*                   │
╰─────────────────────────────────────╯

  ◈  📝  ${config.prefix}daftar    → Registrasi
  ◈  👤  ${config.prefix}profile   → Profil
  ◈  🎁  ${config.prefix}daily     → Daily
  ◈  🏆  ${config.prefix}leaderboard
  ◈  ℹ️  ${config.prefix}about     → Tentang bot
  ◈  �  ${config.prefix}tutorial  → Panduan mulai
  ◈  �📦  ${config.prefix}version   → Versi bot
  ◈  ⏱️  ${config.prefix}runtime
  ◈  🏓  ${config.prefix}ping

╭─────────────────────────────────────╮
│  🚀  *QUICK START / ONBOARDING*     │
╰─────────────────────────────────────╯

  1. 📝 ${config.prefix}daftar        → Daftar akun
  2. 👤 ${config.prefix}profile       → Cek profil & status
  3. 🎁 ${config.prefix}daily          → Ambil reward harian
  4. 📊 ${config.prefix}menu          → Lihat menu utama
  5. 💎 ${config.prefix}premium buy   → Upgrade ke premium
  6. 📈 ${config.prefix}limit          → Cek limit / benefit
  7. 🛠️ ${config.prefix}menutools      → Utility & tools
  8. 🆘 ${config.prefix}help           → Panduan cepat

╭─────────────────────────────────────╮
│  ℹ️  *INFO BOT*                      │
╰─────────────────────────────────────╯

  ◆  📅  ${formatTanggal()}
  ◆  👥  Total User : *${totalUsers}*
  ◆  ⏱️  Uptime     : *${upJam}j ${upMenit}m*
  ◆  👑  Owner      : ${config.ownerName}
  ◆  📞  Nomor      : ${config.ownerNumber}
  ◆  🌐  ${config.website}

╭─────────────────────────────────────╮
│  💬  *GRUP RESMI*                    │
╰─────────────────────────────────────╯

  ${config.officialGroup?.link || '-'}
${tqtoText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚡  _${config.botName} v7.2.1 — _wa.me/fityora_
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const mode = config.sendMenuAs || 'both';

    if ((mode === 'voice' || mode === 'both') && config.voiceMenuUrl) {
      try {
        await sock.sendMessage(from, { audio: { url: config.voiceMenuUrl }, mimetype: 'audio/ogg; codecs=opus', ptt: true });
      } catch (e) { console.log('Voice gagal:', e.message); }
    }

    if ((mode === 'image' || mode === 'both') && config.menuImageUrl) {
      try {
        await sock.sendMessage(from, { image: { url: config.menuImageUrl }, caption: menuText });
      } catch {
        await sock.sendMessage(from, { text: menuText });
      }
    } else {
      await sock.sendMessage(from, { text: menuText });
    }
  },
};