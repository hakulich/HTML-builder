const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'text.txt');
const { stdout } = require('process');

let readStream = fs.createReadStream(filePath);

let data = '';
readStream.on('data', (chunk) => (data += chunk));
readStream.on('end', () => stdout.write(data));
