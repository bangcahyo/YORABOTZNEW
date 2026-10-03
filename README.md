<div align="center">

<img src="assets/logo.jpg" alt="Yora Botz" width="500" />

# 🤖 YORA BOTZ

**Bot WhatsApp Multi-Fitur dengan Pairing Code — Tanpa QR**

[![Version](https://img.shields.io/badge/v7.2.1-blue?style=flat-square)](https://github.com/bangcahyo/YoraBotz)
[![Node](https://img.shields.io/badge/node-%3E%3D20.18.1-green?style=flat-square)](https://nodejs.org/)
[![Baileys](https://img.shields.io/badge/baileys-6.7.24-purple?style=flat-square)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/license-restricted-red?style=flat-square)](LICENSE)

[🌐 Website](https://fityorastore.netlify.app/) • [💬 Grup](https://chat.whatsapp.com/K97NhtfCxoV90vJ2ub419I?s=cl&p=a&mlu=4&ilr=4) • [📞 Owner](https://wa.me/628139525985)

</div>

---

## Lisensi dan penggunaan

Yora Botz menggunakan lisensi khusus; bukan MIT. Penggunaan untuk operasi
pribadi/non-komersial diperbolehkan sesuai ketentuan [LICENSE](LICENSE), tetapi
penjualan, redistribusi, penghapusan atribusi, dan penggantian nama produk
memerlukan izin tertulis dari Cahyo Store. Penyalinan atau distribusi tanpa
izin dapat mengakibatkan pencabutan izin dan blacklist dari seluruh layanan,
fitur, update, dukungan, serta kanal komunitas resmi Yora Botz. Bot akan
menolak berjalan jika `botName` di `config.js` bukan `Yora Botz`. Pemeriksaan
ini hanya memvalidasi nama konfigurasi dan tidak mendeteksi penyalinan atau
penjualan salinan di luar bot.

---

## ✨ Fitur Utama

| | |
|---|---|
| 🔐 **Pairing Code** | Login tanpa QR — cukup kode 8 digit |
| 🅟 **Premium System** | Fitur eksklusif premium + kelola dari chat |
| 🅛 **Limit System** | Biaya limit per command (download, tools, dll) |
| 🎨 **Sticker** | Bikin sticker dari gambar/video |
| 📤 **To URL** | Upload media → link publik |
| 📥 **Downloader** | YouTube, TikTok, Instagram (premium) |
| 📚 **Wikipedia** | Cari artikel dari Wikipedia |
| 🌤️ **Cuaca** | Info cuaca real-time |
| 🎮 **40 Game** | Slot, dadu, tebak-tebakan, family100, dll |
| 🎲 **19 Menu Fun** | Quote, pantun, puisi, gombalan, zodiak, dll |
| 🧰 **Utility Tools** | Jam, BMI, reminder, translate, cekpasangan, acak angka, status bot |
| 💰 **Ekonomi** | Limit, uang, point, daily, shop, premium |
| 📊 **Level System** | Naik level dari aktivitas chat |
| 🛡️ **Group Admin** | Anti-link, anti-spam, welcome |
| 👑 **Owner Tools** | Backup, config editor, broadcast, premium |

---

## 🅟🅛 Sistem Premium & Limit

Yora Botz v7.2 menghadirkan **peningkatan pengalaman premium** dengan sistem yang lebih rapih, lebih stabil, dan lebih nyaman untuk penggunaan harian.

### 🅟 Premium

Fitur premium ditandai dengan **🅟**. User premium mendapatkan keuntungan:

| Keuntungan | Free | Premium 🅟 |
|---|---|---|
| Limit harian | 20 | **100** |
| Bonus uang dari daily | 1x | **2x** |
| Multiplier EXP | 1x | **2x** |
| Diskon shop | — | **20%** (otomatis saat belanja) |
| Fitur downloader | ❌ | ✅ |
| Potongan limit command | Normal | ✅ Tidak dipotong saat Premium aktif |
| Daily briefing personal | ❌ | ✅ |
| Kartu profil premium | ❌ | ✅ |

**Cara jadi premium:**
```
.premium            → Lihat info & benefit premium
.premium cek        → Cek status premium kamu
.premium buy        → Beli premium (bayar pakai uang)
.briefing           → Ringkasan progres, ekonomi, daily, dan status premium
.premiumcard        → Kartu profil premium dalam bentuk gambar
```

**Owner bisa kelola premium:**
```
.addpremium @user 30    → Kasih premium 30 hari
.delpremium @user       → Cabut premium
.listpremium            → Daftar user premium aktif
```

### 🅛 Limit

Fitur yang memakai limit ditandai dengan **🅛**. Setiap command punya biaya berbeda:

| Command | Biaya Limit |
|---|---|
| `youtube` / `ytmp3` / `ytmp4` | 3 |
| `tiktok` / `instagram` | 3 |
| `tourl` / `emojimix` | 2 |
| `sticker` / `toimg` | 1 |
| Command lain | 1 |

> **Catatan:** Owner & user premium **tidak dipotong limit**. Semua **game & fun 100% GRATIS** (tanpa limit) supaya tidak bosen main.

```
.limit              → Cek limit kamu + status premium
.limit info         → Lihat daftar fitur berlimit
```

---

## 🆕 Changelog v7.2.1

### ✨ Fitur Baru Tambahan
- **Utility baru**: `.jam`, `.statusbot`, `.acakangka`, `.bmi`, `.reminder`, `.translate`, `.cekpasangan`
- **Menu tools diperbarui** agar fitur baru mudah diakses dari daftar command.
- **Semua plugin baru otomatis terdaftar** saat bot mulai, tanpa perlu edit manual di loader.

### 🧭 UX & Operasional Bot
- **Saran command otomatis**: jika command tidak dikenal, bot memberi hingga tiga saran command yang paling mirip.
- **Panduan pengguna**: `.tutorial` dan `.commands` membantu user mengenal fitur serta command yang tersedia.
- **Bantuan grup**: `.grouphelp` merangkum command administrasi grup.
- **Pemantauan bot**: `.statusbot` menampilkan kondisi runtime; `.systemaudit` merangkum versi, plugin, data, uptime, dan penggunaan RAM untuk owner.
- **Kontrol owner**: `.security` untuk ringkasan keamanan, `.accessmode self/public` untuk mode akses, dan `.whitelist` untuk mengelola grup yang diizinkan.
- **Restart terjadwal**: `.restartsafe <detik> <alasan>` memberi pemberitahuan sebelum proses restart.

### 🔑 Tanpa API Key
- **Semua penggunaan API key Autoresbot dihapus** dari `config.js` dan `lib/downloader.js`. Bot tidak butuh key apa pun.
- **Downloader ditulis ulang** dan berjalan tanpa key:
  - TikTok → tikwm.com (video & slideshow foto)
  - YouTube → `@distube/ytdl-core` (video maks 720p, audio m4a, durasi maks 15 menit)
  - Instagram → halaman embed publik (post / reel publik)
  - Opsional: pasang [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) dan FFmpeg di server (atau set env `YTDLP_PATH`) → otomatis dipakai sebagai cadangan jika metode utama gagal. FFmpeg diperlukan untuk menggabungkan video dan audio YouTube; runtime Node digunakan yt-dlp untuk ekstraksi YouTube.
- Dependency baru: `@distube/ytdl-core`. Jalankan `npm install` setelah update.

### 📢 Auto Broadcast Diperbaiki
- **Tidak lagi diam saat target kosong** — muncul peringatan jelas di console & di `.ab status`.
- **Status "sudah terkirim" disimpan ke file** (`database/autobroadcast-state.json`) → tidak kirim dobel setelah bot restart.
- **Retry otomatis** (maks 3x) jika semua target gagal; menunggu koneksi siap sebelum mengirim.
- **Jam tengah malam benar** (tidak lagi terbaca "24").
- **Perintah baru:** `.ab addall`, `.ab all on/off`, `.ab list`, `.ab clear`, `.ab send <periode>`, `.ab add/del <jid>`.
- Scheduler berhenti otomatis saat koneksi putus dan menyala lagi dengan socket baru.

### ⚙️ Cara Cepat Menyalakan Auto Broadcast
1. Masuk ke grup tujuan, ketik `.ab add` (atau `.ab addall` untuk semua grup).
2. Ketik `.ab test` untuk mengecek, atau `.ab send pagi` untuk kirim pesan pagi sekarang.
3. Selesai — pesan terkirim otomatis sesuai jadwal di `waktuPesan` (`config.js`).

---

## 🆕 Changelog v7.1

### 🅟 Sistem Premium Baru
- **Premium system lengkap** — user premium dapat limit 100/hari, multiplier uang & EXP 2x, diskon shop 20%, serta akses fitur downloader.
- **Plugin premium** (`.premium`) — cek status, lihat benefit, dan beli premium pakai uang.
- **Plugin owner** — `.addpremium`, `.delpremium`, `.listpremium` untuk kelola premium langsung dari chat.
- **Auto-expire** — premium otomatis hangus saat masa aktif berakhir.

### 🅛 Sistem Limit Baru
- **Biaya limit per command** — download 3, tourl 2, sticker 1, dst. Bisa diatur di `config.js`.
- **Bypass premium & owner** — premium/owner tidak dipotong limit.
- **Plugin limit** (`.limit`) — cek limit + daftar fitur berlimit.

### 🎮 10 Game Baru
- `.tebakbendera` — Tebak negara dari bendera 🇮🇩
- `.tebaksurah` — Tebak surah Al-Qur'an
- `.tebakpresiden` — Tebak presiden
- `.tebakplanet` — Tebak planet tata surya
- `.tebakanime` — Tebak judul anime
- `.asahotak` — Soal asah otak
- `.siapakahaku` — Riddle "siapakah aku?"
- `.caklontong` — Tebak-tebakan receh ala Cak Lontong
- `.lengkapikalimat` — Lengkapi kalimat peribahasa
- `.family100` — Family 100 (jawab banyak kemungkinan)

### 🎲 Fun Diperbanyak (11 Plugin Baru)
- `.dare` — Tantangan dare
- `.faktaunik` — Fakta unik
- `.ceritahoror` — Cerita horor
- `.ceritahumor` — Cerita lucu
- `.gombalan` — Gombalan receh
- `.pickupline` — Pickup line
- `.bucin` — Kata-kata bucin
- `.zodiak` — Ramalan zodiak (12 zodiak)
- `.cekganteng` / `.cekcantik` — Cek skor (hiburan)
- `.artinama` — Arti nama

### 📈 Konten Diperbanyak
- **Quiz** — dari ~85 soal jadi **222 soal** biar tidak bosen.
- **Quote** (40), **pantun** (30), **motivasi** (30), **katabijak** (30), **puisi** (10 tema), **ramalan** (30), **truth/dare** (masing-masing 25/30).

### 🐛 Perbaikan Bug (dari v7.0)
- **Plugin `.daftar` (registrasi) dibuat ulang** — sebelumnya file ini *hilang* padahal `registrationRequired: true`. Kini registrasi berjalan normal + bonus pendaftaran (5 limit & Rp 500).
- **`menulevel.js` dipulihkan** — sebelumnya berisi menu *tools* (salah copy-paste).
- **Plugin `.autobroadcast` dibuat** — sebelumnya ditampilkan di menu owner tapi pluginnya tidak ada.
- **5 game "hantu" dilengkapi** — `.tebakibukota`, `.tebakfilm`, `.tebaklagu`, `.tebakpemainbola`, `.tebakgambar`.
- **Handler `nyerah` generik** — otomatis bekerja untuk semua game.
- **Sinkronisasi versi** — `package.json`, `index.js`, dan README seragam di **v7.1.0**.
- **Bersih-bersih** — 15 file `.bak` usang dihapus.

### ✅ Hasil Verifikasi
- 141 plugin dimuat **tanpa error**.
- 0 command di menu yang tanpa plugin (0 "pajangan").
- Semua file JS lolos pengecekan sintaks.

---

## 🚀 Instalasi

### Regression Tests & Database Writes

Jalankan pemeriksaan lokal dengan:

```bash
npm test
```

Perubahan database di-cache di memori dan penulisan berulang ke file yang sama digabung dalam jeda singkat, lalu disimpan secara atomik. Backup dan restart aman menunggu penulisan selesai; hentikan bot secara normal agar perubahan terakhir sempat tersimpan. Penghentian paksa server tetap dapat menghilangkan perubahan yang belum sempat di-flush.

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
│   ├── 📄 level.js
│   ├── 📄 premium.js       ← helper premium 🅟
│   └── 📄 ...
├── 📁 plugins/
│   ├── 📁 menu/       (8 plugin)
│   ├── 📁 game/       (40 plugin)
│   ├── 📁 fun/        (19 plugin)
│   ├── 📁 ekonomi/    (10 plugin)
│   ├── 📁 level/      (5 plugin)
│   ├── 📁 group/      (12 plugin)
│   ├── 📁 tools/      (5 plugin)
│   ├── 📁 download/   (4 plugin)
│   ├── 📁 info/       (6 plugin)
│   ├── 📁 sticker/    (3 plugin)
│   └── 📁 owner/      (29 plugin)
├── 📁 database/       (auto-generate)
├── 📁 session/        (auto-generate)
└── 📁 assets/         (opsional)
```

---

## 🎯 Daftar Command

> **Legend:** 🅟 = Fitur Premium · 🅛 = Pakai Limit · 🆓 = Gratis

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
.sticker      → Reply gambar → jadi sticker  🅛
.toimg        → Reply sticker → jadi gambar  🅛
.tourl        → Reply media → upload ke link  🅛🅟
.wiki <topik> → Cari di Wikipedia
.cuaca <kota> → Info cuaca
.jodoh @user  → Cek jodoh
.sifat <nama> → Cek sifat
```

### 📥 Download (🅟 Premium)
```
.youtube <url>    → Download YouTube  🅛🅟
.ytmp3 <url>      → YouTube audio     🅛🅟
.ytmp4 <url>      → YouTube video     🅛🅟
.tiktok <url>     → Download TikTok   🅛🅟
.instagram <url>  → Download IG       🅛🅟
```
_Semua downloader berjalan **tanpa API key**. Pasang `yt-dlp` dan FFmpeg di server sebagai fallback; FFmpeg diperlukan untuk menggabungkan stream video dan audio._

### 🧠 Premium AI Assistant
```
.ai <pertanyaan>    → Tanya bot dengan jawaban cepat berbasis FAQ premium
.ask <pertanyaan>   → Alias singkat dari .ai
```
Fitur premium ini membantu user cepat mendapatkan info bot, fitur, cara daftar, cara premium, dan shortcut command utama tanpa harus membuka menu panjang.

### ℹ️ Info
```
.ping         → Test latency bot
.runtime      → Info uptime & server
.statusbot    → Status runtime bot
.tutorial     → Panduan penggunaan
.commands     → Daftar command
.about        → Info bot
.version      → Cek versi bot
.owner        → Kontak owner
.tqto         → Thanks to
```

### 🎮 Game (Semua 🆓 Gratis)
```
.slot <taruhan>     → Mesin slot
.dadu <taruhan>     → Lempar dadu
.koin <taruhan>     → Lempar koin
.bj <taruhan>       → Blackjack
.roulette <warna>   → Roulette
.sicbo <taruhan>    → Sicbo
.suit <pilihan>     → Suit
.war <taruhan>      → War
.wheel <taruhan>    → Roda keberuntungan
.ttt                → Tic Tac Toe
.quiz               → Kuis pengetahuan (222 soal)
.tebakangka         → Tebak angka 1-10
.tebakkata          → Tebak kata
.tebakemoji         → Tebak emoji
.tebakhewan         → Tebak hewan
.tebakibukota       → Tebak ibu kota
.tebakfilm          → Tebak judul film
.tebaklagu          → Tebak judul lagu
.tebakpemainbola    → Tebak pemain bola
.tebakgambar        → Tebak gambar (emoji)
.tebakbendera       → Tebak bendera negara  🆕
.tebaksurah         → Tebak surah Al-Qur'an  🆕
.tebakpresiden      → Tebak presiden  🆕
.tebakplanet        → Tebak planet  🆕
.tebakanime         → Tebak anime  🆕
.asahotak           → Soal asah otak  🆕
.siapakahaku        → Riddle "siapakah aku?"  🆕
.caklontong         → Tebak-tebakan receh  🆕
.lengkapikalimat    → Lengkapi kalimat  🆕
.family100          → Family 100  🆕
.math               → Soal matematika
.hangman            → Hangman
.nyerah             → Skip soal
```

### 🎲 Fun (Semua 🆓 Gratis)
```
.quote              → Quote bijak
.motivasi           → Kata motivasi
.pantun             → Pantun lucu
.katabijak          → Kata bijak
.puisi              → Puisi (10 tema)
.ramalan            → Ramalan harian
.kapankahnikah      → Kapan nikah?
.truth              → Truth or dare (truth)
.dare               → Truth or dare (dare)  🆕
.faktaunik          → Fakta unik  🆕
.ceritahoror        → Cerita horor  🆕
.ceritahumor        → Cerita lucu  🆕
.gombalan           → Gombalan receh  🆕
.pickupline         → Pickup line  🆕
.bucin              → Kata bucin  🆕
.zodiak <zodiak>    → Ramalan zodiak  🆕
.cekganteng         → Cek skor ganteng  🆕
.cekcantik          → Cek skor cantik  🆕
.artinama <nama>    → Arti nama  🆕
```

### 💰 Ekonomi
```
.daftar <nama>      → Registrasi akun
.profile            → Lihat profil
.limit              → Cek limit  🅛
.limit info         → Daftar fitur berlimit  🅛
.point              → Cek point
.uang               → Cek uang
.daily              → Klaim hadiah harian + streak (jaga klaim dalam 48 jam)
.transfer @user     → Transfer uang
.shop               → Lihat toko
.buy <item>         → Beli item
.premium            → Info & beli premium  🅟
.premium cek        → Cek status premium  🅟
.premium buy        → Beli premium  🅟
```

### 📊 Level
```
.level              → Info level
.rank               → Peringkatmu
.leaderboard        → Top 10 user
```

### 🛡️ Group Admin
```
.antilink on/off    → Anti-link
.welcome on/off     → Welcome message
.setwelcome <teks>  → Set teks welcome
.setgoodbye <teks>  → Set teks goodbye
.kick @user         → Keluarkan member
.promote @user      → Jadikan admin
.demote @user       → Cabut admin
.tagall <teks>      → Tag semua member
.groupinfo          → Info grup
.grouphelp          → Bantuan command admin grup
```

### 👑 Owner Only
```
.self               → Mode self
.public             → Mode public
.mode               → Cek mode bot
.accessmode self    → Batasi akses hanya untuk owner
.accessmode public  → Buka akses untuk semua user
.whitelist          → Lihat bantuan whitelist grup
.security           → Ringkasan keamanan bot
.systemaudit        → Audit sistem bot
.commandstats       → Statistik pemakaian command (top 10)
.commandstats reset → Reset statistik command
.activitylog        → Log aktivitas bot (10 terakhir)
.activitylog clear   → Reset log aktivitas
.alerts             → Notifikasi ke owner dan pengaturan alert
.alerts on/off      → Aktifkan / nonaktifkan owner alert
.dashboard          → Ringkasan performa bot & owner panel
.restartsafe 5 maintenance → Restart aman setelah 5 detik
.addmoney @u <jml>  → Tambah uang
.addlimit @u <jml>  → Tambah limit
.addpoint @u <jml>  → Tambah point
.broadcast <teks>   → Broadcast ke semua grup
.autobroadcast      → Kelola auto broadcast (.ab)
.ab add / addall   → Tambah target (grup ini / semua grup)
.ab send <periode> → Kirim pesan sekarang (pagi/siang/sore/petang/malam)
.backup             → Backup database
.restore            → Restore database
.setcfg <k> <v>     → Ubah config
.toggle <key>       → Toggle config
.reloadplugins      → Reload plugin
.restartbot         → Restart bot
.addpremium @u <hr> → Kasih premium  🅟🆕
.delpremium @u      → Cabut premium  🅟🆕
.listpremium        → Daftar user premium  🅟🆕
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

  // 🅟 Premium
  premium: {
    enabled: true,
    price: 50000,
    durationDays: 30,
    dailyLimit: 100,
    dailyMoneyMultiplier: 2,
    expMultiplier: 2,
    shopDiscount: 20,
  },

  // 🅟 Fitur premium only
  premiumOnly: ['tourl', 'emojimix', 'youtube', 'ytmp4', 'ytmp3', 'tiktok', 'instagram', 'ig'],

  // 🅛 Biaya limit per command
  limitCost: {
    default: 1,
    youtube: 3, ytmp4: 3, ytmp3: 3,
    tiktok: 3, instagram: 3, ig: 3,
    tourl: 2, emojimix: 2,
    sticker: 1, toimg: 1,
  },
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
| Fitur premium tidak jalan | Cek `.premium cek`, pastikan masih aktif |
| Limit cepat habis | Jadi premium 🅟 atau tunggu reset 24 jam |

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
║   📦 YORA BOTZ v7.2.1            ║
╚══════════════════════════════════╝
  📁 Menu       : 8 plugin
  📁 Game       : 40 plugin
  📁 Ekonomi    : 12 plugin
  📁 Level      : 5 plugin
  📁 Group      : 13 plugin
  📁 Tools      : 13 plugin
  📁 Download   : 4 plugin
  📁 Fun        : 19 plugin
  📁 Info       : 10 plugin
  📁 Sticker    : 3 plugin
  📁 Owner      : 38 plugin
  ───────────────────────────────
  📊 Total      : 165 plugin
  🚀 Fitur      : 165 plugin command
  🅟 Premium    : aktif
  🅛 Limit      : aktif
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
