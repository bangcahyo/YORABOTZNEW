const { loadVoiceMessage, renderMenu } = require('../../lib/menu-layout');

function getTimeGreeting(timeZone) {
  const hour = Number(new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(new Date()));
  if (hour < 11) return '🌞 Selamat pagi';
  if (hour < 15) return '☀️ Selamat siang';
  if (hour < 18) return '🌤️ Selamat sore';
  if (hour < 21) return '🌆 Selamat petang';
  return '🌙 Selamat malam';
}

function formatTanggal(timeZone) {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

module.exports = {
  name: 'menu',
  category: 'menu',
  aliases: ['help', 'start'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const user = ctx.user || { limit: 0, money: 0, point: 0, exp: 0, registered: false };
    const prefix = config.prefix || '.';
    const timeZone = config.autoBroadcast?.timezone || 'Asia/Jakarta';
    const timeGreeting = getTimeGreeting(timeZone);
    const sender = ctx.sender;
    const senderNumber = ctx.senderNumber || (sender ? sender.split('@')[0].replace(/[^0-9]/g, '') : '');
    const greetingName = senderNumber ? `@${senderNumber}` : (ctx.pushName || 'Pengguna');
    const mentions = sender ? [sender] : [];
    const mentionOptions = mentions.length ? { mentions } : {};
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
        title: `Halo kak ${greetingName}, ${timeGreeting}${isOwner ? ' 👑' : ''}`,
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
          `${prefix}menumedia — unduh, stiker, dan olah media`,
          `${prefix}menuislami — kuis Islami`,
          `${prefix}menutools — AI dan utilitas`,
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
          `${prefix}sc — informasi dan aturan script`,
          `${prefix}perf — statistik durasi dan error command`,
          `${prefix}tutorial — panduan penggunaan`,
          `${prefix}ping — cek respons bot`,
        ],
      },
      {
        icon: 'ℹ️',
        title: 'INFORMASI BOT',
        items: [
          `Tanggal: ${formatTanggal(timeZone)}`,
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
          await sock.sendMessage(from, { image: { url: config.menuImageUrl }, caption: menuText, ...mentionOptions });
        } catch {
          await sock.sendMessage(from, { text: menuText, ...mentionOptions });
        }
      })());
    } else {
      sends.push(sock.sendMessage(from, { text: menuText, ...mentionOptions }));
    }

    await Promise.all(sends);
  },
};
