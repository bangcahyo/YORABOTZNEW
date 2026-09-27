const fs = require('fs');

async function sendVoiceNote(sock, from, voicePath, voiceUrl, quotedMsg) {
  try {
    let audioSource = null;
    if (voiceUrl && voiceUrl.startsWith('http')) audioSource = { url: voiceUrl };
    else if (voicePath && fs.existsSync(voicePath)) audioSource = fs.readFileSync(voicePath);
    if (!audioSource) return false;
    await sock.sendMessage(from, {
      audio: audioSource,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true,
    }, quotedMsg ? { quoted: quotedMsg } : {});
    return true;
  } catch { return false; }
}

async function sendImageCaption(sock, from, imagePath, imageUrl, caption, quotedMsg) {
  try {
    if (imageUrl && imageUrl.startsWith('http')) {
      await sock.sendMessage(from, { image: { url: imageUrl }, caption }, quotedMsg ? { quoted: quotedMsg } : {});
      return true;
    } else if (imagePath && fs.existsSync(imagePath)) {
      await sock.sendMessage(from, { image: fs.readFileSync(imagePath), caption }, quotedMsg ? { quoted: quotedMsg } : {});
      return true;
    }
    return false;
  } catch { return false; }
}

module.exports = { sendVoiceNote, sendImageCaption };