const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const dir = path.resolve(__dirname, 'styles');
const dirCopy = path.resolve(__dirname, 'project-dist', 'bundle.css');

const writeStream = fs.createWriteStream(dirCopy);

async function createStyles() {
  const files = await fsPromises.readdir(dir, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isFile()) {
      let fileExtension = path.extname(file.name);
      if (fileExtension === '.css') {
        addStyleFromFile(file);
      }
    }
  });
}

async function addStyleFromFile(file) {
  const filePath = path.resolve(dir, file.name);
  const data = await fsPromises.readFile(filePath);
  writeStream.write(`${data}\n`);
}

createStyles();
