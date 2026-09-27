module.exports = {
  name: 'menugroup', category: 'menu', aliases: ['menuadmin'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isGroup } = ctx;
    if (!isGroup(from)) return sock.sendMessage(from, { text: '❌ Hanya untuk grup!' }, { quoted: msg });
    await sock.sendMessage(from, { text: `╭━━━「 🛡️ *MENU GROUP ADMIN* 」━━━\n\n╭─「 🛡️ *KEAMANAN* 」\n│ 🔗 ${config.prefix}antilink on/off\n│ 🛡️ ${config.prefix}antispam on/off\n│ 🔊 ${config.prefix}unmute @user\n╰━━━━━━━━━━━━━━━━━━━━\n\n╭─「 👋 *WELCOME & GOODBYE* 」\n│ 👋 ${config.prefix}welcome on/off\n│ ✏️ ${config.prefix}setwelcome <teks>\n│ ✏️ ${config.prefix}setgoodbye <teks>\n╰━━━━━━━━━━━━━━━━━━━━\n\n╭─「 👥 *MANAJEMEN MEMBER* 」\n│ 👢 ${config.prefix}kick @user\n│ ⬆️ ${config.prefix}promote @user\n│ ⬇️ ${config.prefix}demote @user\n│ 📢 ${config.prefix}tagall <pesan>\n╰━━━━━━━━━━━━━━━━━━━━\n\n╭─「 ℹ️ *INFO GRUP* 」\n│ ℹ️ ${config.prefix}groupinfo\n│ 🆔 ${config.prefix}id\n╰━━━━━━━━━━━━━━━━━━━━` }, { quoted: msg });
  }
};