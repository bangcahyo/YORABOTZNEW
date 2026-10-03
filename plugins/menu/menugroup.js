const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menugroup',
  category: 'menu',
  aliases: ['menuadmin'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isGroup } = ctx;
    if (!isGroup(from)) {
      return sock.sendMessage(from, { text: '❌ Menu ini hanya dapat digunakan di dalam grup.' }, { quoted: msg });
    }

    const menuText = renderMenu({
      botName: config.botName,
      title: 'FITUR GRUP',
      prefix: config.prefix,
      sections: [
        { icon: '🛡️', title: 'KEAMANAN', items: [`${config.prefix}antilink on/off`, `${config.prefix}antispam on/off`, `${config.prefix}unmute @user`, `${config.prefix}grouphelp`] },
        { icon: '👋', title: 'PESAN SELAMAT DATANG & PAMIT', items: [`${config.prefix}welcome on/off`, `${config.prefix}setwelcome <teks>`, `${config.prefix}setgoodbye <teks>`] },
        { icon: '👥', title: 'KELOLA ANGGOTA', items: [`${config.prefix}kick @user`, `${config.prefix}promote @user`, `${config.prefix}demote @user`, `${config.prefix}tagall <pesan>`] },
        { icon: 'ℹ️', title: 'INFORMASI GRUP', items: [`${config.prefix}groupinfo`, `${config.prefix}id`] },
      ],
      footer: ['Sejumlah command memerlukan bot sebagai admin grup.'],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};
