const path = require('path');
const { getDirectoryUsage, getFilesystemUsage } = require('../../lib/storage-usage');

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / (1024 ** 2)).toFixed(2)} MB`;
  return `${(bytes / (1024 ** 3)).toFixed(2)} GB`;
}

module.exports = {
  name: 'storage',
  category: 'owner',
  aliases: ['diskusage'],
  async execute(sock, msg, args, ctx) {
    const { from, config } = ctx;
    let isOwner = false;
    try { isOwner = Boolean(ctx.isSenderOwner && ctx.isSenderOwner()); } catch {}
    if (!isOwner) {
      return sock.sendMessage(from, { text: '❌ Perintah ini khusus untuk owner.' }, { quoted: msg });
    }

    try {
      const root = path.join(__dirname, '..', '..');
      const folders = ['session', 'database', 'assets'];
      const usage = folders.map(name => ({
        name,
        ...getDirectoryUsage(path.join(root, name)),
      }));
      const disk = getFilesystemUsage(root);
      const session = usage.find(folder => folder.name === 'session');
      const largestSessionFiles = session.largestFiles.length
        ? session.largestFiles.map((file, index) =>
          `  ${index + 1}. ${file.path} — ${formatBytes(file.bytes)}`,
        ).join('\n')
        : '  Belum ada file session.';
      const text = `╔══════════════════════════════════════╗
║        💾  *STORAGE BOT*  💾
╚══════════════════════════════════════╝

${usage.map(folder => `📁 ${folder.name}: *${formatBytes(folder.bytes)}* · ${folder.files} file`).join('\n')}

🖥️ Ruang tersedia: *${formatBytes(disk.availableBytes)}* dari ${formatBytes(disk.totalBytes)}

File session terbesar:
${largestSessionFiles}

Laporan ini hanya membaca ukuran file; tidak ada session atau key yang dihapus.`;
      await sock.sendMessage(from, { text }, { quoted: msg });
    } catch (error) {
      await sock.sendMessage(from, { text: `❌ Gagal membaca storage: ${error.message}` }, { quoted: msg });
    }
  },
};