const PANTUN = [
  'Ke pasar beli pepaya,\nBelinya di pasar baru,\nHidup ini jangan susah,\nNanti malah tambah keruh.',
  'Pergi ke sawah menanam padi,\nPadi tumbuh subur sekali,\nRajin belajar di pagi hari,\nCita-cita pasti tercapai nanti.',
  'Beli soto di warung Pak Budi,\nSoto dinikmati dengan nasi,\nKalau kamu rajin mengaji,\nHidupmu berkah sepanjang hari.',
  'Ada bebek di pinggir kali,\nBebek berenang dengan senang,\nJangan menyerah dalam mencari,\nRezeki datang tak disangka datang.',
  'Buah mangga buah rambutan,\nManis rasanya di dalam mulut,\nJangan pernah lupa teman,\nKarena teman itu sahabat sejati.',
  'Pergi ke pantai membawa bekal,\nPantainya indah di sore hari,\nKalau hati sedang galau,\nIngat Allah, hati jadi berseri.',
  'Kucing mengeong di malam hari,\nSuaranya merdu tiada tara,\nKalau kamu ingin sukses nanti,\nBelajar tekun sejak sekaranglah.',
  'Anak ayam turun sepuluh,\nMati satu tinggal sembilan,\nKalau kamu ingin maju,\nJangan malas, jangan putus asa.',
  'Bunga mawar bunga melati,\nHarum baunya di pagi hari,\nJagalah lisan dan hati,\nAgar hidup damai berseri.',
  'Pisang emas dibawa berlayar,\nMasak sebiji di dalam peti,\nUtang emas boleh dibayar,\nUtang budi dibawa mati.',
];
module.exports = {
  name: 'pantun', category: 'fun',
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    await sock.sendMessage(from, { text: `🎭 *PANTUN*\n\n${random(PANTUN)}` }, { quoted: msg });
  }
};