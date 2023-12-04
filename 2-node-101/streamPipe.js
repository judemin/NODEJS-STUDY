const fs = require('fs');
const zlib = require('zlib');

const readStream = fs.createReadStream('./bufferTest.js', { highWaterMark: 16 });
const zlibStream = zlib.createGzip();
const writeStream = fs.createWriteStream('./writeBuffer.txt');

readStream.pipe(zlibStream).pipe(writeStream);