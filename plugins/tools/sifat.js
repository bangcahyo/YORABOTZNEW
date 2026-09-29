module.exports = {
  name: 'sifat',
  category: 'tools',
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const nama = args.join(' ') || 'Kamu';

    const sifatList = [
      'Penyabar 😇',
      'Baik hati 💖',
      'Ceria 😄',
      'Pintar 🧠',
      'Rajin 💪',
      'Kreatif 🎨',
      'Setia 🤝',
      'Jujur 🌟',
      'Pemalu 🙈',
      'Pemberani 🦁',
      'Ramah 😊',
      'Sabar 🧘',
      'Fokus 🎯',
      'Optimis 🌈',
      'Humoris 😂',
      'Tulus 💗',
      'Misterius 🕵️',
      'Kalem 😌',
      'Energik ⚡',
      'Romantis 💕',
    ];

    const s1 = sifatList[Math.floor(Math.random() * sifatList.length)];
    const s2 = sifatList[Math.floor(Math.random() * sifatList.length)];
    const s3 = sifatList[Math.floor(Math.random() * sifatList.length)];

    await sock.sendMessage(from, {
      text: `🔮 *CEK SIFAT*\n\nNama: *${nama}*\n\n• ${s1}\n• ${s2}\n• ${s3}\n\n_Menurut ramalan bot_ 😄`,
    });
  },
};