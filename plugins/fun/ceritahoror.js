const CERITA = [
  '🕯️ *Cermin Tua*\n\nSeorang gadis membeli cermin antik di pasar loak. Setiap malam, ia melihat bayangannya bergerak sedikit lebih lambat dari dirinya. Suatu malam, bayangan itu tersenyum lebih dulu... sebelum gadis itu sendiri tersenyum.',
  '🚪 *Pintu Terakhir*\n\nDi sebuah asrama, ada pintu yang selalu terkunci di ujung lorong. Penghuni baru penasaran dan membukanya. Di dalam, ia melihat kamar yang persis seperti kamarnya sendiri — dengan dirinya sedang tertidur. Sejak itu, ia tak pernah bisa membedakan mana dunia nyata dan mana mimpi.',
  '📱 *Pesan Tengah Malam*\n\nPukul 3 pagi, ponsel Rina berbunyi. Pesan dari nomornya sendiri: "Jangan lihat ke belakang." Ia menoleh. Tidak ada siapa-siapa. Namun pesan berikutnya masuk: "Terlambat."',
  '🪆 *Boneka Kayu*\n\nSeorang anak menemukan boneka kayu di loteng. Setiap pagi, posisi boneka itu berubah. Suatu hari, boneka itu duduk di tepi tempat tidurnya. Sang ibu membuangnya jauh ke sungai. Keesokan paginya, boneka itu sudah kembali — basah kuyup — di pelukan anaknya.',
  '🌊 *Sungai Hitam*\n\nPara penduduk desa percaya sungai itu menelan siapa pun yang memandangnya terlalu lama. Seorang pemuda menantang mitos itu. Ia menatap sungai selama satu menit penuh. Saat ia berbalik, bayangannya tetap tinggal di permukaan air... dan tersenyum.',
  '🏚️ *Rumah Kosong*\n\nKeluarga itu pindah ke rumah murah yang tak pernah dihuni bertahun-tahun. Malam pertama, mereka mendengar suara anak kecil tertawa di kamar kosong. Mereka tidak punya anak. Keesokan paginya, ada coretan di dinding: "Terima kasih sudah datang."',
  '🎵 *Lagu Terakhir*\n\nSeorang pianis memainkan melodi yang ia dengar dalam mimpinya. Setiap kali ia memainkannya, ada satu nada yang hilang. Ia terus berlatih hingga sempurna. Malam ia berhasil memainkannya utuh, ia tak pernah ditemukan lagi.',
  '👣 *Jejak di Salju*\n\nSeorang pendaki menemukan jejak kaki yang mengelilingi tendangannya. Jejak itu miliknya sendiri, tapi ia tidak pernah keluar malam itu. Jejak terakhir berhenti tepat di depan pintu tenda... menghadap ke dalam.',
  '📞 *Panggilan Kosong*\n\nSetiap malam pukul 2, telepon rumah berdering. Tak ada suara di ujung sana, hanya napas berat. Suatu malam, si penelepon akhirnya berbicara: "Aku di dalam rumahmu." Telepon itu berasal dari kamar sebelah.',
  '🪦 *Kuburan Kembar*\n\nDua saudara kembar meninggal bersamaan. Namun hanya satu peti yang dikubur. Penduduk mendengar suara ketukan dari dalam kuburan setiap malam. Saat dibuka, peti itu kosong — dan kedua saudara itu terlihat berjalan bergandengan menuju hutan.',
  '🪞 *Kaca Spion*\n\nSeorang sopir melihat penumpang misterius di kursi belakang lewat kaca spion. Saat ia menoleh, kursinya kosong. Ia menoleh lagi ke spion — penumpang itu kini duduk tepat di sampingnya, menatapnya tanpa berkedip.',
  '🌙 *Bayangan Bulan*\n\nSeorang anak suka bermain di bawah sinar bulan. Suatu malam, ia sadar bayangannya tidak mengikuti gerakannya. Bayangan itu berdiri sendiri, melambai padanya... lalu berjalan menuju rumah lebih dulu.',
];

module.exports = {
  name: 'ceritahoror',
  category: 'fun',
  aliases: ['horor', 'ceritahantu', 'horror'],
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    await sock.sendMessage(from, { text: `${random(CERITA)}\n\n_— Cerita Horor ${CERITA.length}_` }, { quoted: msg });
  },
};
