const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'savefile',
  category: 'owner',
  aliases: ['sf', 'upload'],
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner, downloadMediaMessage, config } = ctx;

    let isOwner = false;
    try { isOwner = isSenderOwner && isSenderOwner(); } catch {}
    if (!isOwner) return sock.sendMessage(from, { text: '❌ Hanya owner!' });

    const targetPath = args[0];
    if (!targetPath) {
      return sock.sendMessage(from, {
        text: `📁 *CARA PAKAI savefile*\n\nReply file → ketik \`.savefile <path>\`\n\nContoh:\n• \`.savefile index.js\`\n• \`.savefile plugins/menu/menu.js\`\n• \`.savefile assets/menu.jpg\``,
      });
    }

    const quotedMsg = msg.message.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quotedMsg) return sock.sendMessage(from, { text: '❌ Reply file yang mau disimpan!' });

    try {
      const fullMsg = {
        key: {
          remoteJid: from,
          id: msg.message.extendedTextMessage.contextInfo.stanzaId,
          fromMe: false,
        },
        message: quotedMsg,
      };

      const stream = await downloadMediaMessage(fullMsg, 'buffer', {}, { logger: console });
      if (!stream) return sock.sendMessage(from, { text: '❌ Gagal download file.' });

      const rootDir = path.join(__dirname, '..', '..');
      const fullPath = path.resolve(rootDir, targetPath);
      if (!fullPath.startsWith(rootDir)) return sock.sendMessage(from, { text: '❌ Akses ditolak!' });

      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      let backupInfo = '';
      if (fs.existsSync(fullPath)) {
        fs.copyFileSync(fullPath, fullPath + '.bak');
        backupInfo = `\n💾 Backup: \`${path.basename(fullPath)}.bak\``;
      }

      fs.writeFileSync(fullPath, stream);
      const sizeKB = (stream.length / 1024).toFixed(2);

      await sock.sendMessage(from, {
        text: `✅ *FILE TERSIMPAN!*\n\n📁 Path: \`${targetPath}\`\n📏 Ukuran: ${sizeKB} KB${backupInfo}\n\n💡 Ketik \`.restartbot\` untuk apply.`,
      });
    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Gagal: ${e.message}` });
    }
  },
};