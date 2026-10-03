const cleanup = require('../../lib/cleanup');
const { clearVoiceMessageCache, getVoiceMessageCacheStats } = require('../../lib/menu-layout');

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 ** 2)).toFixed(2)} MB`;
}

module.exports = {
  name: 'cleanup',
  category: 'owner',
  aliases: ['clearcache'],
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner, config } = ctx;
    let isOwner = false;
    try { isOwner = Boolean(isSenderOwner && isSenderOwner()); } catch {}
    if (!isOwner) {
      return sock.sendMessage(from, { text: '❌ Perintah ini khusus untuk owner.' }, { quoted: msg });
    }

    if (String(args[0] || '').toLowerCase() !== 'confirm') {
      const candidates = cleanup.listStaleFiles();
      const totalBytes = candidates.reduce((total, file) => total + file.size, 0);
      const voiceCache = getVoiceMessageCacheStats();
      const files = candidates.slice(0, 8).map(file => `  • ${file.kind}: ${file.name}`);
      const remaining = candidates.length - files.length;
      const preview = files.length ? `\n\n${files.join('\n')}${remaining ? `\n  • +${remaining} file lainnya` : ''}` : '';
      const text = `🧹 *PRATINJAU PEMBERSIHAN*\n\n` +
        `File sementara yatim (>1 jam): *${candidates.length}* (${formatBytes(totalBytes)})\n` +
        `Cache audio menu: *${voiceCache.entries}* (${formatBytes(voiceCache.bytes)})${preview}\n\n` +
        `Database utama, backup, session, assets, dan node_modules tidak disentuh.\n` +
        `Ketik *${config.prefix || '.'}cleanup confirm* untuk membersihkan.`;
      return sock.sendMessage(from, { text }, { quoted: msg });
    }

    try {
      const result = cleanup.removeStaleFiles();
      const voiceCache = clearVoiceMessageCache();
      const text = `✅ *PEMBERSIHAN SELESAI*\n\n` +
        `File sementara dihapus: *${result.deleted}* (${formatBytes(result.bytesFreed)})\n` +
        `Cache audio dibersihkan: *${voiceCache.entries}* (${formatBytes(voiceCache.bytes)})\n` +
        `Gagal dihapus: *${result.failed}*\n\n` +
        `File database utama, backup, session, dan assets tetap aman.`;
      await sock.sendMessage(from, { text }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(from, { text: `❌ Pembersihan gagal: ${error.message}` }, { quoted: msg });
    }
  },
};