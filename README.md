<!-- ═══════════════════════════════════════════════════════════════ -->
<!--                     YORA BOTZ - FULL README                      -->
<!--                  Bot WhatsApp Multi-Fitur Plugin                 -->
<!-- ═══════════════════════════════════════════════════════════════ -->

<div align="center">

<img src="assets/logo.jpg" alt="Yora Botz Banner" width="100%" />

<br /><br />

# 🤖 YORA BOTZ

### Bot WhatsApp Multi-Fitur Berbasis Plugin

**Modern • Modular • Powerful • Free**

<br />

[![Version](https://img.shields.io/badge/version-4.0.0-5865F2?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bangcahyo/YoraBotz)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Baileys](https://img.shields.io/badge/baileys-6.7.24-9146FF?style=for-the-badge&logo=whatsapp&logoColor=white)](https://github.com/WhiskeySockets/Baileys)
[![Plugins](https://img.shields.io/badge/plugins-89-FF6B6B?style=for-the-badge)](https://github.com/)
[![Features](https://img.shields.io/badge/features-101-FFD93D?style=for-the-badge)](https://github.com/)
[![License](https://img.shields.io/badge/license-MIT-00C853?style=for-the-badge)](LICENSE)

<br />

[🌐 Website](https://fityorastore.netlify.app/) •
[💬 Grup Resmi](https://chat.whatsapp.com/GRj7DL7U8w44CTmGcFC5v2) •
[📞 Owner](https://wa.me/628139525985) •
[⭐ Star This Repo](https://github.com/bangcahyo/YoraBotz)

</div>

---

## 📋 Daftar Isi

- [📖 Tentang Bot](#-tentang-bot)
- [📊 Statistik](#-statistik)
- [✨ Fitur Lengkap](#-fitur-lengkap)
- [🚀 Instalasi](#-instalasi)
- [🧩 Cara Menambah Plugin](#-cara-menambah-plugin-baru)
- [⚙️ Konfigurasi](#️-konfigurasi)
- [🎤 Membuat Voice Note](#-cara-membuat-voice-note)
- [🌐 Deploy 24/7](#-deploy-247)
- [🐛 Troubleshooting](#-troubleshooting)
- [📁 Struktur Folder](#-struktur-folder)
- [🛠️ Tech Stack](#️-tech-stack)
- [🤝 Kontribusi](#-kontribusi)
- [📝 License](#-license)
- [⚠️ Disclaimer](#️-disclaimer)
- [🙏 Thanks To](#-thanks-to)
- [📞 Kontak](#-kontak)

---

## 📖 Tentang Bot

**Yora Botz** adalah bot WhatsApp modern dengan **arsitektur plugin** — setiap command tersimpan di file terpisah, membuatnya mudah dikembangkan, di-debug, dan di-maintain.

Dibangun dengan [Baileys](https://github.com/WhiskeySockets/Baileys), bot ini menawarkan **89 command** dan **12 fitur otomatis** yang siap pakai untuk mengelola grup dan menghibur member.

### 🎯 Kenapa Memilih Yora Botz?

| Icon | Keunggulan | Deskripsi |
|------|-----------|-----------|
| 🧩 | **Modular** | Setiap command di file sendiri — mudah dikembangkan |
| 🚀 | **Ringan** | Tanpa browser — hemat RAM & CPU |
| 🔐 | **Pairing Code** | Login tanpa scan QR |
| 💾 | **Auto Save Session** | Restart tanpa pairing ulang |
| 🎮 | **24 Game** | Lengkap dengan sistem taruhan |
| 📊 | **Level System** | Otomatis dari aktivitas chat |
| 🛡️ | **Group Manager** | Anti-link, anti-spam, welcome |
| 🎤 | **Voice Note** | Menu & owner voice |
| ⚙️ | **Config Editor** | Edit config dari WhatsApp |
| 🆓 | **Gratis** | 100% open source MIT License |

---

## 📊 Statistik

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                📊  YORA BOTZ v4.0  📊                         ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║   KATEGORI              JUMLAH                                ║
║   ─────────────────────────────────────────                   ║
║   🎮 Game               ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   24 cmd      ║
║   🎭 Fun                ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░    8 cmd      ║
║   💰 Ekonomi            ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░    8 cmd      ║
║   📊 Level              ▓▓▓▓▓░░░░░░░░░░░░░░░░░    5 cmd      ║
║   🛡️ Group Admin        ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░   12 cmd      ║
║   📂 Menu               ▓▓▓▓▓▓▓░░░░░░░░░░░░░░░    7 cmd      ║
║   👑 Owner              ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   22 cmd      ║
║   ℹ️ Info               ▓▓▓░░░░░░░░░░░░░░░░░░░    3 cmd      ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║   📌  Total Command  .................................. 89    ║
║   🎁  Fitur Otomatis  ................................. 12    ║
║   ─────────────────────────────────────────────────────────   ║
║   🎯  TOTAL FITUR  ................................... 101    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## ✨ Fitur Lengkap

<details open>
<summary><h3>🎮 Game (24 Command)</h3></summary>

### 🎰 Taruhan Uang

| Command | Deskripsi | Hadiah |
|---------|-----------|--------|
| `.slot <taruhan>` | Mesin slot 3 reel | 5x lipat |
| `.dadu <taruhan>` | Lempar dadu vs bot | 2x lipat |
| `.koin <taruhan>` | Head or Tail | 2x lipat |
| `.bj <taruhan>` | Blackjack kartu 21 | 2x lipat |
| `.roulette <warna> <taruhan>` | Tebak warna (red/black/green) | 14x (green) |
| `.sicbo <taruhan> <besar/kecil>` | 3 dadu | 10x (jackpot) |
| `.suit <pilihan> <taruhan>` | Batu-gunting-kertas | 2x lipat |
| `.war <taruhan>` | Card War | 2x lipat |
| `.wheel <taruhan>` | Spin Wheel | 10x maks |

**Contoh:**
```
.slot 1000
.dadu 500
.bj 2000
.roulette red 1000
.sicbo 500 besar
.suit batu 1000
.war 500
.wheel 1000
```

### 🎯 Tebak-Tebakan (Timeout 60 Detik)

| Command | Jawab Dengan | Hadiah |
|---------|--------------|--------|
| `.tebakangka` | `.jawab <angka>` | +5 Point, +Rp 500 |
| `.quiz` | `.jawabquiz <jawaban>` | +10 Point, +Rp 1000 |
| `.tebakkata` | `.jawabkata <jawaban>` | +3 Point, +Rp 750 |
| `.hangman` | `.tebak <huruf>` | +5 Point, +Rp 1000 |
| `.math` | `.jawabmath <angka>` | +2 Point, +Rp 500 |
| `.tebakemoji` | `.jawabemoji <kategori>` | +3 Point, +Rp 800 |

**Contoh Flow:**
```
User: .tebakangka
Bot:  🔢 TEBAK ANGKA — Bot pilih 1-10
      Jawab: .jawab <angka>

User: .jawab 7
Bot:  🎉 BENAR! Angka: 7
      +5 Point
      +Rp 500
```

**Kalau tidak dijawab dalam 60 detik:**
```
Bot: ⏰ WAKTU HABIS!
     Jawaban: 7
```

**Kalau mau nyerah:**
```
User: .nyerah
Bot:  🏳️ NYERAH!
      Jawaban yang benar: 7
```

### 🎮 Board Game

| Command | Deskripsi |
|---------|-----------|
| `.ttt` | Tic Tac Toe vs Bot |
| `.tttmove <1-9>` | Langkah TTT |

### 🏳️ Utility

| Command | Deskripsi |
|---------|-----------|
| `.nyerah` | Skip soal game aktif |

</details>

<details>
<summary><h3>🎭 Hiburan (8 Command)</h3></summary>

| Command | Deskripsi | Contoh |
|---------|-----------|--------|
| `.pantun` | Pantun random | `.pantun` |
| `.puisi <tema>` | Puisi sesuai tema | `.puisi cinta` |
| `.quote` | Quote of the day | `.quote` |
| `.motivasi` | Motivasi random | `.motivasi` |
| `.katabijak` | Kata bijak random | `.katabijak` |
| `.truth` | Truth or Dare | `.truth` |
| `.ramalan` | Ramalan random | `.ramalan` |
| `.kapankahnikah` | Ramalan jodoh | `.kapankahnikah` |

### 📜 Tema Puisi yang Tersedia
- `cinta` — Puisi romantis
- `sedih` — Puisi galau
- `semangat` — Puisi motivasi
- `alam` — Puisi keindahan alam
- `sahabat` — Puisi persahabatan

**Contoh:**
```
User: .puisi cinta
Bot:  📜 PUISI - CINTA
      
      Cinta ini bagai embun pagi,
      Hadir tanpa pernah diminta,
      Mengisi hati yang sunyi,
      Membuat hidup terasa berbeda.
```

</details>

<details>
<summary><h3>💰 Ekonomi & Profil (8 Command)</h3></summary>

| Command | Deskripsi |
|---------|-----------|
| `.profile` | Profil lengkap (level, exp, limit, uang, point) |
| `.limit` | Cek limit harian |
| `.point` | Cek point |
| `.uang` | Cek saldo uang |
| `.daily` | Reward harian |
| `.transfer @user <jumlah>` | Kirim uang |
| `.shop` | Lihat toko item |
| `.buy <item>` | Beli item |

### 🛒 Item Shop

| Item | Harga | Efek |
|------|-------|------|
| **VIP** | Rp 50.000 | +100 Limit, +Rp 50.000, +500 Point |
| **Limit Booster** | Rp 10.000 | +50 Limit |
| **Money Booster** | Rp 15.000 | +Rp 25.000 |
| **Point Booster** | Rp 20.000 | +100 Point |

**Contoh:**
```
User: .shop
Bot:  🛒 TOKO ITEM
      1. VIP — Rp 50.000
      2. Limit Booster — Rp 10.000
      3. Money Booster — Rp 15.000
      4. Point Booster — Rp 20.000

User: .buy VIP
Bot:  ✅ PEMBELIAN BERHASIL!
      Item: vip
      Harga: Rp 50.000
```

### 🎁 Daily Reward
Setiap 24 jam sekali, dapat reward random:
- +5 s/d +20 Limit
- +Rp 500 s/d +Rp 2.000

</details>

<details>
<summary><h3>📊 Level System (5 Command)</h3></summary>

| Command | Deskripsi |
|---------|-----------|
| `.level` | Cek level & EXP kamu |
| `.rank` | Cek peringkat kamu |
| `.leaderboard` | Top 10 user paling aktif |
| `.resetlevel @user` | Reset level user (owner) |
| `.resetalllevel` | Reset semua level (owner) |

### ⚡ Cara Naik Level
- Kirim pesan di grup → **+10 EXP**
- **Cooldown:** 30 detik per user
- Formula: `level = √(exp / 100) + 1`

### 🎁 Hadiah Naik Level
Setiap naik level, otomatis dapat:
- 💰 **+Rp 500**
- ⭐ **+5 Point**
- 🎫 **+1 Limit**

### 📊 Contoh Tampilan `.level`
```
📊 LEVEL KAMU

📛 Nama: Cahyo Store
🎖️ Level: 5
✨ EXP: 1600

📈 Progress ke Lv.6:
████████░░ 80%

600 / 1100 EXP
```

### 🏆 Contoh `.leaderboard`
```
🏆 LEADERBOARD TOP 10

🥇 @628139525985
   Lv.10 | 8100 EXP

🥈 @628123456789
   Lv.8 | 4900 EXP

🥉 @628987654321
   Lv.6 | 2500 EXP
```

</details>

<details>
<summary><h3>🛡️ Group Admin (12 Command)</h3></summary>

### 🔒 Keamanan

| Command | Deskripsi |
|---------|-----------|
| `.antilink on/off` | Auto hapus pesan berisi link |
| `.antispam on/off` | Auto mute user spam |
| `.unmute @user` | Unmute user (owner) |

**Cara Kerja Anti-Link:**
- Pesan berisi link otomatis dihapus (kecuali admin & owner)
- Support: `http://`, `https://`, `wa.me`, `chat.whatsapp.com`

**Cara Kerja Anti-Spam:**
- 5 pesan / 5 detik → warning
- 2x warning → mute 1 menit
- Pesan spam otomatis dihapus

### 👋 Welcome & Goodbye

| Command | Deskripsi |
|---------|-----------|
| `.welcome on/off` | Aktifkan welcome message |
| `.setwelcome <teks>` | Atur teks welcome |
| `.setgoodbye <teks>` | Atur teks goodbye |

**Placeholder:**
- `@user` → tag user baru
- `@group` → nama grup

**Contoh:**
```
.setwelcome Selamat datang @user di grup @group! 🎉
```

### 👥 Manajemen Member

| Command | Deskripsi |
|---------|-----------|
| `.kick @user` | Kick member |
| `.promote @user` | Promote jadi admin |
| `.demote @user` | Demote dari admin |
| `.tagall <pesan>` | Tag semua member |

### ℹ️ Info Grup

| Command | Deskripsi |
|---------|-----------|
| `.groupinfo` | Info lengkap grup |
| `.id` | Cek ID grup (untuk whitelist) |

</details>

<details>
<summary><h3>📂 Menu (7 Command)</h3></summary>

| Command | Isi |
|---------|-----|
| `.menu` | Menu utama |
| `.menugame` | Daftar game |
| `.menufun` | Menu hiburan |
| `.menuekonomi` | Menu ekonomi |
| `.menulevel` | Menu level |
| `.menugroup` | Menu group admin |
| `.menuowner` | Menu owner (owner only) |

</details>

<details>
<summary><h3>👑 Owner Only (22 Command)</h3></summary>

### 👥 Kelola User

| Command | Deskripsi |
|---------|-----------|
| `.addlimit @user <jml>` | Tambah limit |
| `.addmoney @user <jml>` | Tambah uang |
| `.addpoint @user <jml>` | Tambah point |
| `.setlimit @user <jml>` | Set limit |
| `.setmoney @user <jml>` | Set uang |
| `.resetuser @user` | Reset data user |

### 📢 Komunikasi

| Command | Deskripsi |
|---------|-----------|
| `.broadcast <teks>` | Broadcast ke semua grup |

### 🔒 Mode Bot

| Command | Deskripsi |
|---------|-----------|
| `.self` | Mode self (hanya owner) |
| `.public` | Mode public (semua orang) |
| `.mode` | Cek mode aktif |

### 💾 Backup & Restore

| Command | Deskripsi |
|---------|-----------|
| `.backup` | Backup database (kirim file .json) |
| `.restore` | Restore dari file backup |
| `.restoreyes` | Konfirmasi restore |
| `.restoreno` | Batal restore |

### ⚙️ Config Editor

| Command | Deskripsi |
|---------|-----------|
| `.showconfig` | Lihat config aktif |
| `.getcfg <key>` | Baca 1 key config |
| `.setcfg <key> <val>` | Ubah config |
| `.toggle <key>` | Toggle on/off |
| `.reloadcfg` | Reload tanpa restart |

### 📁 File Manager

| Command | Deskripsi |
|---------|-----------|
| `.readfile <path>` | Baca isi file |
| `.listfiles <folder>` | List folder |

### 💡 Contoh Penggunaan

**Ubah nama bot:**
```
.setcfg botName "Yora Botz"
.reloadcfg
```

**Toggle anti-spam:**
```
.toggle antiSpam
```

**Ganti mode:**
```
.toggle botMode
```

**Backup database:**
```
.backup
```

</details>

<details>
<summary><h3>ℹ️ Info (3 Command)</h3></summary>

| Command | Deskripsi |
|---------|-----------|
| `.owner` | Kontak owner + voice note + vCard |
| `.group` | Link grup resmi |
| `.tqto` | Thanks to contributors |

</details>

<details>
<summary><h3>🎁 Fitur Otomatis (12 Fitur)</h3></summary>

| # | Fitur | Deskripsi |
|---|-------|-----------|
| 1 | 🛡️ **Anti-Link** | Auto hapus link di grup |
| 2 | 🚫 **Anti-Spam** | Auto mute user spam |
| 3 | 👋 **Welcome** | Sambut member baru |
| 4 | 👋 **Goodbye** | Ucapan selamat tinggal |
| 5 | 📊 **Level System** | +EXP otomatis tiap chat |
| 6 | 🔄 **Auto Reset Limit** | Reset limit tiap 24 jam |
| 7 | 🔮 **Random Question** | Jawab pertanyaan tanpa prefix |
| 8 | 🚪 **Anti Random Add** | Keluar dari grup non-whitelist |
| 9 | 🔔 **Notifikasi Owner** | Notif saat bot di-add ke grup random |
| 10 | 💾 **Auto Save Session** | Session tersimpan otomatis |
| 11 | 🔄 **Auto Reconnect** | Reconnect kalau koneksi putus |
| 12 | 🔑 **Pairing Code** | Login tanpa QR |

### 🔮 Random Question (Tanpa Prefix)

Bot akan jawab otomatis kalau user kirim pertanyaan:

| Pertanyaan User | Bot Jawab |
|-----------------|-----------|
| "kapan aku menikah?" | Ramalan jodoh random |
| "akankah aku sukses?" | Ramalan random |
| "apakah dia suka aku?" | Ramalan cinta |
| "ramalan zodiakku?" | Ramalan random |

</details>

---

## 🚀 Instalasi

### 📋 Prasyarat

| Requirement | Versi | Keterangan |
|-------------|-------|------------|
| **Node.js** | ≥ 18.0.0 | [Download disini](https://nodejs.org/) |
| **WhatsApp** | Terbaru | Untuk nomor bot |
| **Koneksi Internet** | Stabil | Minimal 1 Mbps |
| **RAM** | ≥ 512 MB | Untuk Termux/VPS |

### 🔧 Langkah Instalasi

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/bangcahyo/YoraBotz.git
cd YoraBotz
```

Atau **download ZIP** dan extract.

#### 2️⃣ Buat Folder yang Dibutuhkan

```bash
mkdir -p database session assets
```

> ⚠️ **Penting:** Biarkan folder `database/` dan `session/` **kosong** — bot akan mengisi otomatis.

#### 3️⃣ Install Dependencies

```bash
npm install
```

Tunggu hingga selesai (± 1-3 menit).

#### 4️⃣ Konfigurasi Bot

Buka file `config.js`, edit bagian ini:

```javascript
module.exports = {
  // ═══ Info Owner & Bot ═══
  ownerNumber: '628139525985',      // ⚠️ WAJIB (format 62xxx)
  ownerName: 'Cahyo Store',         // Nama owner
  botNumber: '6282228307663',       // ⚠️ WAJIB (format 62xxx)
  website: 'https://fityorastore.netlify.app/',

  // ═══ Bot Settings ═══
  botName: 'Yora Botz',
  prefix: '.',                       // Prefix command
  sessionName: 'session',
  botMode: 'public',                 // 'public' atau 'self'

  // ... (biarkan default)
};
```

> 💡 **Format nomor:** `62xxxxxxxxxx` (tanpa `+`, spasi, atau `0` di depan)

#### 5️⃣ Jalankan Bot

```bash
npm start
```

#### 6️⃣ Tunggu Pairing Code

Setelah bot berjalan, tunggu hingga muncul:

```
╔══════════════════════════════════════╗
║   🔐 PAIRING CODE WHATSAPP BOT       ║
╚══════════════════════════════════════╝

╔══════════════════════════════════════╗
║       ✅ PAIRING CODE BERHASIL        ║
╚══════════════════════════════════════╝

   📱 Nomor Bot : 6282228307663
   🔑 Kode      : ABCD-EFGH

📌 Masukkan kode ke WhatsApp (tanpa tanda -)
```

#### 7️⃣ Aktifkan di WhatsApp

1. Buka **WhatsApp** di HP nomor bot
2. **Pengaturan** → **Perangkat Tertaut**
3. Ketuk **"Tautkan Perangkat"**
4. Pilih **"Tautkan dengan nomor telepon saja"**
5. Masukkan kode **`ABCDEFGH`** (tanpa tanda `-`)
6. Kode berlaku **±1 menit** — cepat masukkan!

#### 8️⃣ Bot Siap Digunakan! 🎉

Setelah pairing berhasil, akan muncul:

```
╔══════════════════════════════════════╗
║      ✅ BOT BERHASIL TERHUBUNG!       ║
╚══════════════════════════════════════╝
🤖 Bot      : Yora Botz
📞 Nomor    : 6282228307663
👑 Owner    : Cahyo Store
📌 Mode     : PUBLIC
💾 Session  : Tersimpan di ./session/
════════════════════════════════════════
```

### 🔄 Restart Bot

Saat bot di-restart, **tidak perlu pairing ulang**:

```
╔══════════════════════════════════════╗
║   📁 SESSION DITEMUKAN & VALID       ║
╚══════════════════════════════════════╝
✅ Bot sudah pernah login: 628xxx:xx@s.whatsapp.net
🚀 Tidak perlu pairing, langsung connect...
```

---

## 🧩 Cara Menambah Plugin Baru

Karena bot pakai **arsitektur plugin**, tambah fitur sangat mudah!

### 📝 Contoh: Bikin Command `.ping`

**1. Buat file:** `plugins/game/ping.js`

```javascript
module.exports = {
  name: 'ping',              // Nama command utama
  category: 'game',          // Kategori (folder)
  aliases: ['p'],            // Alias (opsional)
  
  async execute(sock, msg, args, ctx) {
    const { from } = ctx;
    const start = Date.now();
    await sock.sendMessage(from, { text: '🏓 Pong!' }, { quoted: msg });
    const latency = Date.now() - start;
    await sock.sendMessage(from, { text: `⚡ Latency: ${latency}ms` });
  }
};
```

**2. Restart bot:**
```bash
npm start
```

**3. Test:** Kirim `.ping` di WhatsApp!

### 📚 Context `ctx` Berisi Apa Saja?

Semua yang kamu butuhkan sudah tersedia di dalam `ctx`:

```javascript
const {
  // ═══ Config & Info ═══
  config,          // Semua config bot
  from,            // JID chat
  sender,          // JID pengirim
  senderNumber,    // Nomor pengirim (628xxx)
  pushName,        // Nama pengirim
  mentioned,       // Array user yang di-tag
  user,            // Data user (limit, money, point, exp)
  args,            // Array argumen
  msg,             // Objek pesan asli
  sock,            // Socket Baileys
  
  // ═══ Database Functions ═══
  getUser,         // getUser(jid) → ambil data user
  updateUser,      // updateUser(jid, {key: val})
  loadDB, saveDB,  // Load/save database user
  loadGroups,      // Load data grup
  getGroupSettings,     // getGroupSettings(jid)
  updateGroupSettings,  // updateGroupSettings(jid, {key: val})
  saveMode,        // saveMode('self'|'public')
  
  // ═══ Helper Functions ═══
  isOwner,         // isOwner(jid) → cek owner by JID
  isSenderOwner,   // isSenderOwner() → cek owner (LID-aware) ⭐
  isGroup,         // isGroup(jid) → cek apakah grup
  isGroupAllowed,  // isGroupAllowed(jid) → cek whitelist
  random,          // random(array) → ambil item acak
  formatMoney,     // formatMoney(1000) → "Rp 1.000"
  checkSpam,       // checkSpam(jid) → cek spam status
  
  // ═══ Game State ═══
  gameState,       // Objek state game aktif
  gameTimers,      // Timer aktif
  setGameTimeout,  // setGameTimeout(roomId, callback)
  clearGameTimeout,// clearGameTimeout(roomId)
  
  // ═══ Level Functions ═══
  getLevelFromExp, // getLevelFromExp(exp) → level
  getExpForLevel,  // getExpForLevel(level) → exp minimal
  getExpProgress,  // getExpProgress(exp) → { level, percent, ... }
  addExp,          // addExp(jid) → tambah EXP user
  
  // ═══ Sender Functions ═══
  sendVoiceNote,   // sendVoiceNote(sock, from, path, url, msg)
  sendImageCaption,// sendImageCaption(sock, from, path, url, caption, msg)
} = ctx;
```

### 🎯 Template Plugin Lengkap

```javascript
module.exports = {
  name: 'namacommand',           // Wajib
  category: 'game',              // Wajib
  aliases: ['alias1', 'alias2'], // Opsional
  
  async execute(sock, msg, args, ctx) {
    // Destructure yang dibutuhkan saja
    const { config, from, sender, user, formatMoney } = ctx;
    
    // Validasi argumen
    if (!args[0]) {
      return sock.sendMessage(from, { text: '❌ Masukkan argumen!' }, { quoted: msg });
    }
    
    // Logika command
    // ...
    
    // Kirim balasan
    await sock.sendMessage(from, { 
      text: `✅ Berhasil!` 
    }, { quoted: msg });
  }
};
```

### 📂 Kategori Plugin yang Tersedia

| Folder | Kategori | Keterangan |
|--------|----------|------------|
| `plugins/menu/` | `menu` | Menu bot |
| `plugins/game/` | `game` | Game & taruhan |
| `plugins/fun/` | `fun` | Hiburan |
| `plugins/ekonomi/` | `ekonomi` | Ekonomi & profil |
| `plugins/level/` | `level` | Level system |
| `plugins/group/` | `group` | Group admin |
| `plugins/owner/` | `owner` | Owner only |
| `plugins/info/` | `info` | Info bot |

---

## ⚙️ Konfigurasi

### 📌 Info Bot

| Setting | Default | Deskripsi |
|---------|---------|-----------|
| `ownerNumber` | - | Nomor owner (format: 62xxx) |
| `ownerName` | - | Nama owner |
| `botNumber` | - | Nomor bot (format: 62xxx) |
| `botName` | Yora Botz | Nama bot |
| `prefix` | `.` | Prefix command |
| `website` | - | Website owner |

### 🔒 Mode Bot

```javascript
botMode: 'public',  // 'public' = semua orang, 'self' = hanya owner
```

### 🎮 Game Settings

```javascript
maxBet: 10000,      // Taruhan maksimal
minBet: 100,        // Taruhan minimal
gameTimeout: 60000, // Timeout game tebak-tebakan (ms)
```

### 🛡️ Anti-Spam

```javascript
antiSpam: true,           // Aktif/nonaktif
spamLimit: 5,             // Max pesan dalam interval
spamInterval: 5000,       // Interval (ms)
spamMuteDuration: 60000,  // Durasi mute (ms)
warningBeforeMute: 2,     // Warning sebelum mute
```

### 🎤 Voice & Gambar

```javascript
menuImage: './assets/menu.jpg',   // Gambar menu
voiceMenu: './assets/menu.ogg',   // Voice menu
sendMenuAs: 'both',               // 'text' | 'voice' | 'both'
voiceOwner: './assets/owner.ogg', // Voice owner
sendOwnerAs: 'both',
```

### 📊 Level System

```javascript
levelSystem: {
  enabled: true,
  expPerMessage: 10,           // EXP per pesan
  expCooldown: 30000,          // Cooldown (ms)
  maxLevel: 100,               // Level maksimal
  rewardPerLevelUp: {
    money: 500,                // Hadiah uang
    point: 5,                  // Hadiah point
    limit: 1,                  // Hadiah limit
  },
},
```

### 🚪 Whitelist Grup

```javascript
whitelistGroup: {
  enabled: false,        // true untuk aktifkan
  groups: [
    // '628xxx-xxx@g.us'  ← tambahkan ID grup
  ],
},
```

**Cara dapat ID grup:**
1. Set `whitelistGroup.enabled: false` dulu
2. Add bot ke grup
3. Ketik `.id` di grup → copy ID
4. Update `config.js` dengan ID tersebut
5. Set `whitelistGroup.enabled: true`
6. Restart bot

---

## 🎤 Cara Membuat Voice Note

### 📋 Format yang Didukung

| Format | Support | Rekomendasi |
|--------|---------|-------------|
| `.ogg` (OPUS) | ✅ | ⭐ **Terbaik** |
| `.opus` | ✅ | Bagus |
| `.mp3` | ⚠️ | Bisa bermasalah |

### 🔧 Cara Convert MP3 → OGG

1. **Rekam suara** pakai HP → simpan MP3
2. Buka **[cloudconvert.com/mp3-to-ogg](https://cloudconvert.com/mp3-to-ogg)**
3. **Set konversi:**
   - Codec: **OPUS**
   - Channels: **Mono**
   - Sample Rate: **16000 Hz**
4. Download → rename → simpan di `assets/`

### 🤖 AI Voice Generator

| Website | Bahasa | Harga |
|---------|--------|-------|
| [ttsmaker.com](https://ttsmaker.com) | Indonesia | Gratis |
| [elevenlabs.io](https://elevenlabs.io) | Multi | Free tier |
| [naturalreaders.com](https://www.naturalreaders.com) | Multi | Gratis |

### 📝 Contoh Teks Voice Menu

> *"Halo, selamat datang di Yora Botz. Ketik titik menu untuk melihat semua fitur. Ketik titik owner untuk menghubungi owner. Website kami fityorastore dot netlify dot app. Terima kasih."*

### 📝 Contoh Teks Voice Owner

> *"Halo, saya Cahyo Store, owner dari bot ini. Jika ada kendala, ingin beli script, atau butuh bantuan, hubungi saya di nomor 08139525985. Terima kasih."*

### 📁 File Assets yang Dibutuhkan

```
assets/
├── logo.jpg       ← Logo untuk README
├── menu.jpg       ← Gambar menu (max 1MB)
├── menu.ogg       ← Voice menu
└── owner.ogg      ← Voice owner
```

> ⚠️ **Semua file opsional** — kalau tidak ada, bot kirim teks saja.

---

## 🌐 Deploy 24/7

### 🥇 Opsi 1: Railway (Recommended)

**Kelebihan:** Sangat mudah, gratis kredit $5/bulan, auto-deploy dari GitHub.

**Kekurangan:** Session bisa hilang saat redeploy.

**Langkah:**
1. Push code ke GitHub
2. Buka [railway.app](https://railway.app) → Login GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Pilih repo `YoraBotz`
5. Railway auto-detect Node.js → Deploy
6. Buka **Logs** untuk pairing code

### 🥈 Opsi 2: Render (Free + Keep-Alive)

**Kelebihan:** Gratis, banyak panduan.

**Kekurangan:** Bot "tidur" setelah 15 menit tidak aktif.

**Solusi Keep-Alive:**
1. Deploy bot di Render
2. Deploy service **UptimeRobot** atau [cron-job.org](https://cron-job.org)
3. Setup ping setiap 12 menit ke URL bot
4. Bot tidak akan tidur

### 🥉 Opsi 3: Fly.io (Persistent Volume)

**Kelebihan:** 3 VM gratis, session permanen (tidak hilang saat restart).

**Langkah:**
1. Install `flyctl`: `curl -L https://fly.io/install.sh | sh`
2. Login: `flyctl auth login`
3. Deploy: `flyctl launch`
4. Set volume untuk session

### 💻 Opsi 4: VPS (Paling Stabil)

**Kelebihan:** Full control, tidak ada batasan.

**Rekomendasi VPS:** DigitalOcean, Vultr, Contabo, Biznet Gio.

**Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git

# Clone & install
git clone https://github.com/bangcahyo/YoraBotz.git
cd YoraBotz
npm install

# Jalankan dengan PM2 (auto-restart)
sudo npm install -g pm2
pm2 start index.js --name yora-bot
pm2 save
pm2 startup
```

### 📱 Opsi 5: Termux (Android)

**Kelebihan:** Gratis, di HP sendiri.

**Kekurangan:** HP harus nyala terus.

```bash
pkg update && pkg upgrade
pkg install nodejs git
git clone https://github.com/bangcahyo/YoraBotz.git
cd YoraBotz
npm install
npm start
```

### 📊 Perbandingan Platform

| Platform | Harga | Session Aman? | 24/7? | Cocok Untuk |
|----------|-------|---------------|-------|-------------|
| **Railway** | Gratis ($5/bln) | ⚠️ Bisa hilang | ✅ | Pemula |
| **Render** | Gratis | ⚠️ Bisa hilang | ⚠️ Perlu keep-alive | Yang sabar |
| **Fly.io** | Gratis (3 VM) | ✅ Persistent | ✅ | Advanced |
| **VPS** | Mulai $3/bln | ✅ Persistent | ✅ | Serious user |
| **Termux** | Gratis | ✅ Aman | ⚠️ HP nyala | Personal |

---

## 🐛 Troubleshooting

<details>
<summary><b>❌ Cannot find module</b></summary>

**Penyebab:** Dependencies belum terinstall.

**Solusi:**
```bash
npm install
```
</details>

<details>
<summary><b>❌ Cannot find module './config'</b></summary>

**Penyebab:** File bernama `config.json` bukan `config.js`.

**Solusi:** Rename `config.json` → `config.js`
</details>

<details>
<summary><b>❌ ENOENT: no such file or directory</b></summary>

**Penyebab:** Folder `database/` atau `session/` tidak ada.

**Solusi:**
```bash
mkdir -p database session assets
```
</details>

<details>
<summary><b>❌ Kode pairing tidak muncul</b></summary>

**Penyebab:** Session lama masih ada atau koneksi error.

**Solusi:**
1. Hapus folder `session`: `rm -rf session`
2. Jalankan ulang: `npm start`
3. Cek koneksi internet
</details>

<details>
<summary><b>❌ Kode expired / ditolak WhatsApp</b></summary>

**Penyebab:** Rate limit dari WhatsApp.

**Solusi:**
1. Tunggu 5-10 menit
2. Jalankan ulang bot
3. Generate kode baru
4. Cepat masukkan (dalam 1 menit)
</details>

<details>
<summary><b>❌ Owner tidak dikenali</b></summary>

**Penyebab:** Baileys 6.7.x pakai LID (Linked ID).

**Solusi:** Sudah fix di v4.0 dengan fungsi `isSenderOwner()`. Pastikan:
- `config.ownerNumber` format `62xxx`
- Kode menggunakan `isSenderOwner()` bukan `isOwner()`
</details>

<details>
<summary><b>❌ Bot tidak merespon</b></summary>

**Cek satu per satu:**
1. Bot online? Cek terminal
2. Mode bot? Ketik `.mode`
3. Prefix benar? Cek `config.prefix`
4. Plugin dimuat? Cek log startup
</details>

<details>
<summary><b>❌ Bot pairing ulang terus</b></summary>

**Penyebab:** Session tidak tersimpan permanen (platform ephemeral).

**Solusi:** Pindah ke:
- VPS (paling aman)
- Fly.io (persistent volume)
- Railway + backup session manual
</details>

<details>
<summary><b>❌ Voice tidak muncul di WhatsApp</b></summary>

**Penyebab:** Format audio salah.

**Solusi:**
1. Convert ulang dengan setting:
   - Codec: **OPUS**
   - Channels: **Mono**
   - Sample Rate: **16000 Hz**
2. Rename → `menu.ogg` / `owner.ogg`
3. Simpan di `assets/`
</details>

<details>
<summary><b>❌ Gambar menu tidak muncul</b></summary>

**Cek:**
1. Ukuran max **1 MB** → kompres di [tinypng.com](https://tinypng.com)
2. Path di config: `./assets/menu.jpg`
3. Nama file: `menu.jpg` (huruf kecil)
</details>

<details>
<summary><b>❌ Folder typo (onwner, gamme, dll)</b></summary>

**Penyebab:** Salah ketik nama folder saat setup.

**Solusi:** Rename folder sesuai:
- `plugins/owner/` (bukan `onwner`)
- `plugins/game/` (bukan `gamme`)
- `plugins/ekonomi/` (bukan `ekonomy`)
</details>

<details>
<summary><b>❌ Plugin tidak dimuat</b></summary>

**Cek:**
1. Nama file diakhiri `.js`
2. Format plugin valid (`name`, `execute`)
3. Tidak ada typo di `module.exports`
4. Cek log startup untuk error
</details>

<details>
<summary><b>❌ `npm: command not found`</b></summary>

**Solusi:** Install Node.js dulu:
- Windows/Mac: [Download disini](https://nodejs.org/)
- Termux: `pkg install nodejs-lts`
- Linux: `sudo apt install nodejs npm`
</details>

<details>
<summary><b>❌ Error 429 (Too Many Requests)</b></summary>

**Penyebab:** Terlalu sering pairing ulang.

**Solusi:**
1. Stop bot
2. Tunggu 30-60 menit
3. Coba lagi
</details>

---

## 📁 Struktur Folder

```
YoraBotz/
│
├── 📄 package.json              # Dependencies
├── 📄 config.js                 # Konfigurasi bot
├── 📄 index.js                  # Loader utama
├── 📄 README.md                 # Dokumentasi ini
├── 📄 .gitignore                # Git ignore
│
├── 📁 lib/                      # Library internal
│   ├── database.js              # Manajemen database
│   ├── helper.js                # Fungsi helper
│   ├── level.js                 # Sistem level
│   ├── sender.js                # Kirim voice/gambar
│   └── config-editor.js         # Editor config
│
├── 📁 plugins/                  # 89 plugin command
│   ├── 📁 menu/       (7 file)
│   ├── 📁 game/       (24 file)
│   ├── 📁 fun/        (8 file)
│   ├── 📁 ekonomi/    (8 file)
│   ├── 📁 level/      (5 file)
│   ├── 📁 group/      (12 file)
│   ├── 📁 owner/      (22 file)
│   └── 📁 info/       (3 file)
│
├── 📁 assets/                   # Media (opsional)
│   ├── logo.jpg                 # Logo untuk README
│   ├── menu.jpg                 # Gambar menu
│   ├── menu.ogg                 # Voice menu
│   └── owner.ogg                # Voice owner
│
├── 📁 database/                 # Auto-generate
│   ├── users.json               # Data user
│   ├── groups.json              # Data grup
│   └── mode.json                # Mode bot
│
└── 📁 session/                  # Auto-generate (WhatsApp auth)
    └── creds.json
```

### 📊 Detail Plugin

| Folder | Jumlah | File |
|--------|--------|------|
| `menu/` | 7 | menu, menugame, menufun, menuekonomi, menulevel, menugroup, menuowner |
| `game/` | 24 | slot, dadu, koin, bj, roulette, sicbo, suit, war, wheel, tebakangka, jawab, quiz, jawabquiz, tebakkata, jawabkata, hangman, tebak, math, jawabmath, tebakemoji, jawabemoji, ttt, tttmove, nyerah |
| `fun/` | 8 | pantun, puisi, quote, motivasi, katabijak, truth, ramalan, kapankahnikah |
| `ekonomi/` | 8 | profile, limit, point, uang, daily, transfer, shop, buy |
| `level/` | 5 | level, rank, leaderboard, resetlevel, resetalllevel |
| `group/` | 12 | antilink, antispam, unmute, welcome, setwelcome, setgoodbye, kick, promote, demote, tagall, groupinfo, id |
| `owner/` | 22 | addlimit, addmoney, addpoint, setlimit, setmoney, resetuser, broadcast, self, public, mode, botinfo, backup, restore, restoreyes, restoreno, getcfg, setcfg, reloadcfg, showconfig, toggle, readfile, listfiles |
| `info/` | 3 | owner, group, tqto |

---

## 🛠️ Tech Stack

<div align="center">

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Baileys** | 6.7.24 | Library WhatsApp Web |
| **Node.js** | ≥ 18.0.0 | JavaScript Runtime |
| **Pino** | 9.0.0 | Logger |
| **@hapi/boom** | 10.0.1 | Error Handling |

</div>

### 📦 Dependencies

```json
{
  "@hapi/boom": "^10.0.1",
  "@whiskeysockets/baileys": "6.7.24",
  "pino": "^9.0.0"
}
```

---

## 🤝 Kontribusi

Kontribusi selalu diterima! 🎉

### Cara Berkontribusi

1. **Fork** repository ini
2. **Buat branch baru:** `git checkout -b fitur-baru`
3. **Commit perubahan:** `git commit -m 'Menambah fitur X'`
4. **Push ke branch:** `git push origin fitur-baru`
5. **Buat Pull Request**

### Aturan Kontribusi

- ✅ Ikuti struktur plugin yang ada
- ✅ Beri komentar untuk kode kompleks
- ✅ Test dulu sebelum push
- ✅ Update README kalau perlu
- ❌ Jangan hapus fitur orang lain
- ❌ Jangan pakai kode berbayar tanpa izin
- ❌ Jangan upload folder `session/`

---

## 📝 License

Project ini dilisensikan di bawah **MIT License** — bebas digunakan, dimodifikasi, dan didistribusikan dengan syarat mencantumkan credit.

Lihat file [LICENSE](LICENSE) untuk detail.

```
MIT License

Copyright (c) 2026 Cahyo Store

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
```

---

## ⚠️ Disclaimer

> **PENTING — BACA SEBELUM PAKAI**
> 
> - 📚 Bot ini hanya untuk **edukasi & penggunaan pribadi**
> - 🚫 **DILARANG** pakai untuk **spam**, **penipuan**, atau **aktivitas ilegal**
> - ⚖️ Pengguna bertanggung jawab penuh atas penggunaan bot
> - 🛡️ Developer **tidak bertanggung jawab** atas penyalahgunaan
> - 📱 WhatsApp dapat **memblokir** nomor yang spam/berlebihan
> - 🔒 Jangan share folder `session/` ke orang lain (berisi kredensial)
> - 💰 Bot ini **100% gratis** — kalau ada yang jual, berarti penipuan

---

## 🙏 Thanks To

<div align="center">

**Terima kasih kepada:**

| Icon | Nama | Peran |
|------|------|-------|
| 👑 | **Cahyo Store** | Owner & Developer |
| 🤖 | **Baileys Team** | Library WhatsApp |
| 📚 | **Allah SWT** | Yang Maha Kuasa |
| 💖 | **Kamu** | Pengguna setia bot ini |

</div>

---

## 📞 Kontak

<div align="center">

### Ada pertanyaan? Butuh bantuan?

<br />

👑 **Owner:** Cahyo Store

📞 **WhatsApp:** [+62 813-9525-985](https://wa.me/628139525985)

🌐 **Website:** [fityorastore.netlify.app](https://fityorastore.netlify.app/)

💬 **Grup Resmi:** [Klik untuk bergabung](https://chat.whatsapp.com/GRj7DL7U8w44CTmGcFC5v2)

<br />

---

<br />

### ⭐ Bermanfaat? Jangan lupa kasih bintang! ⭐

[![Star](https://img.shields.io/github/stars/bangcahyo/YoraBotz?style=social)](https://github.com/bangcahyo/YoraBotz)

<br />

[![Star History Chart](https://api.star-history.com/svg?repos=bangcahyo/YoraBotz&type=Date)](https://star-history.com/#bangcahyo/YoraBotz&Date)

<br />

**Made with ❤️ by [Cahyo Store](https://fityorastore.netlify.app/)**

<br />

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer)

</div>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!--                      END OF README                               -->
<!-- ═══════════════════════════════════════════════════════════════ -->
