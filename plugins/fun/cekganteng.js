const KOMENTAR = [
  'Gantengnya kebangetan, sampai bot pun ikut terpesona! 😍',
  'Wajahnya bikin hati berdebar-debar! 💓',
  'Ganteng maksimal, kayak artis Korea! 🇰🇷',
  'Pesona luar biasa, siapapun pasti menoleh! 👀',
  'Ganteng alami, tanpa filter pun tetap menawan! ✨',
  'Tampan dan berkarisma, calon idola! 🌟',
  'Gantengnya bikin cermin iri! 🪞',
  'Wajahnya seperti karya seni, indah dipandang! 🎨',
  'Ganteng level dewa, jangan lupa bersyukur! 🙏',
  'Pesonanya bikin lupa arah pulang! 🧭',
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 100000;
  }
  return h;
}

module.exports = {
  name: 'cekganteng',
  category: 'fun',
  aliases: ['ganteng', 'cekgantengcek'],
  async execute(sock, msg, args, ctx) {
    const { from, mentioned, pushName, random } = ctx;
    const target = (mentioned && mentioned[0]) || null;
    const nama = target ? target.split('@')[0] : (args.join(' ') || pushName);
    const persen = 60 + (hash(nama.toLowerCase()) % 41);
    const bar = '█'.repeat(Math.round(persen / 10)) + '░'.repeat(10 - Math.round(persen / 10));
    await sock.sendMessage(from, {
      text: `😎 *CEK GANTENG*\n\n` +
        `👤 Nama   : *${nama}*\n` +
        `📊 Skor   : *${persen}%*\n` +
        `[${bar}]\n\n` +
        `${random(KOMENTAR)}`,
      mentions: target ? [target] : [],
    }, { quoted: msg });
  },
};
