module.exports = {
  name: 'bmi',
  category: 'tools',
  aliases: ['cekbmi', 'bodymass'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const input = args.join(' ');

    if (!input) {
      return sock.sendMessage(from, {
        text: '❌ Format: `.bmi <berat> <tinggiCm>`\nContoh: `.bmi 60 170`',
      });
    }

    const cleaned = input.trim().replace(/,/g, ' ').split(/\s+/);
    if (cleaned.length < 2) {
      return sock.sendMessage(from, {
        text: '❌ Format salah. Gunakan: `.bmi <berat> <tinggiCm>`',
      });
    }

    const berat = Number(cleaned[0]);
    const tinggiCm = Number(cleaned[1]);

    if (!Number.isFinite(berat) || !Number.isFinite(tinggiCm) || berat <= 0 || tinggiCm <= 0) {
      return sock.sendMessage(from, {
        text: '❌ Nilai berat dan tinggi harus angka yang valid.',
      });
    }

    const tinggiM = tinggiCm / 100;
    const bmi = berat / (tinggiM * tinggiM);

    let kategori = 'Normal';
    if (bmi < 18.5) kategori = 'Kurus';
    else if (bmi < 25) kategori = 'Normal';
    else if (bmi < 30) kategori = 'Gemuk';
    else kategori = 'Obesitas';

    await sock.sendMessage(from, {
      text: `📏 *BMI Calculator*\n\nBerat: *${berat} kg*\nTinggi: *${tinggiCm} cm*\nBMI: *${bmi.toFixed(2)}*\nKategori: *${kategori}*`,
    });
  },
};
