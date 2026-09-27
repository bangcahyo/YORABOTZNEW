const fs = require('fs');
module.exports = {
  name: 'restore', category: 'owner', aliases: ['restoredb'],
  async execute(sock, msg, args, ctx) {
    const { config, from, sender, isSenderOwner } = ctx;
    if (!isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya owner!' }, { quoted: msg });
    const quotedMsg = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quotedMsg || !quotedMsg.documentMessage) {
      return sock.sendMessage(from, { text: `Cara pakai:\n1. Reply file backup\n2. Ketik ${config.prefix}restore` }, { quoted: msg });
    }
    try {
      const docMsg = quotedMsg.documentMessage;
      const stream = await sock.downloadMediaMessage({
        key: msg.message.extendedTextMessage.contextInfo.stanzaId ? {
          remoteJid: from,
          id: msg.message.extendedTextMessage.contextInfo.stanzaId,
          fromMe: false,
        } : msg.key,
        message: { documentMessage: docMsg },
      });
      const backupData = JSON.parse(stream.toString('utf-8'));
      if (!backupData.users || !backupData.groups) return sock.sendMessage(from, { text: 'File backup tidak valid!' }, { quoted: msg });
      await sock.sendMessage(from, {
        text: `⚠️ *KONFIRMASI RESTORE*\n\nBackup dari: ${backupData.timestamp || 'Unknown'}\nUsers: ${Object.keys(backupData.users).length}\nGroups: ${Object.keys(backupData.groups).length}\n\nKetik *${config.prefix}restoreyes* (30 detik).`,
      }, { quoted: msg });
      global.pendingRestore = global.pendingRestore || {};
      global.pendingRestore[from] = { data: backupData, sender, timeout: Date.now() + 30000 };
    } catch (err) {
      await sock.sendMessage(from, { text: `Gagal restore: ${err.message}` }, { quoted: msg });
    }
  }
};