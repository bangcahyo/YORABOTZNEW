const config = require('../config');

const ALLOWED_WITHOUT_REGISTER = [
  'daftar', 'register', 'reg', 'unreg', 'unregister',
];

function getRegistrationCommand(text, prefix) {
  if (typeof text !== 'string' || typeof prefix !== 'string' || !prefix || !text.startsWith(prefix)) return null;
  return text.slice(prefix.length).trim().split(/\s+/)[0].toLowerCase();
}

function requiresRegister(command) {
  if (!config.registrationRequired) return false;
  return !ALLOWED_WITHOUT_REGISTER.includes(command);
}

async function sendRegisterRequired(sock, from, config) {
  const text = `╔══════════════════════════════════════╗
║                                      ║
║    🚫 *REGISTRATION REQUIRED*        ║
║    ━━━━━━━━━━━━━━━━━━━
║                                      ║
╚══════════════════════════════════════╝

⚠️ Kamu *belum terdaftar*!

📝 Daftar dulu dengan:

    *${config.prefix}daftar <namamu>*

Contoh:
*${config.prefix}daftar Cahyo Store*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ *Keuntungan daftar:*
• Akses semua fitur bot
• Data tersimpan permanen
• Bisa main game & ekonomi
• Bisa lihat profile & rank

_${config.botName}_`;

  if (config.registerImageUrl) {
    try {
      await sock.sendMessage(from, { image: { url: config.registerImageUrl }, caption: text });
      return;
    } catch {}
  }
  await sock.sendMessage(from, { text });
}

module.exports = { requiresRegister, getRegistrationCommand, sendRegisterRequired, ALLOWED_WITHOUT_REGISTER };