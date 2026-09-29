module.exports = {
  // ═══════════════════════════════════════════════════════
  //                    INFORMASI BOT
  // ═══════════════════════════════════════════════════════
  botName: 'Yora Botz',
  botNumber: '6282228307663',           // ⚠️ Nomor bot (format 62xxx)
  ownerName: 'Cahyo Store',
  ownerNumber: '628139525985',          // ⚠️ Nomor owner (format 62xxx)
  ownerLID: '',                          // LID owner (opsional, dari .cekLID)
  website: 'https://fityorastore.netlify.app/',

  // ═══════════════════════════════════════════════════════
  //                    PENGATURAN BOT
  // ═══════════════════════════════════════════════════════
  prefix: '.',
  sessionName: 'session',
  botMode: 'public',                     // 'public' | 'self'

  // ═══════════════════════════════════════════════════════
  //                    EKONOMI DEFAULT
  // ═══════════════════════════════════════════════════════
  defaultLimit: 20,
  defaultMoney: 1000,
  defaultPoint: 0,

  // ═══════════════════════════════════════════════════════
  //                    GAME SETTINGS
  // ═══════════════════════════════════════════════════════
  maxBet: 10000,
  minBet: 100,
  gameTimeout: 60000,                    // 60 detik

  // ═══════════════════════════════════════════════════════
  //                    ANTI SPAM
  // ═══════════════════════════════════════════════════════
  antiSpam: true,
  spamLimit: 5,
  spamInterval: 5000,
  spamMuteDuration: 60000,
  warningBeforeMute: 2,

  // ═══════════════════════════════════════════════════════
  //              MEDIA URL — TANPA FILE LOKAL
  // ═══════════════════════════════════════════════════════
  // Upload gambar & voice ke Catbox.moe atau host lain
  // Lalu paste URL-nya di sini

  menuImageUrl: '',                      // URL gambar menu
  voiceMenuUrl: '',                      // URL voice menu (.ogg OPUS)
  voiceOwnerUrl: '',                     // URL voice owner (.ogg OPUS)

  // Pengaturan kirim media
  sendMenuAs: 'both',                    // 'text' | 'voice' | 'image' | 'both'
  sendOwnerAs: 'both',                   // 'text' | 'voice' | 'both'

  // ═══════════════════════════════════════════════════════
  //                    GRUP RESMI
  // ═══════════════════════════════════════════════════════
  officialGroup: {
    name: 'Grup Resmi Yora Botz',
    link: 'https://chat.whatsapp.com/GRj7DL7U8w44CTmGcFC5v2',
    desc: 'Grup diskusi, info update, & bantuan bot',
  },

  // ═══════════════════════════════════════════════════════
  //                    WHITELIST GRUP
  // ═══════════════════════════════════════════════════════
  // Bot hanya bisa masuk grup yang ada di list ini
  // Cara dapat ID: ketik .id di grup
  
  whitelistGroup: {
    enabled: false,                      // true = aktifkan whitelist
    groups: [
      // '628123456789-1234567890@g.us',
    ],
  },

  // ═══════════════════════════════════════════════════════
  //                    LEVEL SYSTEM
  // ═══════════════════════════════════════════════════════
  levelSystem: {
    enabled: true,
    expPerMessage: 10,                   // EXP per pesan
    expCooldown: 30000,                  // Cooldown 30 detik
    maxLevel: 100,
    rewardPerLevelUp: {
      money: 500,
      point: 5,
      limit: 1,
    },
  },

  // ═══════════════════════════════════════════════════════
  //                    TQTO (THANKS TO)
  // ═══════════════════════════════════════════════════════
  tqto: {
    title: 'THANKS TO',
    contributors: [
      'Cahyo Store',
      'Baileys Team',
      'Kamu',
    ],
    footer: 'Terima kasih telah menggunakan bot ini!',
  },
};