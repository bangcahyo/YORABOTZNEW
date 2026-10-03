const assert = require('node:assert/strict');
const test = require('node:test');
const ping = require('../plugins/info/ping');
const perf = require('../plugins/info/perf');
const runtime = require('../plugins/info/runtime');
const performanceStats = require('../lib/performance-stats');

test('.ping reports send latency with sub-millisecond precision', async () => {
  let response;
  await ping.execute({
    sendMessage: async (_jid, message) => {
      if (message.text.startsWith('⚡')) response = message.text;
      else await new Promise(resolve => setTimeout(resolve, 10));
    },
  }, {}, [], { from: 'test@g.us' });

  assert.match(response, /Latency: \*\d+\.\d+ms\*/);
});

test('.runtime reports process memory and sampled CPU', async () => {
  let response;
  await runtime.execute({
    sendMessage: async (_jid, message) => { response = message.text; },
  }, {}, [], {
    config: { botName: 'Test Bot', botNumber: '0', ownerName: 'Test Owner' },
    from: 'test@g.us',
  });

  assert.match(response, /RSS\s+: \d+\.\d+ MB/);
  assert.match(response, /Heap\s+: \d+\.\d+ \/ \d+\.\d+ MB/);
  assert.match(response, /CPU\s+: \d+\.\d+% \(1 core, sampel 250 ms\)/);
  assert.match(response, /Event-loop: \d+\.\d+ ms \(estimasi\)/);
});

test('.perf reports slow non-download commands and errors', async () => {
  performanceStats.reset();
  performanceStats.recordPlugin({ name: 'youtube', category: 'download' }, 1200, true);
  performanceStats.recordPlugin({ name: 'sticker', category: 'sticker' }, 120, false);
  performanceStats.recordPlugin({ name: 'sticker', category: 'sticker' }, 80, true);

  let response;
  await perf.execute({
    sendMessage: async (_jid, message) => { response = message.text; },
  }, {}, [], { from: 'test@g.us' });

  assert.ok(response.includes('*sticker*'));
  assert.ok(response.includes('Rata-rata: 100.0 ms'));
  assert.ok(response.includes('Eksekusi: 2 · Error: 1'));
  assert.ok(!response.includes('youtube'));
  performanceStats.reset();
});