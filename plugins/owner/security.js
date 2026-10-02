module.exports = {
  name: 'security',
  category: 'owner',
  aliases: ['botcontrol', 'controlpanel', 'securitycheck'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner } = ctx;

    if (!isSenderOwner || !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Hanya owner yang bisa akses panel keamanan bot.' }, { quoted: msg });
    }

    const mode = (config.botMode || 'public').toUpperCase();
    const antiSpam = config.antiSpam !== false ? 'AKTIF' : 'NONAKTIF';
    const registration = config.registrationRequired !== false ? 'WAJIB' : 'OPTIONAL';
    const premium = config.premium?.enabled !== false ? 'AKTIF' : 'NONAKTIF';
    const whitelist = config.whitelistGroup?.enabled ? 'AKTIF' : 'NONAKTIF';
    const broadcast = config.autoBroadcast?.enabled !== false ? 'AKTIF' : 'NONAKTIF';

    const text = `╔══════════════════════════════════════╗
║    🔒 *BOT SECURITY CONTROL*  🔒
╚══════════════════════════════════════╝

📌 Bot Mode          : *${mode}*
🛡️ Anti Spam        : *${antiSpam}*
🧾 Registrasi       : *${registration}*
💎 Premium System   : *${premium}*
📋 Whitelist Grup   : *${whitelist}*
📢 Auto Broadcast   : *${broadcast}*
🔐 Prefix           : *${config.prefix || '.'}*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ *Quick Controls:*
• ${config.prefix}self       → Mode private owner-only
• ${config.prefix}public     → Mode public / semua user
• ${config.prefix}antispam on/off
• ${config.prefix}welcome on/off
• ${config.prefix}antilink on/off
• ${config.prefix}reloadcfg

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Status keamanan: *bot siap dikontrol secara aman*`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
