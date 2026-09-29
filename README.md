<div align="center">

<img src="assets/logo.jpg" alt="Yora Botz" width="500" />

# 🤖 YORA BOTZ

**Bot WhatsApp Multi-Fitur dengan Pairing Code — Tanpa QR**

[![Version](https://img.shields.io/badge/v6.0.0-blue?style=flat-square)](https://github.com/bangcahyo/YoraBotz)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green?style=flat-square)](https://nodejs.org/)
[![Baileys](https://img.shields.io/badge/baileys-6.7.24-purple?style=flat-square)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/license-MIT-yellow?style=flat-square)](LICENSE)

[🌐 Website](https://fityorastore.netlify.app/) • [💬 Grup](https://chat.whatsapp.com/GRj7DL7U8w44CTmGcFC5v2) • [📞 Owner](https://wa.me/628139525985)

</div>

---

## ✨ Fitur Utama

| | |
|---|---|
| 🔐 **Pairing Code** | Login tanpa QR — cukup kode 8 digit |
| 🎨 **Sticker** | Bikin sticker dari gambar/video |
| 📤 **To URL** | Upload media → link publik |
| 📖 **Wikipedia** | Cari artikel dari Wikipedia |
| 🌤️ **Cuaca** | Info cuaca real-time |
| 💑 **Cek Jodoh** | Ramalan kecocokan |
| 🔮 **Cek Sifat** | Ramalan sifat nama |
| 🎮 **Game** | Slot, dadu, koin, tebak-tebakan |
| 💰 **Ekonomi** | Limit, uang, point, daily |
| 📊 **Level System** | Naik level dari aktivitas chat |
| 🛡️ **Group Admin** | Anti-link, anti-spam, welcome |
| 👑 **Owner Tools** | Backup, config editor, broadcast |

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/bangcahyo/YoraBotz.git
cd YoraBotz
```

### 2. Buat Folder

```bash
mkdir -p database session assets
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Konfigurasi Bot

Edit `config.js`:

```javascript
botNumber: '6282228307663',       // ⚠️ Nomor bot (format 62xxx)
ownerNumber: '628139525985',      // Nomor owner
ownerName: 'Cahyo Store',
prefix: '.',
```

### 5. Jalankan Bot

```bash
npm start
```

### 6. Pairing Code

Setelah bot jalan, tunggu ±10 detik, lalu akan muncul:

```
╔══════════════════════════════════╗
║   ✅ PAIRING CODE BERHASIL        ║
╚══════════════════════════════════╝

   📱 Nomor: 6282228307663
   🔑 Kode : ABCD-EFGH
```

### 7. Aktifkan di WhatsApp

1. Buka **WhatsApp** di HP nomor bot
2. **Pengaturan** → **Perangkat Tertaut**
3. **Tautkan Perangkat**
4. Pilih **"Tautkan dengan nomor telepon saja"**
5. Masukkan kode **`ABCDEFGH`** (tanpa tanda `-`)
6. Bot langsung terhubung! ✅

---

## 📁 Struktur Folder

```
yora-botz/
├── 📄 package.json
├── 📄 config.js
├── 📄 index.js
├── 📁 lib/
│   ├── 📄 database.js
│   ├── 📄 helper.js
│   └── 📄 level.js
├── 📁 plugins/
│   ├── 📁 menu/       (7 plugin)
│   ├── 📁 info/       (3 plugin)
│   ├── 📁 sticker/    (2 plugin)
│   ├── 📁 tools/      (4 plugin)
│   └── 📁 owner/      (5 plugin)
├── 📁 database/       (auto-generate)
├── 📁 session/        (auto-generate)
└── 📁 assets/         (opsional)
```

---

## 🎯 Daftar Command

### 📂 Menu
```
.menu         → Menu utama
.menugame     → Menu game
.menufun      → Menu hiburan
.menuekonomi  → Menu ekonomi
.menulevel    → Menu level
.menugroup    → Menu group admin
.menuowner    → Menu owner (owner only)
.menutools    → Menu tools
```

### 🎨 Tools
```
.sticker      → Reply gambar → jadi sticker
.toimg        → Reply sticker → jadi gambar
.tourl        → Reply media → upload ke link
.wiki <topik> → Cari di Wikipedia
.cuaca <kota> → Info cuaca
.jodoh @user  → Cek jodoh
.sifat <nama> → Cek sifat
```

### ℹ️ Info
```
.ping         → Test latency bot
.runtime      → Info uptime & server
.owner        → Kontak owner
.tqto         → Thanks to
```

### 👑 Owner Only
```
.self         → Mode self
.public       → Mode public
.mode         → Cek mode bot
.addmoney @u  → Tambah uang
.broadcast    → Broadcast ke semua grup
```

---

## ⚙️ Konfigurasi

Edit `config.js` sesuai kebutuhan:

```javascript
module.exports = {
  // Info Bot
  botName: 'Yora Botz',
  botNumber: '6282228307663',
  ownerName: 'Cahyo Store',
  ownerNumber: '628139525985',
  prefix: '.',

  // Mode
  botMode: 'public',          // 'public' | 'self'

  // Ekonomi
  defaultLimit: 20,
  defaultMoney: 1000,

  // Game
  maxBet: 10000,
  minBet: 100,

  // Anti Spam
  antiSpam: true,
  spamLimit: 5,
  spamInterval: 5000,
};
```

---

## 🌐 Deploy 24/7

### 🥇 Railway (Termudah)

1. Push code ke GitHub
2. Buka [railway.app](https://railway.app) → Login GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Pilih repo → Deploy otomatis
5. Buka **Logs** untuk pairing code

### 🥈 Pterodactyl Panel (Recommended)

**Upload `node_modules` dari Codespaces:**

1. **Di Codespaces:**
   ```bash
   npm install
   zip -r node_modules.zip node_modules
   ```
2. **Download** `node_modules.zip`
3. **Upload** ke Pterodactyl File Manager
4. **Extract** zip
5. **Hapus** `session/` lama
6. **Start** bot

### 🥉 VPS Sendiri

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git

git clone https://github.com/bangcahyo/YoraBotz.git
cd YoraBotz
npm install

sudo npm install -g pm2
pm2 start index.js --name yora-bot
pm2 save
pm2 startup
```

---

## 🐛 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `Cannot find module` | Jalankan `npm install` |
| Pairing code tidak muncul | Hapus `session/`, tunggu 5 menit, restart |
| `Connection Closed` | Tunggu 1-2 jam (rate limit), coba lagi |
| Owner tidak dikenali | Pakai nomor format `62xxx` di `config.js` |
| Sticker error `sharp` | Upload `node_modules` dari Codespaces |
| Menu tidak muncul | Cek log console, screenshot error |

### 🆘 Kode Pairing Selalu Gagal?

**Penyebab paling umum:**
1. **Rate limit WhatsApp** → Tunggu 1-2 jam
2. **Session corrupt** → Hapus folder `session/`
3. **Server IP blocked** → Coba ganti jaringan/server
4. **Nomor bot sudah dipakai** → Logout semua device di WA nomor bot

**Solusi cepat:**
```bash
rm -rf session
# Restart bot, tunggu 10 detik
```

---

## 📊 Statistik

```
╔══════════════════════════════════╗
║   📦 YORA BOTZ v6.0              ║
╚══════════════════════════════════╝
  📁 Menu       : 7 plugin
  📁 Info       : 3 plugin
  📁 Sticker    : 2 plugin
  📁 Tools      : 4 plugin
  📁 Owner      : 5 plugin
  ─────────────────────────────
  📊 Total      : 21+ plugin
  🚀 Fitur      : 50+ command
```

---

## 📝 Lisensi

MIT License — bebas digunakan, dimodifikasi, dan didistribusikan.

---

## ⚠️ Disclaimer

> Bot ini hanya untuk **edukasi & penggunaan pribadi**. Dilarang pakai untuk **spam**, **penipuan**, atau **aktivitas ilegal**. Pengguna bertanggung jawab penuh atas penggunaan bot.

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
