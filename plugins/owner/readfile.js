const fs = require('fs');
const path = require('path');
module.exports = {
  name: 'readfile', category: 'owner',
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner } = ctx;
    if (!isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya owner!' }, { quoted: msg });
    const filePath = args[0];
    if (!filePath) return sock.sendMessage(from, { text: `Format: ${config.prefix}readfile <path>` }, { quoted: msg });
    const rootDir = path.join(__dirname, '..', '..');
    const fullPath = path.resolve(rootDir, filePath);
    if (!fullPath.startsWith(rootDir)) return sock.sendMessage(from, { text: 'Akses ditolak!' }, { quoted: msg });
    if (!fs.existsSync(fullPath)) return sock.sendMessage(from, { text: `File tidak ada: ${filePath}` }, { quoted: msg });
    const content = fs.readFileSync(fullPath, 'utf-8');
    const size = fs.statSync(fullPath).size;
    if (size > 4000) {
      await sock.sendMessage(from, {
        document: fs.readFileSync(fullPath),
        mimetype: 'text/plain',
        fileName: path.basename(filePath),
        caption: `📂 ${filePath}\nSize: ${size} bytes`,
      }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: `📂 *${filePath}*\n\n\`\`\`\n${content}\n\`\`\`` }, { quoted: msg });
    }
  }
};