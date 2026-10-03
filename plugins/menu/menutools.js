module.exports = {
  name: 'menutools',
  category: 'menu',
  aliases: ['menutool'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;

    const menuText = `╔══════════════════════════════════╗
║      🛠️ *MENU TOOLS*
╚══════════════════════════════════╝

🎨 *STICKER*
${config.prefix}sticker (reply gambar)
${config.prefix}toimg (reply sticker)
${config.prefix}emojimix <emoji>+<emoji>

📤 *UPLOAD*
${config.prefix}tourl (reply media)

📥 *DOWNLOAD* 🅟
${config.prefix}youtube <url>
${config.prefix}ytmp3 <url>
${config.prefix}tiktok <url>
${config.prefix}instagram <url>

📖 *INFO*
${config.prefix}wiki <topik>
${config.prefix}cuaca <kota>
${config.prefix}jam
${config.prefix}statusbot

🧠 *PREMIUM AI ASSISTANT*
${config.prefix}ai <pertanyaan>
${config.prefix}ask <pertanyaan>

⚙️ *UTILITY*
${config.prefix}bmi <berat> <tinggi>
${config.prefix}acakangka <min> <max>
${config.prefix}reminder <5m> <teks>
${config.prefix}translate <kata>
${config.prefix}cekpasangan <nama1> + <nama2>

🔮 *RAMALAN*
${config.prefix}jodoh @user
${config.prefix}sifat <nama>`;

    await sock.sendMessage(from, { text: menuText });
  },
};