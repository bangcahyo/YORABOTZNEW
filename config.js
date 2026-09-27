module.exports = {
  ownerNumber: '628139525985',
  ownerName: 'Cahyo Store',
  botNumber: '6282228307663',
  website: 'https://fityorastore.netlify.app/',

  botName: 'Yora Botz',
  prefix: '.',
  sessionName: 'session',
  botMode: 'public',

  defaultLimit: 20,
  defaultMoney: 1000,
  defaultPoint: 0,

  maxBet: 10000,
  minBet: 100,
  gameTimeout: 60000,

  antiSpam: true,
  spamLimit: 5,
  spamInterval: 5000,
  spamMuteDuration: 60000,
  warningBeforeMute: 2,

  menuImage: './assets/menu.jpg',
  menuImageUrl: '',
  voiceMenu: './assets/menu.ogg',
  voiceMenuUrl: '',
  sendMenuAs: 'both',
  voiceOwner: './assets/owner.ogg',
  voiceOwnerUrl: '',
  sendOwnerAs: 'both',

  officialGroup: {
    name: 'Grup Resmi Yora Botz',
    link: 'https://chat.whatsapp.com/GRj7DL7U8w44CTmGcFC5v2',
    desc: 'Grup diskusi, info update, & bantuan bot',
  },

  whitelistGroup: {
    enabled: false,
    groups: [],
  },

  levelSystem: {
    enabled: true,
    expPerMessage: 10,
    expCooldown: 30000,
    maxLevel: 100,
    rewardPerLevelUp: {
      money: 500,
      point: 5,
      limit: 1,
    },
  },

  tqto: {
    title: 'THANKS TO',
    subtitle: 'Bot ini tidak akan berjalan tanpa mereka:',
    contributors: [
      { name: 'Cahyo Store', role: 'Owner & Developer', contact: '08139525985' },
      { name: 'Baileys Team', role: 'Library WhatsApp', contact: 'github.com/WhiskeySockets' },
      { name: 'Kamu', role: 'Pengguna Setia Bot Ini', contact: '' },
    ],
    footer: 'Terima kasih telah menggunakan bot ini!',
  },
};