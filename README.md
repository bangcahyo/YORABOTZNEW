<div align="center">

<img src="assets/logo.jpg" alt="Yora Botz" width="500" />

# 🤖 YORA BOTZ

**Bot WhatsApp Multi-Fitur Berbasis Plugin**

[![Version](https://img.shields.io/badge/v4.2.0-blue?style=flat-square)](https://github.com/bangcahyo/YoraBotz)
[![Node](https://img.shields.io/badge/node-%3E%3D20-green?style=flat-square)](https://nodejs.org/)
[![Plugins](https://img.shields.io/badge/plugins-104-orange?style=flat-square)](https://github.com/)
[![License](https://img.shields.io/badge/license-MIT-yellow?style=flat-square)](LICENSE)

[🌐 Website](https://fityorastore.netlify.app/) • [💬 Grup](https://chat.whatsapp.com/GRj7DL7U8w44CTmGcFC5v2) • [📞 Owner](https://wa.me/628139525985)

</div>

---

## ✨ Fitur

| | |
|---|---|
| 📥 **Downloader** | TikTok, Instagram, YouTube (MP3/MP4) — 100% online |
| 🎮 **30 Game** | Slot, dadu, bj, quiz, tebak gambar, pemain bola, lagu, film |
| 💰 **Ekonomi** | Limit, uang, point, daily, shop, transfer |
| 📊 **Level System** | Naik level otomatis dari aktivitas chat |
| 🛡️ **Group Admin** | Anti-link, anti-spam, welcome, kick, promote |
| 🎭 **Hiburan** | Pantun, puisi, quote, ramalan, truth or dare |
| 🖼️ **Media Online** | Gambar, foto pemain, audio, poster (semua online) |
| 👑 **Owner Tools** | Backup, config editor, savefile, reload, restart |
| 🎤 **Voice & Gambar** | Menu dengan voice note + thumbnail |
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

**Pairing Code** muncul di terminal → masukkan ke WhatsApp (Perangkat Tertaut → Tautkan dengan nomor telepon).

---

## 📁 Struktur

```
YoraBotz/
├── 📄 config.js          # Konfigurasi
├── 📄 index.js           # Loader
├── 📁 lib/               # Library internal
├── 📁 plugins/           # 104 plugin command
│   ├── menu/   game/   fun/    ekonomi/
│   ├── level/  group/  owner/  info/
│   ├── download/         ← TikTok, IG, YouTube
│   └── sticker/          ← Sticker, toimg, emojimix
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
| **[Pterodactyl Panel](https://zanspiwpanel.biz.id)** | Mulai Rp 8.500 | ⭐ Hemat |
| **[Railway](https://railway.app)** | Gratis ($5/bln) | Mudah |
| **[Fly.io](https://fly.io)** | Gratis (3 VM) | Sesi permanen |
| **VPS** | $3/bln | Paling stabil |
| **Termux** | Gratis | Di HP sendiri |

> ⚠️ **Catatan Pterodactyl:** Fitur sticker butuh `sharp` yang mungkin diblokir di panel gratis. Kalau error, upload folder `node_modules` dari Codespaces/laptop.

---

## 🐛 Error Umum

| Masalah | Solusi |
|---------|--------|
| `Cannot find module` | `npm install` |
| `Cannot find './config'` | Rename `config.json` → `config.js` |
| Pairing gagal | Hapus folder `session`, tunggu 5 menit, ulang |
| Owner tidak dikenali | Pastikan format nomor `62xxx` |
| Voice tidak muncul | Convert ke **OPUS, Mono, 16kHz** |
| Sticker error `sharp` | Upload `node_modules` dari Codespaces |
| Session hilang terus | Pindah ke VPS/Fly.io |
| `install-scripts blocked` | Upload `node_modules` manual |

---

## 📋 Daftar Command

<details>
<summary><b>📥 Download (4)</b></summary>

`.tiktok` `.ig` `.ytmp4` `.ytmp3`
</details>

<details>
<summary><b>🎮 Game (30)</b></summary>

`.slot` `.dadu` `.koin` `.bj` `.roulette` `.sicbo` `.suit` `.war` `.wheel` `.tebakangka` `.quiz` `.tebakkata` `.tebakemoji` `.math` `.hangman` `.ttt` `.tttmove` `.tebakgambar` `.tebakpemainbola` `.tebaklagu` `.tebakfilm` `.tebakhewan` `.tebakibukota` `.nyerah`
</details>

<details>
<summary><b>🎨 Sticker (3)</b></summary>

`.sticker` `.toimg` `.emojimix`
</details>

<details>
<summary><b>🎭 Fun (8)</b></summary>

`.pantun` `.puisi` `.quote` `.motivasi` `.katabijak` `.truth` `.ramalan` `.kapankahnikah`
</details>

<details>
<summary><b>💰 Ekonomi (8)</b></summary>

`.profile` `.limit` `.point` `.uang` `.daily` `.transfer` `.shop` `.buy`
</details>

<details>
<summary><b>📊 Level (5)</b></summary>

`.level` `.rank` `.leaderboard` `.resetlevel` `.resetalllevel`
</details>

<details>
<summary><b>🛡️ Group Admin (12)</b></summary>

`.antilink` `.antispam` `.unmute` `.welcome` `.setwelcome` `.setgoodbye` `.kick` `.promote` `.demote` `.tagall` `.groupinfo` `.id`
</details>

<details>
<summary><b>📂 Menu (8)</b></summary>

`.menu` `.menugame` `.menufun` `.menuekonomi` `.menulevel` `.menudownload` `.menugroup` `.menuowner`
</details>

<details>
<summary><b>👑 Owner (25)</b></summary>

`.addlimit` `.addmoney` `.addpoint` `.setlimit` `.setmoney` `.resetuser` `.broadcast` `.self` `.public` `.mode` `.botinfo` `.backup` `.restore` `.restoreyes` `.restoreno` `.getcfg` `.setcfg` `.reloadcfg` `.showconfig` `.toggle` `.readfile` `.listfiles` `.savefile` `.reloadplugins` `.restartbot`
</details>

<details>
<summary><b>ℹ️ Info (3)</b></summary>

`.owner` `.group` `.tqto`
</details>

---

## 🎁 Fitur Otomatis

- 🛡️ **Anti-Link** — Auto hapus link di grup
- 🚫 **Anti-Spam** — Auto mute user spam
- 👋 **Welcome & Goodbye** — Sambut member baru
- 📊 **Level System** — +EXP otomatis tiap chat
- 🔄 **Auto Reset Limit** — Reset limit tiap 24 jam
- 🔮 **Random Question** — Jawab pertanyaan tanpa prefix
- 🚪 **Anti Random Add** — Keluar dari grup non-whitelist
- 💾 **Auto Save Session** — Tidak pairing ulang saat restart

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
