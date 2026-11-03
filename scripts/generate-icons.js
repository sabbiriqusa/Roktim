import fs from 'fs';
import zlib from 'zlib';

function createPng(width, height, r, g, b, withBadge = true) {
  // Simple valid PNG encoder using zlib
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 2; // RGB (truecolor)
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method

  function createChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const body = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    crc.writeInt32BE(calcCrc(body), 0);
    return Buffer.concat([len, body, crc]);
  }

  // Scanlines: filter byte (0) + width * 3 bytes
  const rawData = Buffer.alloc(height * (1 + width * 3));
  let offset = 0;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.42;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // filter type 0: None
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let pxR = r;
      let pxG = g;
      let pxB = b;

      // Outer gradient
      const factor = (y / height) * 0.4 + 0.8;
      pxR = Math.min(255, Math.floor(pxR * factor));
      pxG = Math.min(255, Math.floor(pxG * factor));
      pxB = Math.min(255, Math.floor(pxB * factor));

      if (withBadge && dist < maxRadius) {
        // Draw white circle with drop
        const innerDist = Math.sqrt(dx * dx + (dy - maxRadius * 0.2) * (dy - maxRadius * 0.2));
        if (innerDist < maxRadius * 0.5) {
          // Crimson core
          pxR = 220;
          pxG = 38;
          pxB = 38;
        } else {
          // White droplet border
          pxR = 255;
          pxG = 255;
          pxB = 255;
        }
      }

      rawData[offset++] = pxR;
      rawData[offset++] = pxG;
      rawData[offset++] = pxB;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 implementation
const crcTable = new Int32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function calcCrc(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return crc ^ -1;
}

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

// Crimson red theme: 220, 38, 38 (#dc2626)
fs.writeFileSync('./public/pwa-192x192.png', createPng(192, 192, 220, 38, 38));
fs.writeFileSync('./public/pwa-512x512.png', createPng(512, 512, 220, 38, 38));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createPng(512, 512, 185, 28, 28, true));
fs.writeFileSync('./public/apple-touch-icon.png', createPng(180, 180, 220, 38, 38));
fs.writeFileSync('./public/favicon.ico', createPng(32, 32, 220, 38, 38));

console.log('PWA PNG icons created successfully in ./public!');
