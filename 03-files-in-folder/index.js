const fsPromises = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');
async function folderReader() {
    const files = await fsPromises.readdir(folderPath,{withFileTypes: true});
    for (const file of files) {
        if (file.isFile()) {
            const filePath = path.join(folderPath, file.name);
            const formatFile = path.extname(file.name).split('.')[1];
            const nameFile = file.name.split('.')[0];
            const stat = await fsPromises.stat(filePath);
            const sizeFile = stat.size / 1000;
                console.log(`${nameFile} - ${formatFile} - ${sizeFile}kb`);
        }
    }
}
folderReader('secret-folder');
