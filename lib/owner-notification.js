function getOwnerJid(ownerNumber, ownerLID, contacts) {
  const contact = contacts?.find(item => item.exists);
  if (contact?.lid && contact.lid.endsWith('@lid')) return contact.lid;
  if (ownerLID && ownerLID.endsWith('@lid')) return ownerLID;
  if (contact?.jid) return contact.jid;

  const number = String(ownerNumber || '').replace(/[^0-9]/g, '');
  return number ? `${number}@s.whatsapp.net` : null;
}

async function notifyOwner(sock, config, text) {
  if (config.ownerAlerts?.enabled === false) return false;

  const number = String(config.ownerNumber || '').replace(/[^0-9]/g, '');
  if (!number) {
    console.error('❌ notifyOwner gagal: nomor owner belum dikonfigurasi.');
    return false;
  }

  try {
    let contacts;
    if (typeof sock.onWhatsApp === 'function') {
      contacts = await sock.onWhatsApp(number);
    }
    const ownerJid = getOwnerJid(number, config.ownerLID, contacts);
    if (!ownerJid) {
      console.error('❌ notifyOwner gagal: alamat WhatsApp owner tidak tersedia.');
      return false;
    }

    await sock.sendMessage(ownerJid, { text });
    return true;
  } catch (err) {
    console.error('❌ notifyOwner gagal mengirim pesan: ' + err.message);
    return false;
  }
}

module.exports = { getOwnerJid, notifyOwner };
