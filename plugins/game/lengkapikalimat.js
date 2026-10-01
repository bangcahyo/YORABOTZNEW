const DATA = [
  { q: 'Berakit-rakit ke hulu, ...', a: 'berenang ke tepian' },
  { q: 'Bersakit-sakit dahulu, ...', a: 'senang kemudian' },
  { q: 'Air beriak tanda tak ...', a: 'dalam' },
  { q: 'Sekali mendayung, dua tiga ...', a: 'pulau terlampaui' },
  { q: 'Tong kosong nyaring ...', a: 'bunyinya' },
  { q: 'Karena nila setitik, rusak susu ...', a: 'sebelanga' },
  { q: 'Sambil menyelam minum ...', a: 'air' },
  { q: 'Cepat kaki ringan ...', a: 'tangan' },
  { q: 'Besar pasak daripada ...', a: 'tiang' },
  { q: 'Sedikit demi sedikit lama-lama menjadi ...', a: 'bukit' },
  { q: 'Rajin pangkal pandai, hemat pangkal ...', a: 'kaya' },
  { q: 'Tidak kenal maka tidak ...', a: 'sayang' },
  { q: 'Malu bertanya sesat di ...', a: 'jalan' },
  { q: 'Lain ladang lain belalang, lain lubuk lain ...', a: 'ikannya' },
  { q: 'Di mana bumi dipijak, di situ langit ...', a: 'dijunjung' },
  { q: 'Air susu dibalas air ...', a: 'tuba' },
  { q: 'Bagai menegakkan benang ...', a: 'basah' },
  { q: 'Sudah jatuh tertimpa tangga ...', a: 'pula' },
  { q: 'Kalah jadi abu, menang jadi ...', a: 'arang' },
  { q: 'Seperti katak dalam ...', a: 'tempurung' },
  { q: 'Tua-tua keladi, makin tua makin ...', a: 'jadi' },
  { q: 'Anjing menggonggong, kafilah ...', a: 'berlalu' },
  { q: 'Tutup mulut rapat-rapat, ...', a: 'jangan sampai terbuka' },
  { q: 'Membuat api di dalam ...', a: 'sekam' },
  { q: 'Menepuk air di dulang, terpercik muka ...', a: 'sendiri' },
  { q: 'Nasi sudah menjadi ...', a: 'bubur' },
  { q: 'Sekali lancung ke ujian, seumur hidup orang tak ...', a: 'percaya' },
  { q: 'Tertutup pintu, terbuka ...', a: 'jendela' },
  { q: 'Guru kencing berdiri, murid kencing ...', a: 'berlari' },
  { q: 'Bagaikan pungguk merindukan ...', a: 'bulan' },
  { q: 'Hancur badan dikandung tanah, budi baik ...', a: 'dikenang jua' },
  { q: 'Tidak ada rotan, akar pun ...', a: 'berguna' },
  { q: 'Lempar batu sembunyi ...', a: 'tangan' },
  { q: 'Karena hati, mata buta, karena ...', a: 'mata buta hati' },
  { q: 'Ikan teri sama ...', a: 'asinnya' },
];

module.exports = {
  name: 'lengkapikalimat',
  category: 'game',
  aliases: ['lengkapi', 'peribahasa', 'lengkapikata'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'lengkapikalimat', jawab: d.a, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${d.a}*` });
    });
    await sock.sendMessage(from, {
      text: `📜 *LENGKAPI PERIBAHASA*\n\n${d.q}\n\n💬 *Ketik lanjutan peribahasanya di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +3 Point, +Rp 750`,
    });
  },
};
