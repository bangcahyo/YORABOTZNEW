const PUISI = {
  cinta: ['Cinta ini bagai embun pagi,\nHadir tanpa pernah diminta,\nMengisi hati yang sunyi,\nMembuat hidup terasa berbeda.','Jika cinta adalah laut,\nMaka aku adalah perahunya,\nMengarungi takdir yang panjang,\nTanpa tahu kapan berlabuh.'],
  sedih: ['Malam ini bulan bersembunyi,\nBintang pun enggan menemani,\nHatiku sedih tanpa mengerti,\nKenapa dunia terasa sepi.','Air mata jatuh perlahan,\nSeperti hujan di musim kemarau,\nHati ini sungguh kecewa,\nTapi tetap berharap esok cerah.'],
  semangat: ['Bangkitlah wahai jiwa muda,\nMasa depan menantimu,\nJangan takut jatuh dan gagal,\nKarena sukses menanti usahamu.','Langkah kecil adalah awal,\nDari seribu langkah menuju puncak,\nJangan berhenti di tengah jalan,\nPercayalah, kau pasti bisa.'],
  alam: ['Gunung biru jauh menjulang,\nKabut putih memeluknya,\nSungai mengalir tanpa henti,\nItulah ciptaan Sang Pencipta.','Padi menguning di sawah,\nPetani tersenyum bahagia,\nAlam adalah sahabat setia,\nJagalah agar tetap lestari.'],
  sahabat: ['Sahabat datang silih berganti,\nAda yang tinggal, ada yang pergi,\nTapi yang benar-benar sejati,\nAkan selalu ada hingga nanti.','Terima kasih sahabatku,\nKau ada di saat susah maupun senang,\nKita bagi tawa dan air mata,\nSemoga persahabatan ini abadi.'],
};
module.exports = {
  name: 'puisi', category: 'fun',
  async execute(sock, msg, args, ctx) {
    const { config, from, random } = ctx;
    const tema = args[0]?.toLowerCase();
    const temaList = Object.keys(PUISI);
    if (!tema) {
      let txt = `📜 *PUISI*\n\nPilih tema:\n\n`;
      temaList.forEach((t, i) => { txt += `${i + 1}. ${t}\n`; });
      txt += `\nContoh: *${config.prefix}puisi cinta*`;
      return sock.sendMessage(from, { text: txt }, { quoted: msg });
    }
    if (!PUISI[tema]) return sock.sendMessage(from, { text: `❌ Tema tidak tersedia!\n\nTersedia: ${temaList.join(', ')}` }, { quoted: msg });
    await sock.sendMessage(from, { text: `📜 *PUISI - ${tema.toUpperCase()}*\n\n${random(PUISI[tema])}` }, { quoted: msg });
  }
};