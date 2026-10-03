const { renderMenu } = require('../../lib/menu-layout');

module.exports = {
  name: 'menutools',
  category: 'menu',
  aliases: ['menutool'],
  async execute(sock, msg, args, ctx) {
    const { config, from, pluginList } = ctx;
    const menuText = renderMenu({
      botName: config.botName,
      title: 'ALAT & UTILITAS',
      prefix: config.prefix,
      pluginList,
      includeCategories: ['tools', 'sticker', 'download'],
      sections: [
        { icon: '🎨', title: 'STIKER', items: [`${config.prefix}sticker (balas gambar/video)`, `${config.prefix}toimg (balas stiker)`, `🅟 ${config.prefix}emojimix 😀+🔥`] },
        { icon: '✨', title: 'PENINGKATAN FOTO & VIDEO', items: [`${config.prefix}hd (upscale foto cepat & sharp)`, `${config.prefix}hda (AI super-resolution foto; maksimal 512×512)`, `${config.prefix}hdvideo (upscale & sharpen video; maksimal 60 detik)`] },
        { icon: '📤', title: 'UNGGAH MEDIA', items: [`🅟 ${config.prefix}tourl (balas media)`] },
        { icon: '📥', title: 'UNDUH MEDIA', items: [`${config.prefix}youtube <tautan>`, `${config.prefix}ytmp3 <tautan>`, `${config.prefix}tiktok <tautan>`, `${config.prefix}instagram <tautan>`] },
        { icon: '🔳', title: 'QR CODE', items: [`${config.prefix}qr <teks atau tautan>`] },
        { icon: '📖', title: 'INFORMASI', items: [`${config.prefix}wiki <topik>`, `${config.prefix}cuaca <kota>`, `${config.prefix}jam`, `${config.prefix}statusbot`] },
        { icon: '🧠', title: 'ASISTEN AI PREMIUM', items: [`${config.prefix}ai <pertanyaan>`, `${config.prefix}ask <pertanyaan>`] },
        { icon: '⚙️', title: 'UTILITAS', items: [`${config.prefix}bmi <berat> <tinggi>`, `${config.prefix}acakangka <minimum> <maksimum>`, `${config.prefix}reminder <5m> <pesan>`, `${config.prefix}translate <teks>`, `${config.prefix}cekpasangan <nama1> + <nama2>`] },
        { icon: '🔮', title: 'RAMALAN', items: [`${config.prefix}jodoh @user`, `${config.prefix}sifat <nama>`] },
      ],
      footer: ['🅟 = Fitur Premium · 🅛 = Menggunakan limit'],
    });
    await sock.sendMessage(from, { text: menuText }, { quoted: msg });
  },
};
