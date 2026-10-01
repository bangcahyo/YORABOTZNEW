const AWALAN = [
  'Cahaya', 'Bintang', 'Embun', 'Angin', 'Mentari', 'Bulan', 'Pelangi', 'Samudra',
  'Gunung', 'Bunga', 'Api', 'Air', 'Tanah', 'Langit', 'Awan', 'Kabut',
];
const SIFAT = [
  'yang Bijaksana', 'yang Pemberani', 'yang Setia', 'yang Cerdas', 'yang Penyayang',
  'yang Sabar', 'yang Kuat', 'yang Tenang', 'yang Ceria', 'yang Jujur',
  'yang Teguh', 'yang Lembut', 'yang Tangguh', 'yang Mulia',
];
const AKHIR = [
  'Sejati', 'Abadi', 'Mulia', 'Utama', 'Perkasa', 'Agung', 'Wijaya', 'Cendekia',
  'Berseri', 'Bahagia', 'Sentosa', 'Mandiri', 'Gemilang', 'Terang',
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 37 + str.charCodeAt(i)) % 1000003;
  }
  return h;
}

module.exports = {
  name: 'artinama',
  category: 'fun',
  aliases: ['artinamaku', 'maknanama'],
  async execute(sock, msg, args, ctx) {
    const { config, from, mentioned, pushName } = ctx;
    const target = (mentioned && mentioned[0]) || null;
    const nama = (args.join(' ') || (target ? target.split('@')[0] : pushName)).trim();

    if (!nama) {
      return sock.sendMessage(from, { text: `📝 Contoh: *${config.prefix}artinama Budi Santoso*` }, { quoted: msg });
    }

    const h = hash(nama.toLowerCase());
    const a = AWALAN[h % AWALAN.length];
    const s = SIFAT[(h >> 3) % SIFAT.length];
    const e = AKHIR[(h >> 6) % AKHIR.length];
    const arti = `${a} ${s} nan ${e}`;

    await sock.sendMessage(from, {
      text: `📖 *ARTI NAMA*\n\n` +
        `👤 Nama   : *${nama}*\n` +
        `✨ Arti   : *${arti}*\n\n` +
        `_Nama adalah doa. Semoga sesuai dengan maknanya!_ 🙏\n\n` +
        `_${config.botName}_`,
      mentions: target ? [target] : [],
    }, { quoted: msg });
  },
};
