module.exports = {
  name: 'profile', category: 'ekonomi', aliases: ['profil'],
  async execute(sock, msg, args, ctx) {
    const { config, from, senderNumber, pushName, user, getExpProgress, formatMoney } = ctx;
    const info = getExpProgress(user.exp || 0);
    await sock.sendMessage(from, { text: `👤 *PROFIL*\n\n📛 Nama: ${pushName}\n📞 Nomor: ${senderNumber}\n📊 Level: ${info.level}\n✨ EXP: ${user.exp || 0}\n🎫 Limit: ${user.limit}\n⭐ Point: ${user.point}\n💰 Uang: ${formatMoney(user.money)}\n\n🌐 ${config.website}` }, { quoted: msg });
  }
};