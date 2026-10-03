module.exports = {
  name: 'unreg',
  category: 'ekonomi',
  aliases: ['unregister'],
  async execute(sock, msg, args, ctx) {
    const { from, sender, user, updateUser } = ctx;
    if (args.length) {
      return sock.sendMessage(from, {
        text: 'Command ini hanya bisa menghapus pendaftaran akun sendiri. Gunakan `.unreg` tanpa menyebut pengguna lain.',
      }, { quoted: msg });
    }
    if (!user.registered) {
      return sock.sendMessage(from, { text: 'Akun kamu belum terdaftar.' }, { quoted: msg });
    }

    updateUser(sender, {
      registered: false,
      name: null,
      registeredAt: null,
      registrationBonusClaimed: true,
    });
    await sock.sendMessage(from, {
      text: '✅ Pendaftaran akun kamu sudah dihapus. Saldo, poin, limit, dan progres tetap tersimpan. Gunakan `.daftar <nama>` untuk mendaftar kembali.',
    }, { quoted: msg });
  },
};