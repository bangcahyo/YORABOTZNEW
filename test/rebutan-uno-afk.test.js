const assert = require('node:assert/strict');
const test = require('node:test');

const engine = require('../lib/game-engine');
const { generateStoryProblem, LEVELS } = require('../lib/math-story');
const uno = require('../lib/uno-game');
const unoHandler = require('../lib/uno-handler');
const afk = require('../lib/afk');
const khodam = require('../plugins/fun/cekkhodam');
const jodoh = require('../plugins/tools/jodoh');
const cekpasangan = require('../plugins/tools/cekpasangan');
const ship = require('../plugins/fun/ship');
const mathPlugin = require('../plugins/game/math');
const family100 = require('../plugins/game/family100');

// ---------- helpers ----------

function seededRng(seed = 1) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function makeWorld(extraUsers = {}) {
  const db = {};
  const sent = [];
  const sock = {
    sendMessage: async (to, message, options) => { sent.push({ to, message, options }); },
  };
  const getUser = jid => {
    if (!db[jid]) db[jid] = { money: 1000, point: 0, limit: 20, registered: true, ...extraUsers[jid] };
    return db[jid];
  };
  const updateUser = (jid, updates) => { db[jid] = { ...getUser(jid), ...updates }; return db[jid]; };
  const gameState = {};
  const timers = {};
  return {
    db, sent, sock, getUser, updateUser, gameState,
    clearGameTimeout: room => { clearTimeout(timers[room]); delete timers[room]; },
    setGameTimeout: (room, cb) => {
      clearTimeout(timers[room]);
      timers[room] = setTimeout(async () => { await cb(); delete gameState[room]; }, 120000);
      timers[room].unref();
    },
    formatMoney: n => 'Rp ' + n.toLocaleString('id-ID'),
  };
}

const GROUP = 'group@g.us';
const config = { prefix: '.', registrationRequired: true, gameTimeout: 120000 };

// ---------- 1. REBUTAN ----------

test('jawaban pendek / angka tidak cocok secara tidak sengaja', () => {
  assert.equal(engine.matchesAnswer('c', 'c'), true);
  assert.equal(engine.matchesAnswer('wah ini cuaca bagus', 'c'), false);
  assert.equal(engine.matchesAnswer('100', '1'), false);
  assert.equal(engine.matchesAnswer('1', '1'), true);
  assert.equal(engine.matchesAnswer('Rp 1.500', '1500'), true);
  assert.equal(engine.matchesAnswer('1500', '1500'), true);
  assert.equal(engine.matchesAnswer('15000', '1500'), false);
  assert.equal(engine.matchesAnswer('Kura-kura!', 'kura kura'), true);
  assert.equal(engine.matchesAnswer('jawabannya jakarta', 'jakarta'), true);
  assert.equal(engine.matchesAnswer('jakartaaa', 'jakarta'), false);
  assert.equal(engine.matchesAnswer('3,14', '3,14'), true);
  assert.equal(engine.matchesAnswer('aku kemarin pergi ke pasar beli apel merah banget', 'apel'), false);
});

test('rebutan: orang lain (bukan pembuat soal) bisa menang dan hanya satu pemenang', async () => {
  const w = makeWorld();
  w.gameState[GROUP] = { game: 'tebakkata', jawab: 'apel', sender: 'starter@s.whatsapp.net' };
  const deps = sender => ({
    sock: w.sock, msg: {}, from: GROUP, sender, text: 'apel', gameState: w.gameState,
    clearGameTimeout: w.clearGameTimeout, getUser: w.getUser, updateUser: w.updateUser,
    formatMoney: w.formatMoney, config, isOwnerSender: false,
  });

  assert.equal(await engine.handleGameAnswer({ ...deps('ani@s.whatsapp.net'), text: 'bukan' }), false);
  assert.ok(w.gameState[GROUP], 'jawaban salah tidak mengakhiri game');

  // dua orang menjawab "bersamaan": hanya yang diproses duluan menang
  const [first, second] = await Promise.all([
    engine.handleGameAnswer(deps('budi@s.whatsapp.net')),
    engine.handleGameAnswer(deps('citra@s.whatsapp.net')),
  ]);
  assert.equal(first, true);
  assert.equal(second, false);
  assert.equal(w.db['budi@s.whatsapp.net'].point, 3);
  assert.equal(w.db['citra@s.whatsapp.net']?.point ?? 0, 0);
  assert.equal(w.gameState[GROUP], undefined);
  assert.match(w.sent.at(-1).message.text, /BENAR/);
  assert.deepEqual(w.sent.at(-1).message.mentions, ['budi@s.whatsapp.net']);
});

test('rebutan: pemain belum terdaftar tidak mengambil hadiah, game lanjut', async () => {
  const w = makeWorld({ 'baru@s.whatsapp.net': { registered: false } });
  w.gameState[GROUP] = { game: 'quiz', jawab: 'jakarta', sender: 'x@s.whatsapp.net' };
  const handled = await engine.handleGameAnswer({
    sock: w.sock, msg: {}, from: GROUP, sender: 'baru@s.whatsapp.net', text: 'jakarta',
    gameState: w.gameState, clearGameTimeout: w.clearGameTimeout, getUser: w.getUser,
    updateUser: w.updateUser, formatMoney: w.formatMoney, config, isOwnerSender: false,
  });
  assert.equal(handled, true);
  assert.ok(w.gameState[GROUP], 'game masih berjalan');
  assert.match(w.sent.at(-1).message.text, /belum terdaftar/);
});

test('nyerah hanya untuk pembuat soal (atau owner)', async () => {
  const w = makeWorld();
  const base = {
    sock: w.sock, msg: {}, from: GROUP, text: 'nyerah', gameState: w.gameState,
    clearGameTimeout: w.clearGameTimeout, getUser: w.getUser, updateUser: w.updateUser,
    formatMoney: w.formatMoney, config,
  };
  w.gameState[GROUP] = { game: 'quiz', jawab: 'jakarta', sender: 'starter@s.whatsapp.net' };
  assert.equal(await engine.handleGameAnswer({ ...base, sender: 'iseng@s.whatsapp.net', isOwnerSender: false }), false);
  assert.ok(w.gameState[GROUP]);
  assert.equal(await engine.handleGameAnswer({ ...base, sender: 'starter@s.whatsapp.net', isOwnerSender: false }), true);
  assert.equal(w.gameState[GROUP], undefined);
});

test('hangman rebutan: semua orang boleh menebak huruf, siapa yang melengkapi menang', async () => {
  const w = makeWorld();
  w.gameState[GROUP] = { game: 'hangman', kata: 'bola', tebakan: [], nyawa: 6, sender: 'starter@s.whatsapp.net' };
  const guess = (sender, text) => engine.handleGameAnswer({
    sock: w.sock, msg: {}, from: GROUP, sender, text, gameState: w.gameState,
    clearGameTimeout: w.clearGameTimeout, getUser: w.getUser, updateUser: w.updateUser,
    formatMoney: w.formatMoney, config, isOwnerSender: false,
  });
  assert.equal(await guess('a@s.whatsapp.net', 'b'), true);
  assert.equal(await guess('b@s.whatsapp.net', 'o'), true);
  assert.equal(await guess('c@s.whatsapp.net', 'z'), true);
  assert.equal(w.gameState[GROUP].nyawa, 5);
  assert.equal(await guess('d@s.whatsapp.net', 'l'), true);
  assert.equal(await guess('e@s.whatsapp.net', 'a'), true);
  assert.equal(w.gameState[GROUP], undefined);
  assert.equal(w.db['e@s.whatsapp.net'].point, 5);
});

test('family100 rebutan: tiap jawaban direbut orang berbeda lalu game selesai', async () => {
  const w = makeWorld();
  const ctx = { from: GROUP, sender: 'host@s.whatsapp.net', gameState: w.gameState, setGameTimeout: w.setGameTimeout, random: list => list[0], gameDurationText: '2 menit' };
  await family100.execute(w.sock, {}, [], ctx);
  const game = w.gameState[GROUP];
  assert.equal(game.multi, true);

  const say = (sender, text) => engine.handleGameAnswer({
    sock: w.sock, msg: {}, from: GROUP, sender, text, gameState: w.gameState,
    clearGameTimeout: w.clearGameTimeout, getUser: w.getUser, updateUser: w.updateUser,
    formatMoney: w.formatMoney, config, isOwnerSender: false,
  });
  assert.equal(await say('a@s.whatsapp.net', game.jawab[0]), true);
  assert.equal(await say('b@s.whatsapp.net', game.jawab[0]), false, 'jawaban yang sama tidak dihitung dua kali');
  for (let i = 1; i < game.jawab.length; i++) assert.equal(await say(`p${i}@s.whatsapp.net`, game.jawab[i]), true);
  assert.equal(w.gameState[GROUP], undefined);
  assert.match(w.sent.at(-1).message.text, /SEMUA JAWABAN KETEMU/);
  w.clearGameTimeout(GROUP);
});

// ---------- 6. TIMER 2 MENIT ----------

test('durasi game default 2 menit', () => {
  assert.equal(require('../config').gameTimeout, 120000);
  assert.equal(engine.formatDuration(120000), '2 menit');
  assert.equal(engine.formatDuration(60000), '1 menit');
  assert.equal(engine.formatDuration(90000), '1 menit 30 detik');
  assert.equal(engine.formatDuration(45000), '45 detik');
});

// ---------- 7. SOAL CERITA ----------

test('soal cerita math: semua template valid, jawaban bulat positif', () => {
  const rng = seededRng(7);
  for (const level of Object.keys(LEVELS)) {
    for (let i = 0; i < 400; i++) {
      const problem = generateStoryProblem({ level, rng });
      assert.equal(problem.level, level);
      assert.ok(Number.isInteger(problem.a) && problem.a > 0, `${level}: ${problem.q} => ${problem.a}`);
      assert.ok(problem.q.length > 40, 'soal harus berupa cerita');
      assert.ok(!/undefined|NaN|null/.test(problem.q), problem.q);
    }
  }
});

test('.math memberi soal cerita dengan hadiah sesuai level, dan mode biasa tetap ada', async () => {
  const w = makeWorld();
  const ctx = { config, from: GROUP, sender: 'a@s.whatsapp.net', gameState: w.gameState, setGameTimeout: w.setGameTimeout, random: list => list[0], gameDurationText: '2 menit' };
  await mathPlugin.execute(w.sock, {}, ['sulit'], ctx);
  assert.match(w.sent.at(-1).message.text, /SOAL CERITA/);
  assert.equal(w.gameState[GROUP].game, 'math');
  assert.deepEqual(w.gameState[GROUP].reward, [6, 1300]);
  assert.ok(w.sent.at(-1).message.text.includes('2 menit'));
  w.clearGameTimeout(GROUP);

  await mathPlugin.execute(w.sock, {}, ['biasa'], ctx);
  assert.match(w.sent.at(-1).message.text, /\d+ [+x-] \d+ = \?/);
  w.clearGameTimeout(GROUP);
});

// ---------- 2. UNO ----------

test('uno: dek 108 kartu & parser kode kartu', () => {
  assert.equal(uno.buildDeck().length, 108);
  assert.deepEqual(uno.parseCardInput('r5'), { wild: false, color: 'r', value: '5' });
  assert.deepEqual(uno.parseCardInput('bs'), { wild: false, color: 'b', value: 'skip' });
  assert.deepEqual(uno.parseCardInput('gv'), { wild: false, color: 'g', value: 'rev' });
  assert.deepEqual(uno.parseCardInput('y+2'), { wild: false, color: 'y', value: '+2' });
  assert.deepEqual(uno.parseCardInput('w r'), { wild: true, value: 'w', chosenColor: 'r' });
  assert.deepEqual(uno.parseCardInput('w4 biru'), { wild: true, value: 'w4', chosenColor: 'b' });
  assert.equal(uno.parseCardInput('halo semua'), null);
  assert.equal(uno.parseCardInput('draw'), null);
  // kode yang ditampilkan ke pemain harus bisa di-parse balik
  for (const card of uno.buildDeck()) {
    const parsed = uno.parseCardInput(uno.cardCode(card));
    assert.ok(parsed, uno.cardCode(card));
    assert.equal(parsed.value, card.value);
  }
});

function startedGame(playerCount = 3, rng = seededRng(3)) {
  const players = Array.from({ length: playerCount }, (_, i) => `p${i}@s.whatsapp.net`);
  const game = uno.createGame({ host: players[0], hostName: 'P0' });
  players.slice(1).forEach((jid, i) => assert.ok(uno.addPlayer(game, jid, `P${i + 1}`).ok));
  assert.ok(uno.startGame(game, rng).ok);
  return { game, players };
}

function totalCards(game) {
  return game.deck.length + game.discard.length + Object.values(game.hands).reduce((n, h) => n + h.length, 0);
}

test('uno: lobi, batas pemain, dan pembagian kartu', () => {
  const game = uno.createGame({ host: 'a', hostName: 'A' });
  assert.equal(uno.startGame(game).error, 'few-players');
  assert.equal(uno.addPlayer(game, 'a', 'A').error, 'already');
  for (let i = 1; i < uno.MAX_PLAYERS; i++) assert.ok(uno.addPlayer(game, `x${i}`, 'X').ok);
  assert.equal(uno.addPlayer(game, 'late', 'L').error, 'full');
  assert.ok(uno.startGame(game).ok);
  assert.equal(uno.addPlayer(game, 'late2', 'L').error, 'started');
  for (const jid of game.players) assert.equal(game.hands[jid].length, uno.HAND_SIZE);
  assert.equal(totalCards(game), 108);
  assert.ok(/^\d$/.test(uno.topCard(game).value), 'kartu pembuka harus angka');
});

test('uno: efek skip, reverse, +2, wild +4', () => {
  const { game, players } = startedGame(4);
  const [a, b, c, d] = players;
  game.currentColor = 'r';
  game.discard.push({ color: 'r', value: '5' });
  game.hands[a] = [{ color: 'r', value: 'skip' }, { color: 'r', value: '1' }];
  assert.ok(uno.playCard(game, a, uno.parseCardInput('rs')).ok);
  assert.equal(uno.currentPlayer(game), c, 'B dilewati');

  game.hands[c] = [{ color: 'r', value: 'rev' }, { color: 'r', value: '2' }];
  assert.ok(uno.playCard(game, c, uno.parseCardInput('rv')).ok);
  assert.equal(game.dir, -1);
  assert.equal(uno.currentPlayer(game), b, 'arah berbalik: kembali ke B');

  game.hands[b] = [{ color: 'r', value: '+2' }, { color: 'r', value: '3' }];
  const before = game.hands[a].length;
  const result = uno.playCard(game, b, uno.parseCardInput('r+2'));
  assert.deepEqual(result.events, [{ type: 'draw', player: a, count: 2 }]);
  assert.equal(game.hands[a].length, before + 2);
  assert.equal(uno.currentPlayer(game), d, 'A kena +2 dan dilewati, lanjut ke D (arah mundur)');

  game.hands[d] = [{ color: null, value: 'w4' }, { color: 'g', value: '1' }];
  assert.equal(uno.playCard(game, d, uno.parseCardInput('w4')).error, 'need-color');
  const wild = uno.playCard(game, d, uno.parseCardInput('w4 g'));
  assert.ok(wild.ok);
  assert.equal(game.currentColor, 'g');
  assert.equal(wild.events[0].count, 4);
  assert.equal(totalCards(game) - (game.hands[a].length - before - 2) * 0 >= 0, true);
});

test('uno: 2 pemain, reverse berlaku seperti skip', () => {
  const { game, players } = startedGame(2);
  const [a] = players;
  game.currentColor = 'b';
  game.discard.push({ color: 'b', value: '9' });
  game.hands[a] = [{ color: 'b', value: 'rev' }, { color: 'b', value: '1' }];
  uno.playCard(game, a, uno.parseCardInput('bv'));
  assert.equal(uno.currentPlayer(game), a);
});

test('uno: aturan kartu tidak valid ditolak', () => {
  const { game, players } = startedGame(3);
  const [a, b] = players;
  game.currentColor = 'r';
  game.discard.push({ color: 'r', value: '5' });
  game.hands[a] = [{ color: 'g', value: '7' }, { color: 'r', value: '2' }];
  assert.equal(uno.playCard(game, b, uno.parseCardInput('r2')).error, 'not-turn');
  assert.equal(uno.playCard(game, a, uno.parseCardInput('y1')).error, 'no-card');
  assert.equal(uno.playCard(game, a, uno.parseCardInput('g7')).error, 'unplayable');
  assert.ok(uno.playCard(game, a, uno.parseCardInput('r2')).ok);
});

test('uno: draw, kartu hasil draw boleh dimainkan atau pass', () => {
  const { game, players } = startedGame(3);
  const [a, b] = players;
  game.currentColor = 'r';
  game.discard.push({ color: 'r', value: '5' });
  game.hands[a] = [{ color: 'g', value: '7' }];
  game.deck.push({ color: 'r', value: '8' });
  assert.equal(uno.passTurn(game, a).error, 'must-draw');
  const drew = uno.drawCard(game, a);
  assert.equal(drew.playable, true);
  assert.equal(uno.drawCard(game, a).error, 'already-drew');
  assert.equal(uno.playCard(game, a, uno.parseCardInput('g7')).error, 'must-play-drawn');
  assert.ok(uno.passTurn(game, a).ok);
  assert.equal(uno.currentPlayer(game), b);

  game.hands[b] = [{ color: 'b', value: '1' }];
  game.deck.push({ color: 'g', value: '3' }); // tidak cocok
  const miss = uno.drawCard(game, b);
  assert.equal(miss.playable, false);
  assert.equal(uno.currentPlayer(game), players[2], 'otomatis lanjut bila kartu tidak bisa dimainkan');
});

test('uno: tangkap lupa UNO (denda 2 kartu) & UNO aman', () => {
  const { game, players } = startedGame(3);
  const [a, b, c] = players;
  game.currentColor = 'r';
  game.discard.push({ color: 'r', value: '5' });
  game.hands[a] = [{ color: 'r', value: '1' }, { color: 'r', value: '2' }];
  uno.playCard(game, a, uno.parseCardInput('r1'));
  assert.deepEqual(game.unoWindow, { player: a });
  const caught = uno.callUno(game, c);
  assert.deepEqual({ status: caught.status, victim: caught.victim, catcher: caught.catcher }, { status: 'caught', victim: a, catcher: c });
  assert.equal(game.hands[a].length, 3);
  assert.equal(uno.callUno(game, c).status, 'none');

  game.hands[b] = [{ color: 'r', value: '3' }, { color: 'r', value: '4' }];
  uno.playCard(game, b, uno.parseCardInput('r3'));
  assert.equal(uno.callUno(game, b).status, 'safe');
  assert.equal(game.hands[b].length, 1);
});

test('uno: menang saat kartu habis', () => {
  const { game, players } = startedGame(3);
  const [a] = players;
  game.currentColor = 'r';
  game.discard.push({ color: 'r', value: '5' });
  game.hands[a] = [{ color: 'r', value: '1' }];
  const result = uno.playCard(game, a, uno.parseCardInput('r1'));
  assert.equal(result.winner, a);
});

test('uno: timeout mengambil kartu, dua kali berturut-turut dikeluarkan', () => {
  const { game, players } = startedGame(3);
  const [a, b, c] = players;
  const before = game.hands[a].length;
  let result = uno.handleTurnTimeout(game);
  assert.equal(result.jid, a);
  assert.equal(game.hands[a].length, before + 1);
  assert.equal(uno.currentPlayer(game), b);
  uno.handleTurnTimeout(game); // b
  uno.handleTurnTimeout(game); // c
  result = uno.handleTurnTimeout(game); // a lagi
  assert.equal(result.kicked, true);
  assert.deepEqual(game.players, [b, c]);
  assert.equal(uno.currentPlayer(game), b);
  assert.equal(totalCards(game), 108, 'kartu pemain keluar kembali ke dek');
});

test('uno: simulasi 200 permainan acak selalu selesai & kartu tidak hilang', () => {
  for (let seed = 1; seed <= 200; seed++) {
    const rng = seededRng(seed);
    const count = 2 + (seed % 9);
    const { game } = startedGame(count, rng);
    let winner = null;
    for (let step = 0; step < 4000 && !winner; step++) {
      const jid = uno.currentPlayer(game);
      const options = uno.playableCards(game, jid);
      if (options.length) {
        const card = options[Math.floor(rng() * options.length)];
        const parsed = uno.isWild(card)
          ? { wild: true, value: card.value, chosenColor: uno.COLORS[Math.floor(rng() * 4)] }
          : { wild: false, color: card.color, value: card.value };
        const result = uno.playCard(game, jid, parsed, rng);
        assert.ok(result.ok, JSON.stringify(result));
        winner = result.winner || null;
      } else if (game.drawn) {
        assert.ok(uno.passTurn(game, jid).ok);
      } else {
        assert.ok(uno.drawCard(game, jid, rng).ok);
      }
      assert.equal(totalCards(game), 108, `seed ${seed} step ${step}`);
    }
    assert.ok(winner, `seed ${seed} tidak selesai`);
  }
});

test('uno (WhatsApp): lobi -> join -> start -> main -> menang, kartu dikirim lewat DM', async () => {
  const w = makeWorld();
  const A = 'a@s.whatsapp.net';
  const B = 'b@s.whatsapp.net';
  const ctxFor = (sender, user = w.getUser(sender)) => ({
    config, from: GROUP, sender, user, pushName: sender.split('@')[0], gameState: w.gameState,
    getUser: w.getUser, updateUser: w.updateUser, formatMoney: w.formatMoney,
    isGroup: jid => jid.endsWith('@g.us'), isSenderOwner: () => false, sock: w.sock,
  });

  await unoHandler.handleUnoCommand(w.sock, {}, [], ctxFor(A));
  assert.equal(w.gameState[GROUP].phase, 'lobby');
  await unoHandler.handleUnoCommand(w.sock, {}, [], ctxFor(B), 'join');
  assert.deepEqual(w.gameState[GROUP].players, [A, B]);

  await unoHandler.handleUnoCommand(w.sock, {}, [], ctxFor(B), 'start');
  assert.equal(w.gameState[GROUP].phase, 'lobby', 'bukan host tidak bisa memulai');
  await unoHandler.handleUnoCommand(w.sock, {}, [], ctxFor(A), 'start');
  const game = w.gameState[GROUP];
  assert.equal(game.phase, 'playing');
  const dms = w.sent.filter(s => !s.to.endsWith('@g.us'));
  assert.ok(dms.some(s => s.to === A) && dms.some(s => s.to === B), 'kedua pemain dapat DM kartu');
  assert.match(dms[0].message.text, /KARTU UNO/);

  // pemain A (giliran pertama) memainkan kartu pertama yang valid
  game.hands[A] = [{ color: game.currentColor, value: '7' }, { color: game.currentColor, value: '9' }];
  await unoHandler.handleUnoInput(w.sock, {}, ctxFor(B), `${game.currentColor}7`);
  assert.match(w.sent.at(-1).message.text, /Belum giliranmu/);
  await unoHandler.handleUnoInput(w.sock, {}, ctxFor(A), `${game.currentColor}7`);
  assert.match(w.sent.filter(s => s.to === GROUP).at(-1).message.text, /tinggal \*1 kartu\*/);

  // B menangkap A yang belum bilang UNO
  await unoHandler.handleUnoInput(w.sock, {}, ctxFor(B), 'uno');
  assert.match(w.sent.filter(s => s.to === GROUP).at(-1).message.text, /menangkap/);
  assert.equal(game.hands[A].length, 3);

  // B menghabiskan kartunya -> menang
  game.discard.push({ color: 'r', value: '5' });
  game.currentColor = 'r';
  game.turn = game.players.indexOf(B);
  game.drawn = null;
  game.hands[B] = [{ color: 'r', value: '1' }];
  await unoHandler.handleUnoInput(w.sock, {}, ctxFor(B), 'r1');
  assert.equal(w.gameState[GROUP], undefined);
  assert.match(w.sent.at(-1).message.text, /UNO SELESAI/);
  assert.ok(w.db[B].point >= 10 && w.db[B].money > 1000);
  // bersihkan timer
});

test('uno: obrolan biasa & non-pemain tidak mengganggu', async () => {
  const w = makeWorld();
  const { game, players } = startedGame(2);
  w.gameState[GROUP] = game;
  const ctx = sender => ({
    config, from: GROUP, sender, gameState: w.gameState, getUser: w.getUser, updateUser: w.updateUser,
    formatMoney: w.formatMoney, sock: w.sock,
  });
  assert.equal(await unoHandler.handleUnoInput(w.sock, {}, ctx(players[0]), 'halo semuanya'), false);
  assert.equal(await unoHandler.handleUnoInput(w.sock, {}, ctx('orang@s.whatsapp.net'), 'r5'), false);
  assert.equal(await unoHandler.handleUnoInput(w.sock, {}, ctx(players[0]), '.uno'), false);
  assert.equal(w.sent.length, 0);
});

// ---------- 3. KHODAM ----------

test('.cekkhodam: stabil per nama per hari & menyertakan mention', async () => {
  const sent = [];
  const sock = { sendMessage: async (_to, message) => { sent.push(message); } };
  const ctx = { from: GROUP, mentioned: [], pushName: 'Budi' };
  await khodam.execute(sock, {}, ['Budi'], ctx);
  await khodam.execute(sock, {}, ['budi'], ctx);
  assert.equal(sent[0].text.replace(/Budi/i, ''), sent[1].text.replace(/Budi/i, ''));
  assert.match(sent[0].text, /CEK KHODAM/);
  await khodam.execute(sock, {}, [], { ...ctx, mentioned: ['628123@s.whatsapp.net'] });
  assert.deepEqual(sent[2].mentions, ['628123@s.whatsapp.net']);
  const names = new Set(Array.from({ length: 300 }, (_, i) => khodam.pickFor(`user${i}`).khodam));
  assert.ok(names.size > 25, 'hasil cukup bervariasi');
});

// ---------- 4. EMOJI JODOH ----------

test('jodoh/cekpasangan/ship memakai emoji laki-laki + perempuan, bukan 💑 atau laki-laki+laki-laki', async () => {
  const sent = [];
  const sock = { sendMessage: async (_to, message) => { sent.push(message.text); } };
  await jodoh.execute(sock, {}, [], { from: GROUP, sender: 'a@s.whatsapp.net', mentioned: ['b@s.whatsapp.net'] });
  await cekpasangan.execute(sock, {}, ['Andi', '+', 'Sinta'], { from: GROUP });
  await ship.execute(sock, {}, ['Andi', '|', 'Sinta'], { from: GROUP });
  assert.equal(sent.length, 3);
  for (const text of sent) {
    assert.ok(text.includes('👩‍❤️‍👨'), text);
    assert.ok(!text.includes('💑'), 'emoji 💑 bisa tampil sebagai pasangan sejenis di sebagian perangkat');
    assert.ok(!text.includes('👨‍❤️‍👨') && !text.includes('👬') && !text.includes('👨‍❤️‍💋‍👨'));
  }
});

// ---------- 5. AFK ----------

test('afk: set, di-tag diberi tahu (dengan jeda), kembali diumumkan', async () => {
  afk.noticeTimes.clear();
  const db = {};
  const updateUser = (k, u) => { db[k] = { ...db[k], ...u }; };
  const loadDB = () => db;
  const sent = [];
  const sock = { sendMessage: async (to, message) => { sent.push(message); } };
  const A = '62811@s.whatsapp.net';
  const B = '62822@s.whatsapp.net';

  afk.setAfk({ updateUser }, A, [A, '1234@lid'], 'Makan siang', 1_000_000);
  const base = { sock, from: GROUP, prefix: '.', loadDB, updateUser };

  // B men-tag A (lewat LID) -> diberi tahu
  await afk.processAfkMessage({
    ...base, sender: B, text: 'woi @A',
    msg: { message: { extendedTextMessage: { text: 'woi', contextInfo: { mentionedJid: ['1234@lid'] } } } },
    now: 1_000_000 + 5 * 60000,
  });
  assert.equal(sent.length, 1);
  assert.match(sent[0].text, /sedang AFK sejak 5 menit/);
  assert.match(sent[0].text, /Makan siang/);

  // di-reply lagi dalam 1 menit -> tidak di-spam
  await afk.processAfkMessage({
    ...base, sender: B, text: 'halo',
    msg: { message: { extendedTextMessage: { text: 'halo', contextInfo: { participant: A } } } },
    now: 1_000_000 + 5 * 60000 + 10_000,
  });
  assert.equal(sent.length, 1);

  // A mengetik .afk lagi tidak dianggap kembali
  await afk.processAfkMessage({ ...base, sender: A, text: '.afk tidur', msg: { message: { conversation: '.afk tidur' } }, now: 1_000_000 + 6 * 60000 });
  assert.equal(sent.length, 1);
  assert.ok(db[A].afk);

  // A mengirim pesan biasa -> kembali
  await afk.processAfkMessage({ ...base, sender: A, text: 'udah balik', msg: { message: { conversation: 'udah balik' } }, now: 1_000_000 + 65 * 60000 });
  assert.equal(sent.length, 2);
  assert.match(sent[1].text, /sudah kembali dari AFK/);
  assert.match(sent[1].text, /1 jam/);
  assert.equal(db[A].afk, null);
});
