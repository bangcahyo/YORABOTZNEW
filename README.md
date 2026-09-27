<div align="center">

<img src="assets/logo.jpg" alt="Yora Botz" width="500" />

# 🤖 YORA BOTZ

**Bot WhatsApp Multi-Fitur Berbasis Plugin**

[![Version](https://img.shields.io/badge/v4.0.0-blue?style=flat-square)](https://github.com/bangcahyo/YoraBotz)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green?style=flat-square)](https://nodejs.org/)
[![Plugins](https://img.shields.io/badge/plugins-89-orange?style=flat-square)](https://github.com/)
[![License](https://img.shields.io/badge/license-MIT-yellow?style=flat-square)](LICENSE)

[🌐 Website](https://fityorastore.netlify.app/) • [💬 Grup](https://chat.whatsapp.com/GRj7DL7U8w44CTmGcFC5v2) • [📞 Owner](https://wa.me/628139525985)

</div>

---

## ✨ Fitur

| | |
|---|---|
| 🎮 **24 Game** | Slot, dadu, bj, roulette, quiz, dll |
| 💰 **Ekonomi** | Limit, uang, point, daily, shop |
| 📊 **Level System** | Naik level dari aktivitas chat |
| 🛡️ **Group Admin** | Anti-link, anti-spam, welcome |
| 🎭 **Hiburan** | Pantun, puisi, quote, ramalan |
| 👑 **Owner Tools** | Backup, config editor, broadcast |
| 🎤 **Voice & Gambar** | Menu dengan voice note |
| 🔑 **Pairing Code** | Login tanpa QR, auto save session |

---

## 🚀 Instalasi

```bash
# 1. Clone
git clone https://github.com/bangcahyo/YoraBotz.git
cd YoraBotz

# 2. Buat folder
mkdir -p database session assets

# 3. Install
npm install

# 4. Edit config.js (isi botNumber & ownerNumber)

# 5. Jalan
npm start
```

**Pairing Code** akan muncul di terminal → masukkan ke WhatsApp (Perangkat Tertaut → Tautkan dengan nomor telepon).

---

## 📁 Struktur

```
YoraBotz/
├── 📄 config.js          # Konfigurasi
├── 📄 index.js           # Loader
├── 📁 lib/               # Library internal
├── 📁 plugins/           # 89 plugin command
│   ├── menu/   game/   fun/   ekonomi/
│   ├── level/  group/  owner/  info/
├── 📁 assets/            # Gambar & voice
├── 📁 database/          # Auto-generate
└── 📁 session/           # Auto-generate
```

---

## 🧩 Tambah Plugin Baru

Buat file baru di `plugins/<kategori>/<nama>.js`:

```javascript
module.exports = {
  name: 'ping',
  category: 'game',
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    await sock.sendMessage(from, { text: '🏓 Pong!' }, { quoted: msg });
  }
};
```

Restart bot → ketik `.ping` → done! ✅

---

## ⚙️ Config Cepat

```javascript
// config.js
ownerNumber: '628139525985',      // Nomor owner
botNumber: '6282228307663',       // Nomor bot
ownerName: 'Cahyo Store',
botName: 'Yora Botz',
prefix: '.',
botMode: 'public',                // 'public' | 'self'
```

---

## 🌐 Deploy 24/7

| Platform | Harga | Rekomendasi |
|----------|-------|-------------|
| **[Railway](https://railway.app)** | Gratis ($5/bln) | ⭐ Termudah |
| **[Fly.io](https://fly.io)** | Gratis (3 VM) | Sesi permanen |
| **[Render](https://render.com)** | Gratis | Perlu keep-alive |
| **VPS** | $3/bln | Paling stabil |
| **Termux** | Gratis | Di HP sendiri |

**VPS + PM2:**
```bash
npm install -g pm2
pm2 start index.js --name yora-bot
pm2 save && pm2 startup
```

---

## 🐛 Error Umum

| Masalah | Solusi |
|---------|--------|
| `Cannot find module` | `npm install` |
| `Cannot find './config'` | Rename `config.json` → `config.js` |
| Pairing gagal | Hapus folder `session`, tunggu 5 menit, ulang |
| Owner tidak dikenali | Pastikan format nomor `62xxx` |
| Voice tidak muncul | Convert ke **OPUS, Mono, 16kHz** |
| Session hilang terus | Pindah ke VPS/Fly.io |

---

## 🙏 Thanks To

**Cahyo Store** • **Baileys Team** • **Kamu** 💖

---

<div align="center">

**⭐ Jangan lupa kasih bintang! ⭐**

[![Star](https://img.shields.io/github/stars/bangcahyo/YoraBotz?style=social)](https://github.com/bangcahyo/YoraBotz)

**Made with ❤️ by [Cahyo Store](https://fityorastore.netlify.app/)**

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer)

</div>
