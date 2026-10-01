const DATA = [
  { negara: 'Indonesia', ibukota: 'jakarta' },
  { negara: 'Jepang', ibukota: 'tokyo' },
  { negara: 'Prancis', ibukota: 'paris' },
  { negara: 'Inggris', ibukota: 'london' },
  { negara: 'Amerika Serikat', ibukota: 'washington' },
  { negara: 'China', ibukota: 'beijing' },
  { negara: 'Korea Selatan', ibukota: 'seoul' },
  { negara: 'Thailand', ibukota: 'bangkok' },
  { negara: 'Malaysia', ibukota: 'kuala lumpur' },
  { negara: 'Singapura', ibukota: 'singapura' },
  { negara: 'Australia', ibukota: 'canberra' },
  { negara: 'Jerman', ibukota: 'berlin' },
  { negara: 'Italia', ibukota: 'roma' },
  { negara: 'Spanyol', ibukota: 'madrid' },
  { negara: 'Mesir', ibukota: 'kairo' },
  { negara: 'India', ibukota: 'new delhi' },
  { negara: 'Turki', ibukota: 'ankara' },
  { negara: 'Rusia', ibukota: 'moskow' },
  { negara: 'Arab Saudi', ibukota: 'riyadh' },
  { negara: 'Uni Emirat Arab', ibukota: 'abu dhabi' },
  { negara: 'Vietnam', ibukota: 'hanoi' },
  { negara: 'Filipina', ibukota: 'manila' },
  { negara: 'Belanda', ibukota: 'amsterdam' },
  { negara: 'Portugal', ibukota: 'lisbon' },
  { negara: 'Kanada', ibukota: 'ottawa' },
  { negara: 'Brazil', ibukota: 'brasilia' },
  { negara: 'Argentina', ibukota: 'buenos aires' },
  { negara: 'Meksiko', ibukota: 'mexico city' },
  { negara: 'Pakistan', ibukota: 'islamabad' },
  { negara: 'Bangladesh', ibukota: 'dhaka' },
  { negara: 'Iran', ibukota: 'teheran' },
  { negara: 'Irak', ibukota: 'baghdad' },
  { negara: 'Afrika Selatan', ibukota: 'pretoria' },
  { negara: 'Kenya', ibukota: 'nairobi' },
  { negara: 'Nigeria', ibukota: 'abuja' },
  { negara: 'Selandia Baru', ibukota: 'wellington' },
  { negara: 'Swiss', ibukota: 'bern' },
  { negara: 'Swedia', ibukota: 'stockholm' },
  { negara: 'Norwegia', ibukota: 'oslo' },
  { negara: 'Finlandia', ibukota: 'helsinki' },
  { negara: 'Polandia', ibukota: 'warsawa' },
  { negara: 'Yunani', ibukota: 'athena' },
  { negara: 'Austria', ibukota: 'wina' },
  { negara: 'Belgia', ibukota: 'brussel' },
  { negara: 'Ukraina', ibukota: 'kyiv' },
  { negara: 'Israel', ibukota: 'yerusalem' },
  { negara: 'Kamboja', ibukota: 'phnom penh' },
  { negara: 'Myanmar', ibukota: 'naypyidaw' },
  { negara: 'Nepal', ibukota: 'kathmandu' },
  { negara: 'Sri Lanka', ibukota: 'colombo' },
];

module.exports = {
  name: 'tebakibukota',
  category: 'game',
  aliases: ['tibk', 'ibukota'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'tebakibukota', jawab: d.ibukota, sender };
    setGameTimeout(from, async () => {
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${d.ibukota}*` });
    });
    await sock.sendMessage(from, {
      text: `🏙️ *TEBAK IBU KOTA*\n\nIbu kota dari *${d.negara}*?\n\n💬 *Ketik jawabanmu langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +3 Point, +Rp 700`,
    });
  },
};
