const {
  loadAB, saveAB, getSchedule, getTimeInTimezone,
  resolveTargets, broadcastNow,
} = require('../../lib/autobroadcast');

module.exports = {
  name: 'autobroadcast',
  category: 'owner',
  aliases: ['ab', 'autobc'],
  async execute(sock, msg, args, ctx) {
    const { config, from, isSenderOwner } = ctx;
    const p = config.prefix;
    const reply = (text) => sock.sendMessage(from, { text }, { quoted: msg });

    let isOwner = false;
    try { isOwner = isSenderOwner && isSenderOwner(); } catch {}
    if (!isOwner) return reply('❌ *AKSES DITOLAK*\n\nHanya owner yang bisa akses.');

    const sub = (args[0] || '').toLowerCase();
    const ab = loadAB();

    // ===== STATUS =====
    if (!sub || sub === 'status') {
      const time = getTimeInTimezone(ab.timezone);
      const sched = getSchedule();
      let schedTxt = '';
      sched.forEach(s => {
        schedTxt += `  ${s.isNow ? '▶️' : '  '} ${s.done ? '✅' : '⏳'} ${s.nama.padEnd(7)} — ${String(s.jam).padStart(2, '0')}:00\n`;
      });

      let targetTxt;
      if (ab.allGroups) targetTxt = '  🌐 Semua grup yang diikuti bot';
      else if (ab.targets.length) targetTxt = ab.targets.map((t, i) => `  ${i + 1}. ${t}`).join('\n');
      else targetTxt = `  ⚠️ BELUM ADA TARGET!\n  Ketik *${p}ab add* di grup tujuan\n  atau *${p}ab addall* untuk semua grup`;

      return reply(
        `╔══════════════════════════════════╗\n║     📢  *AUTO BROADCAST*          ║\n╚══════════════════════════════════╝\n\n` +
        `  ◆  Status   : *${ab.enabled ? '✅ AKTIF' : '❌ NONAKTIF'}*\n` +
        `  ◆  Timezone : *${ab.timezone}*\n` +
        `  ◆  Waktu    : *${time.fullTime}* (${time.fullDate})\n` +
        `  ◆  Target   : *${ab.allGroups ? 'SEMUA GRUP' : ab.targets.length}*\n\n` +
        `╭──────────────────────────────────╮\n│  ⏰  *JADWAL BROADCAST*           │\n╰──────────────────────────────────╯\n\n${schedTxt}\n` +
        `╭──────────────────────────────────╮\n│  🎯  *TARGET*                     │\n╰──────────────────────────────────╯\n\n${targetTxt}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📌 *Perintah:*\n` +
        `  ${p}ab on / off        → Aktif/nonaktif\n` +
        `  ${p}ab add             → Tambah chat ini\n` +
        `  ${p}ab del             → Hapus chat ini\n` +
        `  ${p}ab addall          → Tambah semua grup bot\n` +
        `  ${p}ab all on / off    → Mode semua grup\n` +
        `  ${p}ab clear           → Kosongkan target\n` +
        `  ${p}ab list            → Daftar target\n` +
        `  ${p}ab test            → Kirim tes\n` +
        `  ${p}ab send <periode>  → Kirim pesan sekarang\n` +
        `  ${p}ab timezone <tz>   → Ganti timezone\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n  ⚡  _${config.botName}_`
      );
    }

    // ===== ON / OFF =====
    if (sub === 'on' || sub === 'off') {
      ab.enabled = sub === 'on';
      saveAB(ab);
      return reply(`${ab.enabled ? '✅' : '❌'} *Auto Broadcast ${ab.enabled ? 'DIAKTIFKAN' : 'DIMATIKAN'}*`);
    }

    // ===== ADD TARGET =====
    if (sub === 'add') {
      const target = args[1] && args[1].includes('@') ? args[1] : from;
      if (ab.targets.includes(target)) return reply('⚠️ Chat ini sudah ada di daftar target.');
      ab.targets.push(target);
      saveAB(ab);
      return reply(`✅ *Target ditambahkan!*\n\n📍 ${target}\n📊 Total target: *${ab.targets.length}*`);
    }

    // ===== DEL TARGET =====
    if (sub === 'del' || sub === 'remove') {
      const target = args[1] && args[1].includes('@') ? args[1] : from;
      const idx = ab.targets.indexOf(target);
      if (idx === -1) return reply('⚠️ Chat ini tidak ada di daftar target.');
      ab.targets.splice(idx, 1);
      saveAB(ab);
      return reply(`✅ *Target dihapus!*\n\n📊 Sisa target: *${ab.targets.length}*`);
    }

    // ===== ADD ALL GROUPS =====
    if (sub === 'addall') {
      let groups;
      try {
        groups = Object.keys(await sock.groupFetchAllParticipating());
      } catch (e) {
        return reply(`❌ Gagal mengambil daftar grup: ${e.message}`);
      }
      let added = 0;
      for (const g of groups) {
        if (!ab.targets.includes(g)) { ab.targets.push(g); added++; }
      }
      saveAB(ab);
      return reply(`✅ *${added}* grup ditambahkan.\n📊 Total target: *${ab.targets.length}*`);
    }

    // ===== MODE SEMUA GRUP =====
    if (sub === 'all') {
      const v = (args[1] || '').toLowerCase();
      if (v !== 'on' && v !== 'off') return reply(`Format: ${p}ab all on / off`);
      ab.allGroups = v === 'on';
      saveAB(ab);
      return reply(`${ab.allGroups ? '🌐' : '🎯'} Mode semua grup: *${ab.allGroups ? 'ON' : 'OFF'}*`);
    }

    // ===== CLEAR =====
    if (sub === 'clear') {
      ab.targets = [];
      saveAB(ab);
      return reply('🗑️ Semua target dikosongkan.');
    }

    // ===== LIST =====
    if (sub === 'list') {
      const targets = await resolveTargets(sock, ab);
      if (!targets.length) return reply('📭 Belum ada target.');
      const lines = [];
      for (const [i, t] of targets.entries()) {
        let name = '';
        try { if (t.endsWith('@g.us')) name = (await sock.groupMetadata(t)).subject; } catch {}
        lines.push(`${i + 1}. ${name ? name + '\n    ' : ''}${t}`);
      }
      return reply(`🎯 *TARGET (${targets.length})*\n\n${lines.join('\n')}`);
    }

    // ===== TEST =====
    if (sub === 'test') {
      const targets = await resolveTargets(sock, ab);
      if (!targets.length) return reply(`❌ Belum ada target. Tambah dulu dengan *${p}ab add*`);
      await sock.sendMessage(from, { text: `🧪 Mengirim tes ke *${targets.length}* target...` });
      let ok = 0;
      for (const t of targets) {
        try {
          await sock.sendMessage(t, { text: `🧪 *TES AUTO BROADCAST*\n\nJika kamu menerima pesan ini, berarti bot aktif & target benar.\n\n_${config.botName}_` });
          ok++;
        } catch {}
        await new Promise(r => setTimeout(r, 1500));
      }
      return sock.sendMessage(from, { text: `✅ Tes selesai: *${ok}/${targets.length}* berhasil.` });
    }

    // ===== SEND SEKARANG =====
    if (sub === 'send') {
      const nama = (args[1] || '').toLowerCase();
      const pilihan = Object.keys(config.waktuPesan || {}).join(' / ');
      if (!nama) return reply(`Format: ${p}ab send <periode>\nPilihan: ${pilihan}`);
      await sock.sendMessage(from, { text: `📤 Mengirim pesan *${nama}* sekarang...` });
      try {
        const r = await broadcastNow(sock, nama);
        return sock.sendMessage(from, { text: `✅ Selesai: *${r.ok}/${r.total}* berhasil.` });
      } catch (e) {
        return reply(`❌ ${e.message}`);
      }
    }

    // ===== TIMEZONE =====
    if (sub === 'timezone' || sub === 'tz') {
      const tz = args[1];
      if (!tz) return reply(`Format: ${p}ab timezone Asia/Jakarta`);
      try {
        new Intl.DateTimeFormat('id-ID', { timeZone: tz });
      } catch {
        return reply(`❌ Timezone *${tz}* tidak valid.`);
      }
      ab.timezone = tz;
      saveAB(ab);
      return reply(`✅ Timezone diubah ke *${tz}*`);
    }

    return reply(`❌ Sub-perintah tidak dikenal.\n\nKetik *${p}ab* untuk bantuan.`);
  },
};
