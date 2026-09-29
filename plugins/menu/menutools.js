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

📤 *UPLOAD*
${config.prefix}tourl (reply media)

📖 *INFO*
${config.prefix}wiki <topik>
${config.prefix}cuaca <kota>

🔮 *RAMALAN*
${config.prefix}jodoh @user
${config.prefix}sifat <nama>`;

    await sock.sendMessage(from, { text: menuText });
  },
};