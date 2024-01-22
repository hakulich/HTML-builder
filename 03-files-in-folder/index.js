const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

fs.readdir(
  path.resolve(__dirname, 'secret-folder'),
  { withFileTypes: true },
  function (error, files) {
    if (error) {
      return stdout.write(error);
    }
    files.forEach((item) => {
      fileInfo(item);
    });
  },
);

const fileInfo = function (file) {
  let filePath = path.resolve(__dirname, 'secret-folder', file.name);
  if (file.isFile()) {
    fs.stat(filePath, (error, stats) => {
      let fileName = file.name.split('.').slice(0, -1).join('.');
      let fileExtension = path.extname(file.name);
      let fileSize = stats.size + ' bytes';
      stdout.write(`${fileName} - ${fileExtension} - ${fileSize} \n`);
    });
  }
};
