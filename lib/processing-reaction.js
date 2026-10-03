const PROCESSING_CATEGORIES = new Set(['download', 'sticker']);
const PROCESSING_COMMANDS = new Set(['ai', 'hd', 'hda', 'hdvideo', 'qr', 'tourl', 'translate']);

function shouldReactToProcessing(plugin) {
  return PROCESSING_CATEGORIES.has(plugin.category) || PROCESSING_COMMANDS.has(plugin.name);
}

async function sendReaction(sock, from, msg, text) {
  if (!msg?.key) return;
  try {
    await sock.sendMessage(from, { react: { text, key: msg.key } });
  } catch (error) {
    console.warn('Processing reaction failed:', error.message);
  }
}

async function executeWithProcessingReaction(sock, from, msg, plugin, execute) {
  if (!shouldReactToProcessing(plugin)) return execute();

  await sendReaction(sock, from, msg, '⏳');
  try {
    const result = await execute();
    await sendReaction(sock, from, msg, '✅');
    return result;
  } catch (error) {
    await sendReaction(sock, from, msg, '❌');
    throw error;
  }
}

module.exports = { executeWithProcessingReaction, shouldReactToProcessing };