const pkg = require('../../package.json');

function normalize(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildReply(input) {
  const q = normalize(input);

  const faqs = [
    {
      match: /(siapa|apa itu|bot apa|yang ini)/i,
      response: '🤖 Saya adalah *Yora Botz*, bot WhatsApp multipurpose yang fokus di game, ekonomi, grup, tools, premium, dan operasional bot.',
    },
    {
      match: /(fitur|command|menu|apa saja fitur)/i,
      response: '✨ Fitur utama saya mencakup game, fun, ekonomi, level, tools, premium, grup admin, download, owner tools, dan panduan cepat. Gunakan *.menu* atau *.commands* untuk lihat semua fitur.',
    },
    {
      match: /(premium|apa benefit premium|keuntungan premium)/i,
      response: '💎 Premium memberi akses fitur eksklusif seperti downloader premium, limit harian lebih banyak, multiplier hadiah, diskon shop, dan fitur eksklusif premium. Ketik *.premium* untuk info lengkap.',
    },
    {
      match: /(daftar|register|cara daftar|bergabung)/i,
      response: '📝 Untuk mulai pakai bot, ketik *.daftar <namamu>* lalu ikuti proses registrasi. Setelah terdaftar, kamu bisa menikmati fitur bot secara penuh.',
    },
    {
      match: /(limit|cara cek limit|limitku)/i,
      response: '🅛 Cek limit kamu dengan *.limit*. Fitur gratis dan premium memiliki policy berbeda; user premium dan owner tidak dipotong limit.',
    },
    {
      match: /(status bot|bot online|kondisi bot|runtime)/i,
      response: '📡 Kamu bisa cek status bot lewat *.statusbot* atau *.runtime*. Saya dirancang stabil untuk dipakai harian dan ada fitur monitoring owner.',
    },
    {
      match: /(tutorial|panduan|cara pakai|help)/i,
      response: '📚 Gunakan *.tutorial* atau *.commands* untuk melihat daftar fitur dan cara pakai bot dengan cepat.',
    },
    {
      match: /(owner|kontak owner|siapa owner)/i,
      response: '👑 Owner bot adalah *Cahyo Store*. Gunakan *.owner* untuk info kontak dan detail owner.',
    },
    {
      match: /(salam|halo|hi|hello|hai)/i,
      response: 'Halo! 😊 Saya siap membantu. Tanya soal fitur, premium, command, atau cara pakai bot. Contoh: *.ai premium* atau *.ai cara daftar*',
    },
    {
      match: /(versi|version|v7|v7 2)/i,
      response: '📦 Saya sedang berjalan di *versi ' + pkg.version + '* dengan banyak fitur real dan panel operasional yang makin lengkap.',
    },
  ];

  for (const item of faqs) {
    if (item.match.test(q)) return item.response;
  }

  if (q.includes('premium') && q.includes('beli')) {
    return '💳 Untuk beli premium, ketik *.premium* lalu pilih menu pembelian yang tersedia. Fitur premium memberi akses lebih banyak dan layanan lebih nyaman.';
  }

  if (q.includes('menu')) {
    return '📋 Gunakan *.menu* untuk menu utama, *.menutools* untuk tools, *.menugame* untuk game, dan *.menuowner* untuk panel owner.';
  }

  return '🧠 Saya belum punya jawaban khusus untuk pertanyaan itu. Coba tanya dengan kata kunci seperti: *premium*, *daftar*, *fitur*, *menu*, *limit*, atau *tutorial*.\n\nContoh:\n• *.ai premium*\n• *.ai cara daftar*\n• *.ai fitur*';
}

module.exports = {
  name: 'ai',
  category: 'tools',
  aliases: ['ask', 'assistant', 'askbot'],
  async execute(sock, msg, args, ctx) {
    const { config, from } = ctx;
    const input = (args || []).join(' ').trim();

    if (!input) {
      return sock.sendMessage(from, {
        text: '🧠 *PREMIUM AI ASSISTANT*\n\nContoh penggunaan:\n• *.ai premium*\n• *.ai cara daftar*\n• *.ai fitur*\n• *.ai tutorial*\n\nFitur ini hanya untuk user premium.',
      }, { quoted: msg });
    }

    const answer = buildReply(input);
    await sock.sendMessage(from, { text: answer }, { quoted: msg });
  },
};
