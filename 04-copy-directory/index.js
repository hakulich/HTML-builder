const path = require('path');
const fs = require('fs/promises');
const dir = path.resolve(__dirname, 'files');
const dirCopy = path.resolve(__dirname, 'files-copy');

async function copyDir() {
  try {
    await deleteDir();
    await createDir();
    await copyFiles();
  } catch (error) {
    console.log(error.message);
  }
}

async function createDir() {
  try {
    await fs.mkdir(dirCopy, { recursive: true });
  } catch (error) {
    console.error(error);
  }
}

async function copyFiles() {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    files.forEach((file) => {
      const filePath = path.join(dir, file.name);
      const filePathDestination = path.join(dirCopy, file.name);
      fs.copyFile(filePath, filePathDestination);
    });
  } catch (error) {
    console.error(error);
  }
}

async function deleteDir() {
  await fs.rm(dirCopy, { force: true, recursive: true });
}

copyDir();
