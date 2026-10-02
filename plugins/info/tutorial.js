module.exports = {
  name: 'tutorial',
  category: 'info',
  aliases: ['panduan', 'guide', 'tutorialbot', 'startguide'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const prefix = config.prefix || '.';

    const text = `╔══════════════════════════════════════╗
║      📘  *TUTORIAL PENGGUNAAN*      📘
╚══════════════════════════════════════╝

✨ *Cara mulai pakai bot:*

1. 📝 Ketik *${prefix}daftar*
   → Daftarkan akun bot kamu.

2. 👤 Ketik *${prefix}profile*
   → Cek profil, level, uang, dan limit.

3. 🎁 Ketik *${prefix}daily*
   → Ambil reward harian.

4. 🎮 Ketik *${prefix}menugame*
   → Lihat menu game.

5. 💰 Ketik *${prefix}menuekonomi*
   → Cek fitur ekonomi, shop, premium.

6. 🛠️ Ketik *${prefix}menutools*
   → Akses utility seperti jam, bmi, reminder, translate.

7. 🛡️ Ketik *${prefix}menugroup*
   → Fitur admin grup dan keamanan grup.

8. 👑 Ketik *${prefix}premium buy*
   → Upgrade premium untuk benefit lebih lengkap.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 *Tips cepat:*
- Gunakan *${prefix}menu* untuk menu utama.
- Gunakan *${prefix}help* untuk ringkasan cepat.
- Gunakan *${prefix}about* untuk info bot.
- Gunakan *${prefix}version* untuk cek versi.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Bot ini dibuat untuk komunitas, game, ekonomi, grup, dan tools yang lebih profesional.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
