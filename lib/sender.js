const fs = require('fs');

async function sendVoiceNote(sock, from, voicePath, voiceUrl, quotedMsg) {
  try {
    let src = null;
    if (voiceUrl && voiceUrl.startsWith('http')) src = { url: voiceUrl };
    else if (voicePath && fs.existsSync(voicePath)) src = fs.readFileSync(voicePath);
    if (!src) return false;

    await sock.sendMessage(from, {
      audio: src,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true,
    }, quotedMsg ? { quoted: quotedMsg } : {});

    return true;
  } catch (e) {
    console.log('sendVoiceNote error:', e.message);
    return false;
  }
}

async function sendImageCaption(sock, from, imagePath, imageUrl, caption, quotedMsg) {
  try {
    if (imageUrl && imageUrl.startsWith('http')) {
      await sock.sendMessage(from, {
        image: { url: imageUrl },
        caption,
      }, quotedMsg ? { quoted: quotedMsg } : {});
      return true;
    } else if (imagePath && fs.existsSync(imagePath)) {
      await sock.sendMessage(from, {
        image: fs.readFileSync(imagePath),
        caption,
      }, quotedMsg ? { quoted: quotedMsg } : {});
      return true;
    }
    return false;
  } catch (e) {
    console.log('sendImageCaption error:', e.message);
    return false;
  }
}

module.exports = { sendVoiceNote, sendImageCaption };