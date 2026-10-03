module.exports = {
  name: 'commands',
  category: 'info',
  aliases: ['commandlist', 'cmds', 'allcmd', 'feature'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const prefix = config.prefix || '.';
    const categories = {
      download: '📥 Download',
      ekonomi: '💰 Ekonomi',
      fun: '🎭 Fun & Random',
      game: '🎮 Game',
      group: '🛡️ Grup & Admin',
      info: 'ℹ️ Informasi',
      level: '📊 Level',
      menu: '📂 Menu',
      owner: '👑 Owner',
      sticker: '🎨 Sticker',
      tools: '🛠️ Tools & Utility',
    };
    const grouped = new Map();
    for (const plugin of ctx.pluginList || []) {
      const category = plugin.category || 'other';
      if (!grouped.has(category)) grouped.set(category, []);

      const aliases = [...new Set((plugin.aliases || [])
        .map(alias => String(alias).toLowerCase())
        .filter(alias => /^[a-z0-9_-]+$/.test(alias) && alias !== plugin.name.toLowerCase()))];
      const aliasText = aliases.length ? ` (${aliases.map(alias => `${prefix}${alias}`).join(', ')})` : '';
      grouped.get(category).push(`  • ${prefix}${plugin.name}${aliasText}`);
    }

    const commandGroups = [...grouped.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, commands]) =>
        `${categories[category] || `📦 ${category}`}\n${commands.sort().join('\n')}`,
      )
      .join('\n\n');

    const text = `╔══════════════════════════════════════╗
║      📚  *COMMAND LIST*  📚
╚══════════════════════════════════════╝

📦 Total plugin command: *${(ctx.pluginList || []).length}*

${commandGroups}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Gunakan ${prefix}menu untuk melihat menu utama.
💡 Gunakan ${prefix}tutorial untuk panduan cepat.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
