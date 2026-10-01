const KOMENTAR = [
  'Cantiknya bikin bunga malu-malu! 🌸',
  'Wajahnya manis, senyumnya bikin lupa waktu! 😊',
  'Cantik natural, tanpa makeup pun mempesona! ✨',
  'Pesonanya lembut, bikin hati adem! 🕊️',
  'Cantiknya kayak bidadari turun ke bumi! 🧚',
  'Menawan dan anggun, calon ratu! 👑',
  'Cantiknya bikin langit ikut tersenyum! 🌈',
  'Wajahnya seperti lukisan, indah sekali! 🎨',
  'Cantik luar dalam, jangan lupa bersyukur! 🙏',
  'Pesonanya bikin orang lupa segalanya! 💖',
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 100000;
  }
  return h;
}

module.exports = {
  name: 'cekcantik',
  category: 'fun',
  aliases: ['cantik', 'cekcantikcek'],
  async execute(sock, msg, args, ctx) {
    const { from, mentioned, pushName, random } = ctx;
    const target = (mentioned && mentioned[0]) || null;
    const nama = target ? target.split('@')[0] : (args.join(' ') || pushName);
    const persen = 60 + (hash(nama.toLowerCase()) % 41);
    const bar = '█'.repeat(Math.round(persen / 10)) + '░'.repeat(10 - Math.round(persen / 10));
    await sock.sendMessage(from, {
      text: `😍 *CEK CANTIK*\n\n` +
        `👤 Nama   : *${nama}*\n` +
        `📊 Skor   : *${persen}%*\n` +
        `[${bar}]\n\n` +
        `${random(KOMENTAR)}`,
      mentions: target ? [target] : [],
    }, { quoted: msg });
  },
};
