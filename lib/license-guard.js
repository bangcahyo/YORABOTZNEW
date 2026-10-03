const PRODUCT_NAME = 'Yora Botz';

function assertProductName(botName) {
  if (botName !== PRODUCT_NAME) {
    throw new Error(`Nama bot tidak sesuai lisensi. Nilai botName harus "${PRODUCT_NAME}".`);
  }
}

module.exports = { assertProductName };
