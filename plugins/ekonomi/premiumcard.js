const sharp = require('sharp');

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[character]);
}

function makeCard({ name, number, money, level, exp, nextExp, percent, limit, point, days }) {
  const progressWidth = Math.round(430 * Math.max(0, Math.min(100, percent)) / 100);
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
    <defs>
      <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#101b19"/><stop offset="1" stop-color="#172824"/></linearGradient>
      <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#c4a66a"/><stop offset="1" stop-color="#f0d79c"/></linearGradient>
    </defs>
    <rect width="1200" height="675" rx="34" fill="url(#background)"/>
    <path d="M820 0h380v300c-170-20-280-110-380-300Z" fill="#203832" opacity=".72"/>
    <circle cx="1050" cy="80" r="220" fill="none" stroke="#d6bd82" stroke-opacity=".16" stroke-width="2"/>
    <circle cx="1050" cy="80" r="168" fill="none" stroke="#d6bd82" stroke-opacity=".12" stroke-width="2"/>
    <rect x="54" y="54" width="1092" height="567" rx="24" fill="none" stroke="#d6bd82" stroke-opacity=".3"/>
    <text x="92" y="119" fill="#f0d79c" font-family="sans-serif" font-size="22" font-weight="700" letter-spacing="3">YORA BOTZ</text>
    <text x="92" y="157" fill="#9cb2a8" font-family="sans-serif" font-size="16" letter-spacing="2">MEMBER PROFILE</text>
    <rect x="92" y="205" width="116" height="116" rx="58" fill="#304b41" stroke="#d6bd82" stroke-width="2"/>
    <text x="150" y="278" text-anchor="middle" fill="#f0d79c" font-family="sans-serif" font-size="40" font-weight="700">${escapeXml(initials || 'Y')}</text>
    <text x="238" y="251" fill="#ffffff" font-family="sans-serif" font-size="39" font-weight="700">${escapeXml(name)}</text>
    <text x="240" y="291" fill="#9cb2a8" font-family="sans-serif" font-size="19">+${escapeXml(number)}</text>
    <rect x="914" y="210" width="196" height="48" rx="24" fill="#d6bd82"/>
    <text x="1012" y="241" text-anchor="middle" fill="#17231f" font-family="sans-serif" font-size="18" font-weight="700">PREMIUM · ${days} HARI</text>
    <line x1="92" y1="365" x2="1108" y2="365" stroke="#ffffff" stroke-opacity=".13"/>
    <text x="92" y="414" fill="#9cb2a8" font-family="sans-serif" font-size="15" letter-spacing="1.5">LEVEL PROGRESS</text>
    <text x="92" y="463" fill="#ffffff" font-family="sans-serif" font-size="34" font-weight="700">LEVEL ${level}</text>
    <text x="522" y="461" text-anchor="end" fill="#f0d79c" font-family="sans-serif" font-size="20" font-weight="700">${percent}%</text>
    <rect x="92" y="483" width="430" height="12" rx="6" fill="#33443e"/>
    <rect x="92" y="483" width="${progressWidth}" height="12" rx="6" fill="url(#accent)"/>
    <text x="92" y="529" fill="#9cb2a8" font-family="sans-serif" font-size="17">${exp.toLocaleString('id-ID')} / ${nextExp.toLocaleString('id-ID')} EXP</text>
    <text x="620" y="414" fill="#9cb2a8" font-family="sans-serif" font-size="15" letter-spacing="1.5">WALLET</text>
    <text x="620" y="461" fill="#ffffff" font-family="sans-serif" font-size="32" font-weight="700">${escapeXml(money)}</text>
    <text x="620" y="520" fill="#9cb2a8" font-family="sans-serif" font-size="17">${limit} LIMIT     ·     ${point} POINT</text>
    <text x="92" y="582" fill="#71877d" font-family="sans-serif" font-size="15">YORA BOTZ  /  PREMIUM MEMBER</text>
    <text x="1108" y="582" text-anchor="end" fill="#71877d" font-family="sans-serif" font-size="15">PROFILE CARD</text>
  </svg>`;
}

module.exports = {
  name: 'premiumcard',
  category: 'ekonomi',
  aliases: ['profilecard', 'vipcard'],
  async execute(sock, msg, args, ctx) {
    const { config, from, senderNumber, pushName, user, getExpProgress, formatMoney, premiumRemainingDays } = ctx;
    const info = getExpProgress(user.exp || 0);
    const name = user.name || pushName || 'User';
    const percent = Math.max(0, Math.min(100, info.percent));
    const values = {
      name,
      number: senderNumber,
      money: formatMoney(user.money || 0),
      level: info.level,
      exp: user.exp || 0,
      nextExp: info.nextLevelExp,
      percent,
      limit: user.limit || 0,
      point: user.point || 0,
      days: ctx.isPremium() ? premiumRemainingDays() : 0,
    };
    let image;
    try {
      image = await sharp(Buffer.from(makeCard(values))).png().toBuffer();
    } catch (error) {
      console.error('Premium profile card render failed:', error.message);
      return sock.sendMessage(from, {
        text: `✨ *PREMIUM PROFILE*\n\n👤 ${name}\n💎 Premium aktif · ${values.days} hari\n📊 Level ${info.level} · ${percent}% menuju level berikutnya\n💰 Uang: ${values.money}\n🎫 Limit: ${values.limit} · ⭐ Point: ${values.point}`,
      }, { quoted: msg });
    }

    const caption = `✨ *YORA PREMIUM PROFILE*\n👤 ${name}\n💎 Premium aktif · ${values.days} hari\n📊 Level ${info.level} · ${percent}% menuju level berikutnya\n💰 ${values.money} · 🎫 ${values.limit} limit`;
    await sock.sendMessage(from, { image, caption, mimetype: 'image/png' }, { quoted: msg });
  },
};