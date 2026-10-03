const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menuowner',
  category: 'menu',
  aliases: ['menuown'],
  async execute(sock, msg, args, ctx) {
    const { config, from, pluginList } = ctx;
    const isOwner = Boolean(ctx.isSenderOwner && ctx.isSenderOwner());
    if (!isOwner) {
      return sock.sendMessage(from, {
        text: `❌ *AKSES DITOLAK*\n\nMenu ini hanya dapat diakses oleh owner.\n\n👑 ${config.ownerName}\n📞 ${config.ownerNumber}`,
      }, { quoted: msg });
    }

    const menuText = renderMenu({
      botName: config.botName,
      title: 'PANEL OWNER',
      prefix: config.prefix,
      pluginList,
      includeCategories: ['owner'],
      sections: [
        {
          icon: '👥',
          title: 'KELOLA PENGGUNA',
          items: [
            `${config.prefix}addlimit @user <jumlah>`,
            `${config.prefix}addmoney @user <jumlah>`,
            `${config.prefix}addpoint @user <jumlah>`,
            `${config.prefix}setlimit @user <jumlah>`,
            `${config.prefix}setmoney @user <jumlah>`,
            `${config.prefix}resetuser @user`,
          ],
        },
        { icon: '💎', title: 'KELOLA PREMIUM', items: [`${config.prefix}addpremium @user <hari>`, `${config.prefix}delpremium @user`, `${config.prefix}listpremium`] },
        { icon: '📢', title: 'KOMUNIKASI', items: [`${config.prefix}broadcast <pesan>`, `${config.prefix}autobroadcast`] },
        { icon: '💾', title: 'BACKUP & PEMULIHAN', items: [`${config.prefix}backup — kirim backup sekarang`, `${config.prefix}backup status — cek backup otomatis`, `${config.prefix}backup verify — validasi snapshot terbaru`, `${config.prefix}backup latest — kirim backup otomatis terbaru`, `Backup otomatis: harian, simpan 7 salinan`, `${config.prefix}restore`, `${config.prefix}restoreyes`, `${config.prefix}restoreno`] },
        { icon: '🔒', title: 'MODE & KEAMANAN', items: [`${config.prefix}self`, `${config.prefix}public`, `${config.prefix}accessmode <self/public>`, `${config.prefix}mode`, `${config.prefix}security`, `${config.prefix}whitelist <aksi>`] },
        { icon: '⚙️', title: 'PENGATURAN', items: [`${config.prefix}showconfig`, `${config.prefix}getcfg <key>`, `${config.prefix}setcfg <key> <value>`, `${config.prefix}toggle <key>`, `${config.prefix}reloadcfg`] },
        { icon: '📁', title: 'PENGELOLAAN FILE', items: [`${config.prefix}readfile <lokasi>`, `${config.prefix}listfiles <folder>`, `${config.prefix}savefile <lokasi>`, `${config.prefix}storage — cek penggunaan disk`, `${config.prefix}cleanup — pratinjau cache/temp`, `${config.prefix}cleanup confirm — hapus kandidat`] },
        { icon: '🔧', title: 'SISTEM & PEMANTAUAN', items: [`${config.prefix}reloadplugins`, `${config.prefix}restartbot`, `${config.prefix}restartsafe <detik> <alasan>`, `${config.prefix}systemaudit`, `${config.prefix}commandstats`, `${config.prefix}activitylog`, `${config.prefix}alerts`, `${config.prefix}dashboard`, `${config.prefix}runtime`, `${config.prefix}ping`] },
      ],
      footer: ['Command pada panel ini khusus untuk owner.'],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};
