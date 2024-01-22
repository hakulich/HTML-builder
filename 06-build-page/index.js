const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

//HTML
async function createHtml(pathSourceHTML, pathTempleHTML, pathToIndexHTML) {
  const templateHTML = await fsPromises.readFile(pathTempleHTML, 'utf-8');
  await fsPromises.writeFile(pathToIndexHTML, templateHTML);

  const componentsHTML = await fsPromises.readdir(pathSourceHTML, {
    withFileTypes: true,
  });
  const buildHTML = await addComponentsToTemplate(
    componentsHTML,
    pathSourceHTML,
    pathToIndexHTML,
  );
  await fsPromises.writeFile(pathToIndexHTML, buildHTML);
}

async function addComponentsToTemplate(files, pathDir, pathToIndexHTML) {
  let fileHTML = await fsPromises.readFile(pathToIndexHTML, 'utf-8');

  for (let file of files) {
    const filePath = path.resolve(pathDir, file.name);
    if (file.isFile()) {
      let fileExtension = path.extname(file.name);
      if (fileExtension === '.html') {
        let fileName = file.name.split('.').slice(0, -1).join('.');
        let fileData = await fsPromises.readFile(filePath, 'utf-8');
        fileHTML = fileHTML.replace(`{{${fileName}}}`, fileData);
      }
    }
  }

  return fileHTML;
}

//Styles
const pathStyleFiles = path.resolve(__dirname, 'project-dist', 'style.css');
const writeStream = fs.createWriteStream(pathStyleFiles);
async function createStyles(stylesSource) {
  const files = await fsPromises.readdir(stylesSource, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isFile()) {
      let fileExtension = path.extname(file.name);
      if (fileExtension === '.css') {
        addStyleFromFile(file, stylesSource);
      }
    }
  });
}

async function addStyleFromFile(file, pathStyle) {
  const filePath = path.resolve(pathStyle, file.name);
  const data = await fsPromises.readFile(filePath);
  writeStream.write(`${data}\n`);
}

// Copy Directory
async function copyDir(sourcePath, destinationPath) {
  try {
    await createDir(destinationPath);
    await copyFiles(sourcePath, destinationPath);
  } catch (error) {
    console.log(error.message);
  }
}

async function createDir(dirPath) {
  try {
    await fsPromises.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(error);
  }
}

async function copyFiles(pathFrom, pathTo) {
  try {
    const files = await fsPromises.readdir(pathFrom, { withFileTypes: true });
    files.forEach((file) => {
      const filePath = path.resolve(pathFrom, file.name);
      const filePathDestination = path.resolve(pathTo, file.name);
      if (file.isDirectory()) {
        copyDir(filePath, filePathDestination);
      }
      if (file.isFile()) {
        fsPromises.copyFile(filePath, filePathDestination);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function createDistDir() {
  //Create folder
  const pathProjectDist = path.resolve(__dirname, 'project-dist');
  await fsPromises.mkdir(pathProjectDist, { recursive: true });

  //Create HTML
  const templateHTML = path.resolve(__dirname, 'template.html');
  const componentsHTML = path.resolve(__dirname, 'components');
  const pathIndexFile = path.resolve(__dirname, 'project-dist', 'index.html');
  await createHtml(componentsHTML, templateHTML, pathIndexFile);

  //Add Styles
  const stylesCSS = path.resolve(__dirname, 'styles');
  await createStyles(stylesCSS);

  //Add Assets
  const assetsDir = path.resolve(__dirname, 'assets');
  const assetsDirDest = path.resolve(__dirname, 'project-dist', 'assets');
  await copyDir(assetsDir, assetsDirDest);
}

createDistDir();
