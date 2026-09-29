module.exports = {
  name: 'cekLID',
  category: 'info',
  aliases: ['myid', 'lidku'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;

    const info = `
🔍 *DEBUG INFO*

📱 *Nomor Bot (me):*
 id: \`${sock.user.id}\`
 lid: \`${sock.user.lid}\`

👤 *Pengirim (sender):*
 participant: \`${msg.key.participant || '-'}\`
 participantAlt: \`${msg.key.participantAlt || '-'}\`
 participantPn: \`${msg.key.participantPn || '-'}\`
 remoteJid: \`${msg.key.remoteJid || '-'}\`
 remoteJidAlt: \`${msg.key.remoteJidAlt || '-'}\`

📞 *Owner di config:*
 \`628139525985\`

👇 *Copy LID kamu* (yang di atas) dan kirim ke owner biar dimasukin config.
    `.trim();

    await sock.sendMessage(from, { text: info });
  },
};