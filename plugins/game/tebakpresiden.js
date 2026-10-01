const DATA = [
  { presiden: 'soekarno', clue: 'Presiden pertama Indonesia, proklamator kemerdekaan' },
  { presiden: 'soeharto', clue: 'Presiden kedua Indonesia, memimpin Orde Baru 32 tahun' },
  { presiden: 'bj habibie', clue: 'Presiden ketiga Indonesia, bapak teknologi, ahli pesawat' },
  { presiden: 'abdurrahman wahid', clue: 'Presiden keempat Indonesia, dikenal Gus Dur' },
  { presiden: 'megawati soekarnoputri', clue: 'Presiden kelima Indonesia, presiden wanita pertama' },
  { presiden: 'susilo bambang yudhoyono', clue: 'Presiden keenam Indonesia, dikenal SBY' },
  { presiden: 'joko widodo', clue: 'Presiden ketujuh Indonesia, dikenal Jokowi, mantan wali kota Solo' },
  { presiden: 'prabowo subianto', clue: 'Presiden kedelapan Indonesia, mantan Menteri Pertahanan' },
  { presiden: 'george washington', clue: 'Presiden pertama Amerika Serikat' },
  { presiden: 'abraham lincoln', clue: 'Presiden AS yang hapus perbudakan, dibunuh di teater' },
  { presiden: 'john f kennedy', clue: 'Presiden AS yang dibunuh di Dallas 1963, dikenal JFK' },
  { presiden: 'barack obama', clue: 'Presiden AS kulit hitam pertama' },
  { presiden: 'donald trump', clue: 'Presiden AS ke-45, pengusaha properti' },
  { presiden: 'joe biden', clue: 'Presiden AS ke-46, mantan wakil Obama' },
  { presiden: 'vladimir putin', clue: 'Presiden Rusia yang lama berkuasa' },
  { presiden: 'xi jinping', clue: 'Presiden China saat ini' },
  { presiden: 'nelson mandela', clue: 'Presiden Afrika Selatan, pejuang anti-apartheid, dipenjara 27 tahun' },
  { presiden: 'kim jong un', clue: 'Pemimpin tertinggi Korea Utara' },
  { presiden: 'emmanuel macron', clue: 'Presiden Prancis termuda' },
  { presiden: 'narendra modi', clue: 'Perdana Menteri India saat ini' },
  { presiden: 'mohammad yusuf kalla', clue: 'Wakil Presiden Indonesia dua periode, dikenal JK' },
  { presiden: 'mohammad hatta', clue: 'Wakil presiden pertama Indonesia, proklamator, bapak koperasi' },
  { presiden: 'adam smith', clue: 'Bukan presiden, bapak ekonomi dunia' },
  { presiden: 'winston churchill', clue: 'Perdana Menteri Inggris masa Perang Dunia II' },
  { presiden: 'margaret thatcher', clue: 'Perdana Menteri wanita pertama Inggris, dijuluki Iron Lady' },
];

module.exports = {
  name: 'tebakpresiden',
  category: 'game',
  aliases: ['tbpresiden', 'presiden'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'tebakpresiden', jawab: d.presiden, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${d.presiden}*` });
    });
    await sock.sendMessage(from, {
      text: `🎩 *TEBAK PRESIDEN*\n\n${d.clue}\n\nSiapa dia?\n\n💬 *Ketik jawabanmu langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +4 Point, +Rp 900`,
    });
  },
};
