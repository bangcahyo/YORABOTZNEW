const DATA = [
  { clue: '🇵🇹 Portugal | Penyerang | Manchester United & Real Madrid | Julukan CR7', jawab: ['cristiano ronaldo', 'ronaldo', 'cr7'] },
  { clue: '🇦🇷 Argentina | Penyerang | Barcelona & PSG | Juara Piala Dunia 2022 | Peraih 8 Ballon d\'Or', jawab: ['lionel messi', 'messi'] },
  { clue: '🇧🇷 Brazil | Penyerang | Santos & Barcelona | Legenda sepak bola dunia', jawab: ['pele', 'pelé'] },
  { clue: '🇫🇷 Prancis | Penyerang | Real Madrid | Julukan The Next Henry', jawab: ['kylian mbappe', 'mbappe'] },
  { clue: '🇧🇷 Brazil | Gelandang | AC Milan & Real Madrid | Peraih Ballon d\'Or 2007', jawab: ['kaka', 'kaká'] },
  { clue: '🇳🇴 Norwegia | Penyerang | Manchester City | Mesin gol muda', jawab: ['erling haaland', 'haaland'] },
  { clue: '🇧🇷 Brazil | Penyerang | PSG & Al Hilal | Ahli dribel & gol akrobatik', jawab: ['neymar'] },
  { clue: '🇪🇬 Mesir | Penyerang | Liverpool | Julukan The Egyptian King', jawab: ['mohamed salah', 'salah'] },
  { clue: '🇵🇱 Polandia | Penyerang | Bayern Munich & Barcelona | Mesin gol', jawab: ['robert lewandowski', 'lewandowski'] },
  { clue: '🇧🇪 Belgia | Gelandang | Manchester City | Ahli umpan kreatif', jawab: ['kevin de bruyne', 'de bruyne'] },
  { clue: '🇭🇷 Kroasia | Gelandang | Real Madrid | Peraih Ballon d\'Or 2018', jawab: ['luka modric', 'modric'] },
  { clue: '🇫🇷 Prancis | Gelandang | Real Madrid & Juventus | Legenda Zizou', jawab: ['zinedine zidane', 'zidane'] },
  { clue: '🇧🇷 Brazil | Bek kanan | Barcelona & PSG | Legenda bertahan', jawab: ['dani alves'] },
  { clue: '🇮🇹 Italia | Kiper | Juventus | Legenda kiper dunia', jawab: ['gianluigi buffon', 'buffon'] },
  { clue: '🇪🇸 Spanyol | Gelandang | Barcelona | Legenda tiki-taka', jawab: ['xavi', 'andres iniesta', 'iniesta'] },
  { clue: '🇩🇪 Jerman | Kiper | Bayern Munich | Julukan The Wall', jawab: ['manuel neuer', 'neuer'] },
  { clue: '🇸🇪 Swedia | Penyerang | AC Milan & PSG | Julukan Ibrahimovic', jawab: ['zlatan ibrahimovic', 'zlatan', 'ibrahimovic'] },
  { clue: '🇺🇾 Uruguay | Penyerang | Liverpool & Barcelona | Gigitan kontroversial', jawab: ['luis suarez', 'suarez'] },
  { clue: '🇦🇷 Argentina | Penyerang | Inter Milan | Julukan El Toro', jawab: ['lautaro martinez', 'lautaro'] },
  { clue: '🇬🇧 Inggris | Gelandang | Manchester United | Legenda kelas 92', jawab: ['david beckham', 'beckham'] },
  { clue: '🇧🇷 Brazil | Gelandang | Barcelona & AC Milan | Julukan Ronaldinho Gaucho', jawab: ['ronaldinho'] },
  { clue: '🇫🇷 Prancis | Gelandang | Manchester United & Juventus | Julukan Pogba', jawab: ['paul pogba', 'pogba'] },
  { clue: '🇩🇪 Jerman | Gelandang | Real Madrid | Julukan The German Engine', jawab: ['toni kroos', 'kroos'] },
  { clue: '🇪🇸 Spanyol | Gelandang | Manchester City & Barcelona | Ahli umpan', jawab: ['rodri'] },
  { clue: '🇧🇷 Brazil | Bek | PSG & Chelsea | Kapten timnas', jawab: ['thiago silva'] },
  { clue: '🇦🇷 Argentina | Gelandang | Inter & Barcelona | Julukan El Kün', jawab: ['sergio aguero', 'aguero'] },
  { clue: '🇨🇮 Pantai Gading | Penyerang | Chelsea & Galatasaray | Julukan Drogba', jawab: ['didier drogba', 'drogba'] },
  { clue: '🇨🇲 Kamerun | Penyerang | Barcelona & Inter Milan | Julukan Eto\'o', jawab: ['samuel eto\'o', 'etoo'] },
  { clue: '🇬🇭 Ghana | Gelandang | Chelsea & Real Madrid | Julukan Essien', jawab: ['michael essien', 'essien'] },
  { clue: '🇳🇱 Belanda | Penyerang | Manchester United & Real Madrid | Julukan Van the Man', jawab: ['ruud van nistelrooy', 'van nistelrooy'] },
];

module.exports = {
  name: 'tebakpemainbola',
  category: 'game',
  aliases: ['tpbola', 'tebakbola', 'tebakpemain'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'tebakpemainbola', jawab: d.jawab, sender };
    setGameTimeout(from, async () => {
      const jwb = Array.isArray(d.jawab) ? d.jawab[0] : d.jawab;
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${jwb}*` });
    });
    await sock.sendMessage(from, {
      text: `⚽ *TEBAK PEMAIN BOLA*\n\n🔎 Petunjuk:\n_${d.clue}_\n\n💬 *Ketik nama pemainnya langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +4 Point, +Rp 900`,
    });
  },
};
