const DATA = [
  { lirik: 'Aku yang jatuh cinta, aku yang berkorban, tapi kamu pergi begitu saja...', jawab: ['cinta', 'aku yang jatuh cinta'] },
  { lirik: 'Kau adalah darahku, kau adalah jantungku, kau adalah hidupku lengkapi diriku...', jawab: ['cinta kita', 'kau adalah'] },
  { lirik: 'Dan aku menangis, mengingat dirimu, yang telah pergi meninggalkanku...', jawab: ['kenangan terindah'] },
  { lirik: 'Ku tak ingin kau menangis, ku tak ingin kau bersedih, ku ingin kau bahagia...', jawab: ['tak ingin kau menangis'] },
  { lirik: 'Seandainya ku bisa, mengulang waktu, kembali ke masa itu...', jawab: ['seandainya'] },
  { lirik: 'Bintang di surga, kan selalu bersinar, menerangi malam...', jawab: ['bintang di surga'] },
  { lirik: 'Mungkin aku memang bukan yang terbaik untukmu, tapi aku selalu mencintaimu...', jawab: ['mungkin', 'bukan yang terbaik'] },
  { lirik: 'Aku tak bisa hidup tanpa dirimu, kamu segalanya bagiku...', jawab: ['tanpa dirimu'] },
  { lirik: 'Pergi saja kau, aku tak butuh cintamu lagi...', jawab: ['pergi saja'] },
  { lirik: 'Ku ingin kau tahu, ku ingin kau mengerti, betapa besar cintaku padamu...', jawab: ['ku ingin kau tahu'] },
  { lirik: 'Hati ini terasa sakit, saat kau pergi jauh dariku...', jawab: ['hati yang sakit'] },
  { lirik: 'Tuhan tolong aku, aku tak sanggup hidup tanpanya...', jawab: ['tolong'] },
  { lirik: 'Kau yang terindah, yang pernah singgah di hidupku...', jawab: ['yang terindah'] },
  { lirik: 'Cinta kita berbeda, tak seperti dulu lagi...', jawab: ['cinta kita berbeda'] },
  { lirik: 'Aku disini menantimu, setia menunggu kabarmu...', jawab: ['menantimu', 'menunggu'] },
  { lirik: 'Semua ini takkan pernah sama, tanpa dirimu di sisiku...', jawab: ['tanpa dirimu'] },
  { lirik: 'Kau dan aku, bersama selamanya, takkan terpisahkan...', jawab: ['selamanya'] },
  { lirik: 'Rindu ini terlalu dalam, aku ingin bertemu kamu...', jawab: ['rindu', 'rindu ini'] },
  { lirik: 'Jangan pernah kau lupakan aku, walau kau jauh dariku...', jawab: ['jangan lupakan aku'] },
  { lirik: 'Bila cinta tak sampai, biarlah aku yang pergi...', jawab: ['bila cinta tak sampai'] },
  { lirik: 'Terima kasih untuk semuanya, kenangan yang indah bersamamu...', jawab: ['terima kasih'] },
  { lirik: 'Aku mencintaimu lebih dari yang kau tahu...', jawab: ['lebih dari yang kau tahu'] },
  { lirik: 'Kau bagaikan bintang yang jatuh dari langit...', jawab: ['bintang jatuh'] },
  { lirik: 'Setiap detik bersamamu, terasa begitu berharga...', jawab: ['bersamamu'] },
  { lirik: 'Maafkan aku yang tak bisa menjaga cinta kita...', jawab: ['maafkan aku'] },
  { lirik: 'Ku berjanji akan setia, sampai akhir hayat...', jawab: ['berjanji', 'setia'] },
  { lirik: 'Sakit hati ini tak terobati, sejak kau pergi...', jawab: ['sakit hati'] },
  { lirik: 'Cinta tak harus memiliki, tapi harus diperjuangkan...', jawab: ['cinta tak harus memiliki'] },
  { lirik: 'Kau adalah segalanya, yang terbaik dalam hidupku...', jawab: ['segalanya'] },
  { lirik: 'Bulan dan bintang menjadi saksi, cinta kita abadi...', jawab: ['bulan dan bintang'] },
];

module.exports = {
  name: 'tebaklagu',
  category: 'game',
  aliases: ['tlagu', 'tebakmusik'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, gameState, setGameTimeout, random } = ctx;
    const d = random(DATA);
    gameState[from] = { game: 'tebaklagu', jawab: d.jawab, sender };
    setGameTimeout(from, async () => {
      const jwb = Array.isArray(d.jawab) ? d.jawab[0] : d.jawab;
      await sock.sendMessage(from, { text: `⏰ *WAKTU HABIS!*\n\nJawaban: *${jwb}*` });
    });
    await sock.sendMessage(from, {
      text: `🎵 *TEBAK LAGU*\n\n🎤 Potongan lirik:\n_"${d.lirik}"_\n\n💬 *Ketik judul lagunya langsung di chat!*\n🏳️ Ketik *nyerah* untuk skip\n\n⏱️ 60 detik | +4 Point, +Rp 900`,
    });
  },
};
