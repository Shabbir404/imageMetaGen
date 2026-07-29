export function decodeEpsiPreviewPixels({ width, height, depth, hex }) {
  const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, "");
  if (!cleanHex) return null;

  const bytes = new Uint8Array(Math.ceil(cleanHex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.slice(i * 2, i * 2 + 2), 16) || 0;
  }

  const pixels = new Uint8ClampedArray(width * height * 4);
  const bytesPerPixel = depth === 1 ? 0 : Math.max(1, Math.ceil(depth / 8));

  if (depth === 1) {
    const rowBytes = Math.ceil(width / 8);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const byteIndex = y * rowBytes + Math.floor(x / 8);
        const bit = 7 - (x % 8);
        const value = (bytes[byteIndex] >> bit) & 1;
        const gray = value ? 255 : 0;
        const idx = (y * width + x) * 4;
        pixels[idx] = gray;
        pixels[idx + 1] = gray;
        pixels[idx + 2] = gray;
        pixels[idx + 3] = 255;
      }
    }
    return pixels;
  }

  const bytesPerRow = width * bytesPerPixel;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = y * bytesPerRow + x * bytesPerPixel;
      const sample = bytes.slice(offset, offset + bytesPerPixel);
      if (depth <= 8) {
        const gray = sample[0] ?? 0;
        const idx = (y * width + x) * 4;
        pixels[idx] = gray;
        pixels[idx + 1] = gray;
        pixels[idx + 2] = gray;
        pixels[idx + 3] = 255;
      } else if (depth <= 24) {
        const r = sample[0] ?? 0;
        const g = sample[1] ?? 0;
        const b = sample[2] ?? 0;
        const idx = (y * width + x) * 4;
        pixels[idx] = r;
        pixels[idx + 1] = g;
        pixels[idx + 2] = b;
        pixels[idx + 3] = 255;
      } else {
        const r = sample[0] ?? 0;
        const g = sample[1] ?? 0;
        const b = sample[2] ?? 0;
        const a = sample[3] ?? 255;
        const idx = (y * width + x) * 4;
        pixels[idx] = r;
        pixels[idx + 1] = g;
        pixels[idx + 2] = b;
        pixels[idx + 3] = a;
      }
    }
  }

  return pixels;
}
