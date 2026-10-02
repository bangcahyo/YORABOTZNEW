const config = require('../../config');

module.exports = {
  name: 'whitelist',
  category: 'owner',
  aliases: ['whitelistgroup', 'groupwhitelist', 'allowedgroups'],
  async execute(sock, msg, args, ctx) {
    const { from, isSenderOwner } = ctx;

    if (!isSenderOwner || !isSenderOwner()) {
      return sock.sendMessage(from, { text: '❌ Hanya owner yang bisa mengatur whitelist grup.' }, { quoted: msg });
    }

    const sub = (args[0] || '').toLowerCase();
    const groupJid = msg.key?.remoteJid || args[1] || '';
    const wl = config.whitelistGroup || { enabled: false, groups: [] };
    wl.groups = Array.isArray(wl.groups) ? wl.groups : [];

    if (sub === 'on') {
      wl.enabled = true;
      config.whitelistGroup = wl;
      if (config.ownerAlerts?.enabled !== false && config.ownerAlerts?.onWhitelistChange !== false && ctx.notifyOwner) {
        ctx.notifyOwner('🔒 *WHITELIST DIAKTIFKAN*\n\nOwner: *' + (msg.key?.participant || msg.key?.remoteJid || 'unknown') + '*\nBot hanya akan aktif di grup yang masuk daftar.');
      }
      return sock.sendMessage(from, { text: '✅ *Whitelist grup diaktifkan.*\n\nBot hanya akan berfungsi pada grup yang masuk daftar.' }, { quoted: msg });
    }

    if (sub === 'off') {
      wl.enabled = false;
      config.whitelistGroup = wl;
      if (config.ownerAlerts?.enabled !== false && config.ownerAlerts?.onWhitelistChange !== false && ctx.notifyOwner) {
        ctx.notifyOwner('🔓 *WHITELIST DIMATIKAN*\n\nOwner: *' + (msg.key?.participant || msg.key?.remoteJid || 'unknown') + '*\nBot kembali aktif di semua grup.');
      }
      return sock.sendMessage(from, { text: '❌ *Whitelist grup dimatikan.*\n\nBot kembali aktif di semua grup.' }, { quoted: msg });
    }

    if (sub === 'add') {
      if (!groupJid || !groupJid.endsWith('@g.us')) {
        return sock.sendMessage(from, { text: `Format: *${config.prefix}whitelist add <groupjid>*\n\nContoh: *${config.prefix}whitelist add 120363xxxxx@g.us*` }, { quoted: msg });
      }
      if (!wl.groups.includes(groupJid)) wl.groups.push(groupJid);
      config.whitelistGroup = wl;
      if (config.ownerAlerts?.enabled !== false && config.ownerAlerts?.onWhitelistChange !== false && ctx.notifyOwner) {
        ctx.notifyOwner('🟢 *GRUP DITAMBAH KE WHITELIST*\n\nGroup: *' + groupJid + '*\nOwner: *' + (msg.key?.participant || msg.key?.remoteJid || 'unknown') + '*');
      }
      return sock.sendMessage(from, { text: `✅ Grup ditambahkan ke whitelist:\n${groupJid}` }, { quoted: msg });
    }

    if (sub === 'del' || sub === 'remove') {
      if (!groupJid || !groupJid.endsWith('@g.us')) {
        return sock.sendMessage(from, { text: `Format: *${config.prefix}whitelist del <groupjid>*\n\nContoh: *${config.prefix}whitelist del 120363xxxxx@g.us*` }, { quoted: msg });
      }
      wl.groups = wl.groups.filter(g => g !== groupJid);
      config.whitelistGroup = wl;
      if (config.ownerAlerts?.enabled !== false && config.ownerAlerts?.onWhitelistChange !== false && ctx.notifyOwner) {
        ctx.notifyOwner('🟡 *GRUP DIHAPUS DARI WHITELIST*\n\nGroup: *' + groupJid + '*\nOwner: *' + (msg.key?.participant || msg.key?.remoteJid || 'unknown') + '*');
      }
      return sock.sendMessage(from, { text: `🗑️ Grup dihapus dari whitelist:\n${groupJid}` }, { quoted: msg });
    }

    if (sub === 'list') {
      const list = wl.groups.length ? wl.groups.join('\n• ') : 'Belum ada grup dalam whitelist.';
      return sock.sendMessage(from, { text: `📋 *DAFTAR WHITELIST GRUP*\n\n• ${list}` }, { quoted: msg });
    }

    config.whitelistGroup = wl;
    const status = wl.enabled ? 'AKTIF' : 'NONAKTIF';
    const text = `🔒 *WHITELIST GRUP*\n\n` +
      `Status: *${status}*\n` +
      `Jumlah grup: *${wl.groups.length}*\n\n` +
      `Perintah:
• ${config.prefix}whitelist on
• ${config.prefix}whitelist off
• ${config.prefix}whitelist add <groupjid>
• ${config.prefix}whitelist del <groupjid>
• ${config.prefix}whitelist list`;

    await sock.sendMessage(from, { text }, { quoted: msg });
  },
};
