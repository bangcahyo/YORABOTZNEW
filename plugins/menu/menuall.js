const { renderMenu } = require('../../lib/menu-layout');

const categoryDetails = {
  menu: { icon: '📚', title: 'MENU & NAVIGASI' },
  download: { icon: '⬇️', title: 'DOWNLOAD' },
  ekonomi: { icon: '💰', title: 'EKONOMI' },
  fun: { icon: '🎉', title: 'HIBURAN' },
  game: { icon: '🎮', title: 'PERMAINAN' },
  group: { icon: '👥', title: 'GRUP' },
  info: { icon: 'ℹ️', title: 'INFORMASI' },
  level: { icon: '🏆', title: 'LEVEL & PERINGKAT' },
  owner: { icon: '👑', title: 'OWNER' },
  sticker: { icon: '🖼️', title: 'STIKER' },
  tools: { icon: '🛠️', title: 'TOOLS & UTILITAS' },
};

const categoryOrder = Object.keys(categoryDetails);

module.exports = {
  name: 'menuall',
  category: 'menu',
  aliases: ['allmenu'],
  async execute(sock, msg, args, ctx) {
    const { config, from, pluginList = [] } = ctx;
    const prefix = config.prefix || '.';
    const isOwner = Boolean(ctx.isSenderOwner && ctx.isSenderOwner());
    const groupedCommands = new Map();

    for (const plugin of pluginList) {
      const category = plugin.category || 'other';
      if (category === 'owner' && !isOwner) continue;
      if (!groupedCommands.has(category)) groupedCommands.set(category, []);
      groupedCommands.get(category).push(plugin.name);
    }

    const categories = [...groupedCommands.keys()].sort((left, right) => {
      const leftOrder = categoryOrder.indexOf(left);
      const rightOrder = categoryOrder.indexOf(right);
      if (leftOrder !== rightOrder) {
        return (leftOrder < 0 ? categoryOrder.length : leftOrder)
          - (rightOrder < 0 ? categoryOrder.length : rightOrder);
      }
      return left.localeCompare(right);
    });
    const totalCommands = [...groupedCommands.values()].reduce((total, names) => total + names.length, 0);
    const sections = categories.map(category => {
      const details = categoryDetails[category] || {
        icon: '▪️',
        title: category.toUpperCase(),
      };
      return {
        ...details,
        items: groupedCommands.get(category)
          .sort((left, right) => left.localeCompare(right))
          .map(name => `${prefix}${name}`),
      };
    });
    const menuText = renderMenu({
      botName: config.botName,
      title: 'SEMUA COMMAND',
      prefix,
      sections,
      footer: [`Total command: *${totalCommands}*`],
    });

    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};