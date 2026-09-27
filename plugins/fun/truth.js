module.exports = {
  name: 'truth', category: 'fun',
  async execute(sock, msg, args, ctx) {
    const { from, random } = ctx;
    const truths = [
      'Siapa orang paling kamu sayangi di grup ini?',
      'Apa hal paling memalukan yang pernah kamu lakukan?',
      'Siapa crush kamu di grup ini?',
      'Apa rahasia terbesar yang belum pernah diceritakan?',
    ];
    const dares = [
      'Kirim pesan "Aku sayang kamu" ke orang random!',
      'Ganti nama WhatsApp jadi "Yora Botz" selama 1 jam!',
      'Kirim voice note nyanyi lagu anak-anak!',
      'Tag semua member grup!',
    ];
    const pilihan = random(['truth','dare']);
    const teks = pilihan === 'truth' ? random(truths) : random(dares);
    await sock.sendMessage(from, { text: `${pilihan === 'truth' ? '💬 TRUTH' : '🔥 DARE'}\n\n${teks}` }, { quoted: msg });
  }
};