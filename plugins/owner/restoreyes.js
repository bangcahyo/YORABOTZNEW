const fs = require('fs');
module.exports = {
  name: 'restoreyes', category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { from, sender, isSenderOwner, DB_PATH, GROUP_PATH, MODE_PATH, flushDatabase, reloadDatabase } = ctx;
    if (!isSenderOwner()) return;
    const pending = global.pendingRestore?.[from];
    if (!pending || pending.sender !== sender || Date.now() > pending.timeout) {
      return sock.sendMessage(from, { text: 'Tidak ada konfirmasi restore.' }, { quoted: msg });
    }
    try {
      const { data } = pending;
      if (typeof flushDatabase === 'function') await flushDatabase();
      if (fs.existsSync(DB_PATH)) fs.copyFileSync(DB_PATH, DB_PATH + '.old');
      if (fs.existsSync(GROUP_PATH)) fs.copyFileSync(GROUP_PATH, GROUP_PATH + '.old');
      fs.writeFileSync(DB_PATH, JSON.stringify(data.users, null, 2));
      fs.writeFileSync(GROUP_PATH, JSON.stringify(data.groups, null, 2));
      if (data.mode) fs.writeFileSync(MODE_PATH, JSON.stringify(data.mode, null, 2));
      if (typeof reloadDatabase === 'function') reloadDatabase();
      delete global.pendingRestore[from];
      await sock.sendMessage(from, { text: `✅ Restore berhasil!\nUsers: ${Object.keys(data.users).length}\nGroups: ${Object.keys(data.groups).length}` }, { quoted: msg });
    } catch (err) {
      await sock.sendMessage(from, { text: `Gagal: ${err.message}` }, { quoted: msg });
    }
  }
};