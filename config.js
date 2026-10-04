module.exports = {
  // ═══════════════════════════════════════════════════════
  //                    INFORMASI BOT
  // ═══════════════════════════════════════════════════════
  botName: 'Yora Botz',
  botNumber: '6282228307663',
  ownerName: 'Cahyo Store',
  ownerNumber: '628139525985',
  ownerLID: '33033365233764@lid',
  website: 'https://fityorastore.netlify.app/',
  prefix: '.',
  sessionName: 'session',
  botMode: 'public',

  // ═══════════════════════════════════════════════════════
  //                    EKONOMI
  // ═══════════════════════════════════════════════════════
  defaultLimit: 20,
  defaultMoney: 1000,
  defaultPoint: 0,
  dailyStreak: {
    graceHours: 48,
    milestones: {
      3: { money: 500, limit: 5 },
      7: { money: 1500, limit: 10 },
      14: { money: 3000, limit: 20 },
      30: { money: 7500, limit: 50 },
    },
  },

  // ═══════════════════════════════════════════════════════════════
  //                    PREMIUM  🅟
  // ═══════════════════════════════════════════════════════════════
  premium: {
    enabled: true,              // true = sistem premium aktif
    price: 50000,               // harga beli premium pakai uang (Rp)
    durationDays: 30,           // durasi default premium (hari)
    dailyLimit: 100,            // limit harian untuk user premium
    dailyMoneyMultiplier: 2,    // pengali hadiah .daily
    expMultiplier: 2,           // pengali EXP per pesan
    shopDiscount: 20,           // diskon shop (%) untuk premium
    maxLimit: 9999,             // batas maksimal limit premium
  },

  // Fitur yang HANYA bisa dipakai user premium (🅟)
  premiumOnly: [
    'tourl', 'emojimix',
    'youtube', 'ytmp4', 'ytmp3', 'tiktok', 'instagram', 'ig',
    'ai', 'ask', 'assistant', 'askbot',
    'briefing', 'dailybrief', 'ringkasan',
    'premiumcard', 'profilecard', 'vipcard',
  ],

  // ═══════════════════════════════════════════════════════════════
  //                    LIMIT  🅛
  // ═══════════════════════════════════════════════════════════════
  limitCost: {
    default: 1,                 // biaya limit default per command
    youtube: 3, ytmp4: 3, ytmp3: 3, tiktok: 3, instagram: 3, ig: 3,
    tourl: 2, emojimix: 2,
    sticker: 1, toimg: 1,
    // Game & fun & info = gratis (0) kecuali diatur di bawah
  },


  // ═══════════════════════════════════════════════════════
  //                    GAME
  // ═══════════════════════════════════════════════════════
  maxBet: 10000,
  minBet: 100,
  gameTimeout: 120000,              // waktu menjawab/giliran game (ms) = 2 menit

  // ═══════════════════════════════════════════════════════
  //                    ANTI SPAM
  // ═══════════════════════════════════════════════════════
  antiSpam: true,
  spamLimit: 5,
  spamInterval: 5000,
  spamMuteDuration: 60000,
  warningBeforeMute: 2,

  // ═══════════════════════════════════════════════════════
  //                    REGISTRASI
  // ═══════════════════════════════════════════════════════
  registrationRequired: true,        // true = wajib daftar dulu
  registerImageUrl: '',              // Gambar halaman registrasi

  // ═══════════════════════════════════════════════════════
  //                    MEDIA URL
  // ═══════════════════════════════════════════════════════
  menuImageUrl: 'https://files.catbox.moe/m83n8z.png',
  voiceMenuUrl: 'https://www.image2url.com/r2/default/audio/1790997980451-a797799f-9a95-47f0-80df-087fff141310.ogg',
  voiceOwnerUrl: 'https://www.image2url.com/r2/default/audio/1790998332276-f2ed502a-5594-4f02-a63a-51908936343c.ogg',
  sendMenuAs: 'both',
  sendOwnerAs: 'both',

  // ═══════════════════════════════════════════════════════
  //                    AUTO BROADCAST WAKTU
  // ═══════════════════════════════════════════════════════
  // Target bisa diisi lewat perintah:  .ab add (di grup tujuan)  atau  .ab addall
  // Pengaturan dari perintah disimpan di database/autobroadcast.json
  // dan MENGALAHKAN nilai di bawah ini.
  autoBroadcast: {
    enabled: true,
    timezone: 'Asia/Jakarta',
    targets: [],          // contoh: ['120363xxxxxxxxxx@g.us']
    allGroups: false,     // true = kirim ke SEMUA grup yang diikuti bot
    catchUpHours: 1,      // toleransi telat (jam) jika bot baru nyala setelah jadwal
  },

  databaseBackup: {
    enabled: true,
    intervalHours: 24,
    retentionCount: 7,
    notifyOnFailure: true,
    failureAlertCooldownHours: 24,
  },

  waktuPesan: {
    pagi: {
      jam: 6,
      text: `🌞 *SELAMAT PAGI* 🌞\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n✨ Semoga harimu menyenangkan\n☕ Jangan lupa sarapan dulu\n🤲 Berdoa sebelum aktivitas\n💪 Tetap semangat jalani hari\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n_"Awal yang baik akan membawa hasil yang baik"_`,
    },
    siang: {
      jam: 12,
      text: `☀️ *SELAMAT SIANG* ☀️\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n🍽️ Waktunya istirahat & makan\n🕌 Jangan lupa sholat Dzuhur\n😴 Rehat sejenak dari rutinitas\n💧 Minum air putih yang cukup\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n_"Kesehatan adalah investasi terbaik"_`,
    },
    sore: {
      jam: 15,
      text: `🌤️ *SELAMAT SORE* 🌤️\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n⏰ Setengah hari telah berlalu\n🍵 Waktunya ngopi & santai\n📊 Evaluasi yang sudah dikerjakan\n🎯 Fokus ke target selanjutnya\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n_"Istirahat bukan berarti berhenti"_`,
    },
    petang: {
      jam: 18,
      text: `🌆 *SELAMAT PETANG* 🌆\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n🏠 Waktunya pulang ke rumah\n🕌 Jangan lupa sholat Maghrib\n👨‍👩‍👧‍👦 Kumpul bareng keluarga\n🍽️ Nikmati makan malam\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n_"Rumah adalah tempat ternyaman"_`,
    },
    malam: {
      jam: 21,
      text: `🌙 *SELAMAT MALAM* 🌙\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n😴 Waktunya istirahat\n📱 Kurangi main HP dulu\n🤲 Berdoa sebelum tidur\n💤 Semoga mimpi indah\n\n━━━━━━━━━━━━━━━━━━━━━━\n\n_"Tidur cukup, bangun semangat"_`,
    },
  },

  // ═══════════════════════════════════════════════════════
  //                    GRUP RESMI
  // ═══════════════════════════════════════════════════════
  officialGroup: {
    name: 'Grup Resmi Yora Botz',
    link: 'https://shorturl.at/S9mbO',
    desc: 'Grup diskusi, info update, & bantuan bot',
  },

  // ═══════════════════════════════════════════════════════
  //                    WHITELIST GRUP
  // ═══════════════════════════════════════════════════════
  whitelistGroup: { enabled: false, groups: [] },

  // ═══════════════════════════════════════════════════════
  //                    LEVEL SYSTEM
  // ═══════════════════════════════════════════════════════
  levelSystem: {
    enabled: true,
    expPerMessage: 10,
    expCooldown: 30000,
    maxLevel: 100,
    rewardPerLevelUp: { money: 500, point: 5, limit: 1 },
  },

  // ═══════════════════════════════════════════════════════
  //                    OWNER ALERTS
  // ═══════════════════════════════════════════════════════
  storageMonitor: {
    enabled: true,
    thresholdPercent: 15,
    checkIntervalMs: 30 * 60 * 1000,
    cooldownMs: 24 * 60 * 60 * 1000,
  },

  ownerAlerts: {
    enabled: true,
    onModeChange: true,
    onWhitelistChange: true,
    onUnknownCommand: true,
    onSecurityEvent: true,
  },

  // ═══════════════════════════════════════════════════════
  //                    TQTO
  // ═══════════════════════════════════════════════════════
  tqto: {
    title: 'THANKS TO',
    contributors: ['Cahyo Store', 'Baileys Team', 'Kamu'],
    footer: 'Terima kasih telah menggunakan bot ini!',
  },
};