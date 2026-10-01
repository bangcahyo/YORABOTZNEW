module.exports = {
  name: 'truth', category: 'fun', aliases: ['tod'],
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    const truths = [
      'Siapa orang paling kamu sayangi di grup ini?',
      'Apa hal paling memalukan yang pernah kamu lakukan?',
      'Siapa crush kamu di grup ini?',
      'Apa rahasia terbesar yang belum pernah diceritakan?',
      'Pernahkah kamu berbohong pada orang tuamu? Tentang apa?',
      'Apa kebiasaan burukmu yang paling kamu sesali?',
      'Siapa orang yang paling kamu benci? Kenapa?',
      'Apa hal yang paling kamu takutkan dalam hidup?',
      'Pernahkah kamu menangis karena putus cinta?',
      'Apa hal paling konyol yang pernah kamu lakukan di depan umum?',
      'Siapa orang yang diam-diam kamu kagumi?',
      'Apa impian terbesar yang belum pernah kamu ceritakan?',
      'Pernahkah kamu menyesali pertemanan dengan seseorang?',
      'Apa hal yang paling membuatmu malu tentang dirimu?',
      'Siapa yang terakhir membuatmu tersenyum sendiri?',
      'Apa yang paling kamu rindukan dari masa kecilmu?',
      'Pernahkah kamu membaca chat orang lain tanpa izin?',
      'Apa alasan kamu bangun pagi ini?',
      'Siapa orang yang paling berpengaruh dalam hidupmu?',
      'Apa hal yang belum pernah kamu maafkan dari seseorang?',
      'Pernahkah kamu pura-pura sibuk untuk menghindari seseorang?',
      'Apa yang akan kamu lakukan jika besok adalah hari terakhirmu?',
      'Siapa orang yang paling ingin kamu temui sekarang?',
      'Apa kebohongan terbesar yang pernah kamu ucapkan?',
      'Apa hal yang membuatmu merasa tidak percaya diri?',
    ];
    const dares = [
      'Kirim pesan "Aku sayang kamu" ke orang random!',
      'Ganti nama WhatsApp jadi "Yora Botz" selama 1 jam!',
      'Kirim voice note nyanyi lagu anak-anak!',
      'Tag semua member grup!',
      'Kirim selfie sekarang ke grup ini!',
      'Tirukan suara hewan selama 10 detik!',
      'Kirim pesan "Aku ganteng/cantik" ke 3 orang!',
      'Update status WA dengan kata "Aku sedang bahagia"!',
      'Kirim stiker lucu 5 kali berturut-turut!',
      'Sebutkan 5 nama mantan kamu (kalau ada)!',
      'Kirim voice note bilang "Aku kangen kamu" ke orang random!',
      'Screenshot chat terakhirmu dan kirim ke grup!',
      'Telepon seseorang dan nyanyikan lagu ulang tahun!',
      'Kirim emoji ❤️ ke orang ke-10 di daftar kontakmu!',
      'Ceritakan mimpi teranehmu semalam!',
      'Panggil semua orang di grup dengan sebutan "Bos"!',
      'Kirim foto makanan terakhirmu ke grup!',
      'Bilang "Aku yang paling keren" 3 kali di voice note!',
      'Ganti foto profil dengan foto hewan selama 1 jam!',
      'Kirim pesan "Kamu lucu deh" ke orang random!',
      'Tulis status WA "Aku sedang galau" selama 30 menit!',
      'Kirim voice note ketawa selama 5 detik!',
      'Sebutkan 3 hal yang kamu suka dari orang di sebelahmu!',
      'Kirim pesan "Ayo main" ke 5 orang sekaligus!',
      'Nyanyikan lagu favoritmu dalam voice note!',
    ];
    const pilihan = random(['truth', 'dare']);
    const teks = pilihan === 'truth' ? random(truths) : random(dares);
    await sock.sendMessage(from, { text: `${pilihan === 'truth' ? '💬 *TRUTH*' : '🔥 *DARE*'}\n\n${teks}` }, { quoted: msg });
  }
};
