const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

async function copyHtml() {
    const componentsPath = path.join(__dirname, 'components');
    const toIndexHtmlPath = path.join(__dirname, 'project-dist', 'index.html');
    fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
    const componentsName = await fsPromises.readdir(componentsPath);
    const templatePath = path.join(__dirname, 'template.html');
    let templateData = (await fsPromises.readFile(templatePath)).toString();
  async function readHtml(file) {
    const componentsFileName = path.join(__dirname, 'components', file);
    const name = file.split('.')[0];
    const text = (await fsPromises.readFile(componentsFileName)).toString();
    templateData = await templateData.replace(`{{${name}}}`, `${text}`);
        return await templateData;
  }
  async function replaceHtml(file) {
    const newHtml = await readHtml(file);
    await fsPromises.writeFile(toIndexHtmlPath, newHtml);
  }
  await componentsName.map((file) => {
    replaceHtml(file);
  });
}

async function createCss() {
    const style = fs.createWriteStream(path.join(__dirname, 'project-dist' , 'style.css'));
    const files = await fsPromises.readdir(path.join(__dirname,'styles'),{withFileTypes: true});
    files.forEach( async (file) => {
      if (file.isFile()) {
          if (path.extname(file.name).split('.')[1] === 'css') {
              let readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name), "utf8");
              readableStream.on("data", function(chunk){
                  style.write(chunk.toString());
              });
          }
      }
    });

}

async function copyAssets() {
    const files = await fsPromises.readdir(path.join(__dirname,'assets'),{withFileTypes: true});
    const assetsFromPath = path.join(__dirname, 'assets');
    const assetsToPath = path.join(__dirname, 'project-dist' , 'assets');

    for (const file of files) {
        if (file.isFile()) {
          fsPromises.copyFile(path.join(assetsFromPath, file.name), path.join(assetsToPath, file.name));
        }
        else {
            fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets', file.name), {recursive: true});
        const folder = await fsPromises.readdir(path.join(__dirname, 'assets' , file.name),{withFileTypes: true});
        for (const deepFile of folder) {
            if (deepFile.isFile()) {
                fsPromises.copyFile( path.join(__dirname, 'assets', file.name, deepFile.name), path.join(__dirname, 'project-dist', 'assets', file.name, deepFile.name));
            }
        }
      }
  }
}

async function copyAllFiles() {
    const copyMainFolder = path.join(__dirname, 'project-dist');

    await fsPromises.rm(copyMainFolder, { recursive: true, force: true });
    await fsPromises.mkdir(path.join(__dirname, 'project-dist' , 'assets'), {recursive: true});

  copyHtml();
  createCss();
  copyAssets();
}

copyAllFiles();