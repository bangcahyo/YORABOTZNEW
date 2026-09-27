const fs = require('fs');
const path = require('path');
module.exports = {
  name: 'listfiles', category: 'owner', aliases: ['ls'],
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner } = ctx;
    if (!isSenderOwner()) return sock.sendMessage(from, { text: '❌ Hanya owner!' }, { quoted: msg });
    const rootDir = path.join(__dirname, '..', '..');
    const dir = args[0] || '.';
    const fullPath = path.resolve(rootDir, dir);
    if (!fullPath.startsWith(rootDir)) return sock.sendMessage(from, { text: 'Akses ditolak!' }, { quoted: msg });
    if (!fs.existsSync(fullPath)) return sock.sendMessage(from, { text: `Folder tidak ada: ${dir}` }, { quoted: msg });
    const items = fs.readdirSync(fullPath, { withFileTypes: true });
    let txt = `📂 *${dir}/*\n\n`;
    items.forEach(item => {
      if (item.name.startsWith('.') && item.name !== '.gitignore') return;
      const stat = fs.statSync(path.join(fullPath, item.name));
      if (item.isDirectory()) txt += `📁 ${item.name}/\n`;
      else txt += `📄 ${item.name} (${stat.size}b)\n`;
    });
    await sock.sendMessage(from, { text: txt }, { quoted: msg });
  }
};