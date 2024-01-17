const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');

const filePath = path.resolve(__dirname, 'text.txt');
let writeStream = fs.createWriteStream(filePath);

stdout.write('Hello! You can start enter text...\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    endFunc();
  }
  writeStream.write(data);
});

process.on('SIGINT', endFunc);

function endFunc() {
  stdout.write('Bye! The entering process has been finished.');
  process.exit();
}
