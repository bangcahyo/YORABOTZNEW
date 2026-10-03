const fs = require('fs');
const path = require('path');
const { getBackupStatus, verifyLatestBackup, sendLatestBackup } = require('../../lib/database-backup');
module.exports = {
  name: 'backup', category: 'owner', aliases: ['backupdb'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner, DB_PATH, GROUP_PATH, MODE_PATH, flushDatabase } = ctx;
    if (!isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya owner!' }, { quoted: msg });
    try {
      if (String(args[0] || '').toLowerCase() === 'latest') {
        await sendLatestBackup(sock, from, msg);
        return;
      }
      if (String(args[0] || '').toLowerCase() === 'status') {
        const intervalHours = Number(config.databaseBackup?.intervalHours) || 24;
        const status = getBackupStatus({ intervalMs: intervalHours * 60 * 60 * 1000 });
        const retention = Math.max(1, Number(config.databaseBackup?.retentionCount) || 7);
        const latestText = status.latest
          ? `Backup terbaru: *${new Date(status.latest.mtimeMs).toLocaleString('id-ID')}*\n` +
            `Umur: *${(status.ageMs / (60 * 60 * 1000)).toFixed(1)} jam* · ${status.isFresh ? '✅ Masih baru' : '⚠️ Perlu backup baru'}\n` +
            `Ukuran: *${(status.latest.size / (1024 ** 2)).toFixed(2)} MB*`
          : 'Belum ada backup otomatis.';
        await sock.sendMessage(from, {
          text: `💾 *STATUS BACKUP OTOMATIS*\n\n` +
            `${latestText}\n` +
            `Salinan tersimpan: *${status.count}/${retention}* · Total ${ (status.totalBytes / (1024 ** 2)).toFixed(2) } MB\n` +
            `Jadwal: setiap ${intervalHours} jam · ${config.databaseBackup?.enabled === false ? 'NONAKTIF' : 'AKTIF'}`,
        }, { quoted: msg });
        return;
      }
      if (String(args[0] || '').toLowerCase() === 'verify') {
        const result = verifyLatestBackup();
        const text = result.ok
          ? `✅ *BACKUP VALID*\n\nFile: ${result.latest.name}\nTanggal: ${result.timestamp || new Date(result.latest.mtimeMs).toLocaleString('id-ID')}\nUsers: ${result.users}\nGroups: ${result.groups}\nUkuran: ${(result.latest.size / (1024 ** 2)).toFixed(2)} MB\n\nFormat siap digunakan dengan .restore.`
          : `⚠️ *BACKUP TIDAK VALID*\n\n${result.latest ? `File: ${result.latest.name}\n` : ''}${result.error}`;
        await sock.sendMessage(from, { text }, { quoted: msg });
        return;
      }
      if (typeof flushDatabase === 'function') await flushDatabase();
      const usersData = fs.existsSync(DB_PATH) ? fs.readFileSync(DB_PATH, 'utf-8') : '{}';
      const groupsData = fs.existsSync(GROUP_PATH) ? fs.readFileSync(GROUP_PATH, 'utf-8') : '{}';
      const modeData = fs.existsSync(MODE_PATH) ? fs.readFileSync(MODE_PATH, 'utf-8') : '{}';
      const backupData = {
        timestamp: new Date().toISOString(),
        botName: config.botName,
        users: JSON.parse(usersData),
        groups: JSON.parse(groupsData),
        mode: JSON.parse(modeData),
      };
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `backup-${timestamp}.json`;
      const backupPath = path.join(__dirname, '..', '..', 'database', backupFileName);
      fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
      await sock.sendMessage(from, {
        document: fs.readFileSync(backupPath),
        mimetype: 'application/json',
        fileName: backupFileName,
        caption: `✅ Backup berhasil!\n\nTanggal: ${new Date().toLocaleString('id-ID')}\nUsers: ${Object.keys(backupData.users).length}\nGroups: ${Object.keys(backupData.groups).length}`,
      }, { quoted: msg });
      setTimeout(() => { try { fs.unlinkSync(backupPath); } catch {} }, 60000);
    } catch (err) {
      await sock.sendMessage(from, { text: `Gagal backup: ${err.message}` }, { quoted: msg });
    }
  }
};