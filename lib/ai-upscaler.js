const sharp = require('sharp');

const MODEL_ID = 'Xenova/swin2SR-lightweight-x2-64';
const MAX_AI_DIMENSION = 512;
const MAX_AI_PIXELS = 512 * 512;
let modelPromise = null;

function validateAiDimensions(width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    throw new Error('Dimensi foto tidak valid.');
  }
  if (Math.max(width, height) > MAX_AI_DIMENSION || width * height > MAX_AI_PIXELS) {
    throw new Error(`Mode AI dibatasi ke foto maksimal ${MAX_AI_DIMENSION}×${MAX_AI_DIMENSION} piksel di panel CPU ini. Gunakan .hd biasa untuk foto lebih besar.`);
  }
}

async function getModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      const { pipeline } = await import('@huggingface/transformers');
      return pipeline('image-to-image', MODEL_ID, { device: 'cpu', dtype: 'q4' });
    })().catch(error => {
      modelPromise = null;
      throw error;
    });
  }
  return modelPromise;
}

async function upscaleWithAi(input) {
  const normalized = await sharp(input, { limitInputPixels: MAX_AI_PIXELS })
    .rotate()
    .png()
    .toBuffer();
  const metadata = await sharp(normalized).metadata();
  validateAiDimensions(metadata.width, metadata.height);

  const { RawImage } = await import('@huggingface/transformers');
  const image = await RawImage.fromBlob(new Blob([normalized], { type: 'image/png' }));
  const upscaler = await getModel();
  const result = await upscaler(image);
  const output = await sharp(result.data, {
    raw: { width: result.width, height: result.height, channels: result.channels },
  }).jpeg({ quality: 90, mozjpeg: true }).toBuffer();

  return { buffer: output, width: result.width, height: result.height, model: MODEL_ID };
}

module.exports = { upscaleWithAi, validateAiDimensions, MODEL_ID, MAX_AI_DIMENSION };