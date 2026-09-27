module.exports = {
  name: 'level', category: 'level', aliases: ['lvl'],
  async execute(sock, msg, args, ctx) {
    const { from, pushName, user, getExpProgress } = ctx;
    const exp = user.exp || 0;
    const info = getExpProgress(exp);
    const total = 10;
    const filled = Math.floor((info.percent / 100) * total);
    const progressBar = '█'.repeat(filled) + '░'.repeat(total - filled);
    await sock.sendMessage(from, { text: `📊 *LEVEL KAMU*\n\n📛 Nama: ${pushName}\n🎖️ Level: ${info.level}\n✨ EXP: ${exp}\n\n📈 Progress ke Lv.${info.level + 1}:\n${progressBar} ${info.percent}%\n\n${info.progressExp} / ${info.neededExp} EXP` }, { quoted: msg });
  }
};