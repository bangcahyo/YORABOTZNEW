const { getFilesystemUsage } = require('./storage-usage');
const { notifyOwner } = require('./owner-notification');

function createStorageMonitor(dependencies = {}) {
  const getUsage = dependencies.getUsage || getFilesystemUsage;
  const sendNotification = dependencies.notifyOwner || notifyOwner;
  const setIntervalFn = dependencies.setInterval || setInterval;
  const clearIntervalFn = dependencies.clearInterval || clearInterval;
  const now = dependencies.now || Date.now;
  let timer = null;
  let currentSock = null;
  let currentConfig = null;
  let lastAlertAt = null;
  let checking = false;

  async function check(sock = currentSock, config = currentConfig) {
    if (!sock || !config || config.storageMonitor?.enabled === false || checking) return false;
    checking = true;
    try {
      const usage = getUsage(process.cwd());
      const totalBytes = Number(usage.totalBytes) || 0;
      const availableBytes = Number(usage.availableBytes) || 0;
      if (totalBytes <= 0) return false;

      const availablePercent = (availableBytes / totalBytes) * 100;
      const thresholdPercent = Number(config.storageMonitor?.thresholdPercent ?? 15);
      if (availablePercent >= thresholdPercent) {
        lastAlertAt = null;
        return false;
      }

      const cooldownMs = Number(config.storageMonitor?.cooldownMs ?? 24 * 60 * 60 * 1000);
      const checkedAt = now();
      if (lastAlertAt !== null && checkedAt - lastAlertAt < cooldownMs) return false;

      const sent = await sendNotification(sock, config,
        `⚠️ *PENYIMPANAN BOT MENIPIS*\n\n` +
        `Ruang tersedia: *${availablePercent.toFixed(1)}%* ` +
        `(${(availableBytes / (1024 ** 3)).toFixed(2)} GB).\n` +
        `Ambang peringatan: *${thresholdPercent}%*.\n\n` +
        `Periksa detail dengan .storage. Session dan database tidak dihapus otomatis.`,
      );
      if (sent) lastAlertAt = checkedAt;
      return Boolean(sent);
    } catch (error) {
      console.error('❌ Storage monitor gagal memeriksa disk:', error.message);
      return false;
    } finally {
      checking = false;
    }
  }

  function start(sock, config) {
    stop();
    currentSock = sock;
    currentConfig = config;
    if (!config.storageMonitor || config.storageMonitor.enabled === false) return;

    const intervalMs = Math.max(60_000, Number(config.storageMonitor.checkIntervalMs) || 30 * 60 * 1000);
    timer = setIntervalFn(() => { void check(); }, intervalMs);
    timer.unref?.();
    void check();
  }

  function stop() {
    if (timer) clearIntervalFn(timer);
    timer = null;
    currentSock = null;
    currentConfig = null;
  }

  return { check, start, stop };
}

const storageMonitor = createStorageMonitor();

module.exports = {
  createStorageMonitor,
  startStorageMonitor: storageMonitor.start,
  stopStorageMonitor: storageMonitor.stop,
  checkStorage: storageMonitor.check,
};