const fs = require('fs');
const path = require('path');

// Minimal silent MP3 file (valid MP3 header with silence)
// This is a 1-second silent MP3 at 128kbps
const silentMP3 = Buffer.from([
  // ID3v2 header
  0x49, 0x44, 0x33, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  // MP3 frame header (MPEG Version 2.5, Layer III, 128kbps, 16000Hz, no padding)
  0xFF, 0xE2, 0x44, 0x00,
  // Silent audio data (minimal valid frame)
  ...Array(416).fill(0x00)
]);

const outputPath = path.join(__dirname, '..', 'public', 'welcome-message.mp3');
fs.writeFileSync(outputPath, silentMP3);
console.log('Created silent MP3 file at:', outputPath);
