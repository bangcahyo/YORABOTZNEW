const assert = require('node:assert/strict');
const test = require('node:test');
const { getYoutubeFailureMessage, normalizeYouTubeUrl } = require('../lib/downloader');

test('YouTube links are normalized to a direct video URL', () => {
  const expected = 'https://www.youtube.com/watch?v=BaW_jenozKc';
  assert.equal(normalizeYouTubeUrl('https://youtu.be/BaW_jenozKc?t=20'), expected);
  assert.equal(normalizeYouTubeUrl('https://www.youtube.com/watch?v=BaW_jenozKc&list=PLtest'), expected);
  assert.equal(normalizeYouTubeUrl('https://m.youtube.com/shorts/BaW_jenozKc'), expected);
});

test('YouTube radio playlist links resolve to their included video', () => {
  assert.equal(
    normalizeYouTubeUrl('https://youtube.com/playlist?list=RDCK0m_a-GG18&playnext=1'),
    'https://www.youtube.com/watch?v=CK0m_a-GG18',
  );
});

test('unsupported YouTube playlists receive a clear user-facing error', () => {
  assert.throws(
    () => normalizeYouTubeUrl('https://www.youtube.com/playlist?list=PL1234567890'),
    /Link playlist tidak didukung/,
  );
});

test('YouTube bot checks are reported as access restrictions, not missing API keys', () => {
  const message = getYoutubeFailureMessage([
    'ytdl-core: Sign in to confirm you’re not a bot',
    'yt-dlp: Sign in to confirm you’re not a bot',
  ]);
  assert.match(message, /YouTube menolak akses otomatis/);
  assert.match(message, /API key downloader tidak dapat mengatasi blokir/);
});
