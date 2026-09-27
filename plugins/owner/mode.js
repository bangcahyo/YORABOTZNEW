module.exports = {
  name: 'mode', category: 'owner', aliases: ['botmode'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const mode = config.botMode || 'public';
    await sock.sendMessage(from, {
      text: `📌 Mode: *${mode.toUpperCase()}*\n${mode === 'self' ? 'Bot hanya merespon owner.' : 'Bot merespon semua orang.'}`
    }, { quoted: msg });
  }
};