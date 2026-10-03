const { loadVoiceMessage, renderMenu } = require('../../lib/menu-layout');

const GREETINGS = ['✨ Halo', '🔥 Hai', '⚡ Salam', '💫 Apa kabar?', '👋 Halo'];

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return '🌞 Selamat pagi';
  if (hour < 15) return '☀️ Selamat siang';
  if (hour < 18) return '🌤️ Selamat sore';
  if (hour < 21) return '🌆 Selamat petang';
  return '🌙 Selamat malam';
}

function formatTanggal() {
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const date = new Date();
  return `${hari[date.getDay()]}, ${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
}

module.exports = {
  name: 'menu',
  category: 'menu',
  aliases: ['help', 'start'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const user = ctx.user || { limit: 0, money: 0, point: 0, exp: 0, registered: false };
    const prefix = config.prefix || '.';
    const greeting = Math.random() < 0.5
      ? GREETINGS[Math.floor(Math.random() * GREETINGS.length)]
      : getTimeGreeting();
    const isOwner = Boolean(ctx.isSenderOwner && ctx.isSenderOwner());
    const isPremium = Boolean(ctx.isPremium && ctx.isPremium());
    const role = isOwner ? 'Owner' : isPremium ? 'Premium' : user.registered ? 'Anggota' : 'Belum terdaftar';
    const level = Math.floor(Math.sqrt((user.exp || 0) / 100)) + 1;
    const uptime = process.uptime();
    const uptimeText = `${Math.floor(uptime / 3600)} jam ${Math.floor((uptime % 3600) / 60)} menit`;
    const totalUsers = ctx.loadDB ? Object.keys(ctx.loadDB()).length : 0;
    const formatMoney = ctx.formatMoney || (amount => `Rp ${amount}`);

    const sections = [
      {
        icon: '👋',
        title: `${greeting}, ${ctx.pushName || 'Pengguna'}${isOwner ? ' 👑' : ''}`,
        items: [
          `Peran: *${role}*`,
          `Level: *${level}* · EXP: *${user.exp || 0}*`,
          `Limit: *${user.limit}* · Uang: *${formatMoney(user.money)}*`,
          `Poin: *${user.point}*`,
        ],
      },
      {
        icon: '📚',
        title: 'PILIH KATEGORI',
        items: [
          `${prefix}menugame — permainan dan tebak-tebakan`,
          `${prefix}menufun — hiburan`,
          `${prefix}menuekonomi — profil, ekonomi, dan toko`,
          `${prefix}menulevel — level dan peringkat`,
          `${prefix}menugroup — pengaturan grup`,
          `${prefix}menutools — stiker dan utilitas`,
          ...(isOwner ? [`${prefix}menuowner — panel owner`] : []),
        ],
      },
      {
        icon: '⚡',
        title: 'COMMAND DASAR',
        items: [
          `${prefix}daftar <nama> — daftar akun`,
          `${prefix}profile — lihat profil`,
          `${prefix}daily — klaim hadiah harian`,
          `${prefix}leaderboard — lihat peringkat`,
          `${prefix}premium — informasi Premium`,
          `${prefix}commands — daftar semua command`,
          `${prefix}tutorial — panduan penggunaan`,
          `${prefix}ping — cek respons bot`,
        ],
      },
      {
        icon: 'ℹ️',
        title: 'INFORMASI BOT',
        items: [
          `Tanggal: ${formatTanggal()}`,
          `Total akun: *${totalUsers}*`,
          `Waktu aktif: *${uptimeText}*`,
          `Owner: ${config.ownerName}`,
          `Situs: ${config.website}`,
          `Grup resmi: ${config.officialGroup?.link || 'Belum tersedia'}`,
        ],
      },
    ];

    if (config.tqto?.contributors?.length) {
      sections.push({
        icon: '🙏',
        title: config.tqto.title,
        items: config.tqto.contributors.map((contributor, index) => {
          const name = typeof contributor === 'string' ? contributor : (contributor.name || 'Tanpa nama');
          return `${index + 1}. ${name}`;
        }),
      });
    }

    const menuText = renderMenu({
      botName: config.botName,
      title: 'MENU UTAMA',
      prefix,
      sections,
      footer: ['🅟 = Fitur Premium · 🅛 = Menggunakan limit'],
    });
    const mode = config.sendMenuAs || 'both';
    const sends = [];

    if ((mode === 'voice' || mode === 'both') && config.voiceMenuUrl) {
      sends.push((async () => {
        try {
          await sock.sendMessage(from, await loadVoiceMessage(config.voiceMenuUrl));
        } catch (error) {
          console.error('Gagal mengirim voice menu:', error.message);
          await sock.sendMessage(from, {
            text: `⚠️ Menu utama tetap tersedia, tetapi audio gagal dikirim: ${error.message}`,
          }, { quoted: msg });
        }
      })());
    }

    if ((mode === 'image' || mode === 'both') && config.menuImageUrl) {
      sends.push((async () => {
        try {
          await sock.sendMessage(from, { image: { url: config.menuImageUrl }, caption: menuText });
        } catch {
          await sock.sendMessage(from, { text: menuText });
        }
      })());
    } else {
      sends.push(sock.sendMessage(from, { text: menuText }));
    }

    await Promise.all(sends);
  },
};
