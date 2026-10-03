const stats = new Map();

function record(command, durationMs, succeeded) {
  const name = String(command || '').toLowerCase();
  if (!name) return;

  const current = stats.get(name) || {
    count: 0,
    errors: 0,
    totalDurationMs: 0,
    maxDurationMs: 0,
  };
  const duration = Math.max(0, Number(durationMs) || 0);

  current.count++;
  if (!succeeded) current.errors++;
  current.totalDurationMs += duration;
  current.maxDurationMs = Math.max(current.maxDurationMs, duration);
  stats.set(name, current);
}

function recordPlugin(plugin, durationMs, succeeded) {
  if (!plugin || plugin.category === 'download' || plugin.name === 'perf') return;
  record(plugin.name, durationMs, succeeded);
}

function getStats() {
  return [...stats.entries()]
    .map(([command, current]) => ({
      command,
      count: current.count,
      errors: current.errors,
      averageDurationMs: current.totalDurationMs / current.count,
      maxDurationMs: current.maxDurationMs,
    }))
    .sort((a, b) => b.averageDurationMs - a.averageDurationMs);
}

function reset() {
  stats.clear();
}

module.exports = { record, recordPlugin, getStats, reset };