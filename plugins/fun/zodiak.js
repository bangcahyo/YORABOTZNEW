const ZODIAK = {
  aries: { tgl: '21 Mar - 19 Apr', lambang: '♈', sifat: 'Berani, energik, penuh semangat, suka tantangan.', cocok: 'Leo, Sagitarius, Gemini' },
  taurus: { tgl: '20 Apr - 20 Mei', lambang: '♉', sifat: 'Sabar, setia, pekerja keras, cinta kenyamanan.', cocok: 'Virgo, Capricorn, Cancer' },
  gemini: { tgl: '21 Mei - 20 Jun', lambang: '♊', sifat: 'Cerdas, komunikatif, mudah bosan, serba bisa.', cocok: 'Libra, Aquarius, Aries' },
  cancer: { tgl: '21 Jun - 22 Jul', lambang: '♋', sifat: 'Penyayang, sensitif, setia, pelindung keluarga.', cocok: 'Scorpio, Pisces, Taurus' },
  leo: { tgl: '23 Jul - 22 Agu', lambang: '♌', sifat: 'Percaya diri, karismatik, murah hati, suka perhatian.', cocok: 'Aries, Sagitarius, Gemini' },
  virgo: { tgl: '23 Agu - 22 Sep', lambang: '♍', sifat: 'Teliti, perfeksionis, analitis, pekerja keras.', cocok: 'Taurus, Capricorn, Cancer' },
  libra: { tgl: '23 Sep - 22 Okt', lambang: '♎', sifat: 'Ramah, adil, cinta keindahan, mudah bergaul.', cocok: 'Gemini, Aquarius, Leo' },
  scorpio: { tgl: '23 Okt - 21 Nov', lambang: '♏', sifat: 'Intens, setia, misterius, penuh gairah.', cocok: 'Cancer, Pisces, Virgo' },
  sagitarius: { tgl: '22 Nov - 21 Des', lambang: '♐', sifat: 'Petualang, optimis, jujur, cinta kebebasan.', cocok: 'Aries, Leo, Aquarius' },
  capricorn: { tgl: '22 Des - 19 Jan', lambang: '♑', sifat: 'Disiplin, ambisius, bertanggung jawab, sabar.', cocok: 'Taurus, Virgo, Pisces' },
  aquarius: { tgl: '20 Jan - 18 Feb', lambang: '♒', sifat: 'Kreatif, unik, visioner, cinta kebebasan.', cocok: 'Gemini, Libra, Sagitarius' },
  pisces: { tgl: '19 Feb - 20 Mar', lambang: '♓', sifat: 'Imajinatif, penyayang, intuitif, sensitif.', cocok: 'Cancer, Scorpio, Capricorn' },
};

function dariTanggal(tgl, bln) {
  const d = tgl, m = bln;
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 'aries';
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 'taurus';
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 'gemini';
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 'cancer';
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'leo';
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'virgo';
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 'libra';
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 'scorpio';
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 'sagitarius';
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 'capricorn';
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 'aquarius';
  return 'pisces';
}

module.exports = {
  name: 'zodiak',
  category: 'fun',
  aliases: ['zodiac', 'ramalanzodiak'],
  async execute(sock, msg, args, ctx) {
    const { config, from, random } = ctx;
    const input = (args.join(' ') || '').toLowerCase().trim();

    if (!input) {
      let txt = `♈ *DAFTAR ZODIAK* (${Object.keys(ZODIAK).length})\n\n`;
      for (const [k, v] of Object.entries(ZODIAK)) {
        txt += `  ${v.lambang} *${k}* — ${v.tgl}\n`;
      }
      txt += `\nContoh: *${config.prefix}zodiak leo*\natau *${config.prefix}zodiak 17 agustus*`;
      return sock.sendMessage(from, { text: txt }, { quoted: msg });
    }

    // Coba parse tanggal
    const bulan = { januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6, juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12 };
    const parts = input.split(/[\s/-]+/);
    let z = null;
    const numMatch = input.match(/(\d{1,2})[\s/-](\d{1,2})/);
    if (numMatch) {
      z = dariTanggal(parseInt(numMatch[1]), parseInt(numMatch[2]));
    } else if (parts.length >= 2 && bulan[parts[1]]) {
      z = dariTanggal(parseInt(parts[0]), bulan[parts[1]]);
    } else if (ZODIAK[input]) {
      z = input;
    }

    if (!z || !ZODIAK[z]) {
      return sock.sendMessage(from, { text: `❌ Zodiak tidak ditemukan!\n\nContoh: *${config.prefix}zodiak leo*` }, { quoted: msg });
    }

    const v = ZODIAK[z];
    await sock.sendMessage(from, {
      text: `${v.lambang} *ZODIAK ${z.toUpperCase()}*\n\n` +
        `📅 Tanggal : ${v.tgl}\n` +
        `✨ Sifat   : ${v.sifat}\n` +
        `💞 Cocok   : ${v.cocok}\n\n` +
        `_${config.botName}_`,
    }, { quoted: msg });
  },
};
