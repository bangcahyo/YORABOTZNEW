const fs = require('fs');
const path = require('path');
module.exports = {
  name: 'backup', category: 'owner', aliases: ['backupdb'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner, DB_PATH, GROUP_PATH, MODE_PATH } = ctx;
    if (!isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya owner!' }, { quoted: msg });
    try {
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