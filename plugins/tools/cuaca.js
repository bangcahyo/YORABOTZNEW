module.exports = {
  name: 'cuaca',
  category: 'tools',
  aliases: ['weather'],
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const kota = args.join(' ');

    if (!kota) {
      return sock.sendMessage(from, { text: '❌ Format: `.cuaca <kota>`\nContoh: `.cuaca Jakarta`' });
    }

    await sock.sendMessage(from, { text: '🔍 Mencari cuaca...' });

    try {
      const res = await fetch(`https://wttr.in/${encodeURIComponent(kota)}?format=j1`);
      const data = await res.json();
      const c = data.current_condition[0];

      await sock.sendMessage(from, {
        text: `🌤️ *CUACA ${kota.toUpperCase()}*\n\n🌡️ Suhu   : ${c.temp_C}°C\n💧 Lembap : ${c.humidity}%\n💨 Angin  : ${c.windspeedKmph} km/h\n☁️ Cuaca  : ${c.weatherDesc[0].value}\n\n🌅 Sunrise : ${data.weather[0].astronomy[0].sunrise}\n🌇 Sunset  : ${data.weather[0].astronomy[0].sunset}`,
      });
    } catch (e) {
      await sock.sendMessage(from, { text: `❌ Gagal ambil cuaca: ${e.message}` });
    }
  },
};