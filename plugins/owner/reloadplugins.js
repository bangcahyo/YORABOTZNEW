const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'reloadplugins',
  category: 'owner',
  aliases: ['reloadp', 'reload'],
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner } = ctx;

    let isOwner = false;
    try { isOwner = isSenderOwner && isSenderOwner(); } catch {}
    if (!isOwner) return;

    await sock.sendMessage(from, { text: '🔄 Reloading plugins...' });

    try {
      const pluginDir = path.join(__dirname, '..');
      const categories = fs.readdirSync(pluginDir).filter(f =>
        fs.statSync(path.join(pluginDir, f)).isDirectory()
      );

      let loaded = 0;
      let failed = 0;
      const errors = [];

      for (const cat of categories) {
        const catPath = path.join(pluginDir, cat);
        const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'));

        for (const file of files) {
          try {
            delete require.cache[require.resolve(path.join(catPath, file))];
            const p = require(path.join(catPath, file));
            if (!p.name || !p.execute) {
              failed++;
              errors.push(`${cat}/${file}: format invalid`);
              continue;
            }
            loaded++;
          } catch (err) {
            failed++;
            errors.push(`${cat}/${file}: ${err.message}`);
          }
        }
      }

      let reportText = `✅ *RELOAD SELESAI*\n\n📦 Loaded: ${loaded}\n❌ Failed: ${failed}`;
      if (errors.length > 0) {
        reportText += `\n\n*Error:*\n${errors.slice(0, 5).map(e => `• ${e}`).join('\n')}`;
      }
      reportText += `\n\n💡 Ketik \`.restartbot\` untuk full restart.`;

      await sock.sendMessage(from, { text: reportText });
    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Error: ${e.message}` });
    }
  },
};