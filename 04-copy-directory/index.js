const fsPromises = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'files');
const folderCopyPath = path.join(__dirname, 'files-copy');

async function replaceFiles() {
    await fsPromises.rm(path.join(folderCopyPath), { recursive: true, force: true }, (err) => {
        if (err) {
            throw err;
        }
    });
    await fsPromises.mkdir(path.join(folderCopyPath), {recursive: true} , (error) => {
        if (error) {
            throw error;
        }
    });
        await copyFiles();
    }
async function copyFiles() {
    const files = await fsPromises.readdir(folderPath,{withFileTypes: true});
    fsPromises.mkdir(folderCopyPath,{recursive:true});
    for (const file of files) {
        if (file.isFile()) {
            const filePath = path.join(folderPath, file.name);
            const fileCopyPath = path.join(folderCopyPath, file.name);
            fsPromises.copyFile(filePath, fileCopyPath);
        }
    }
}
replaceFiles();
copyFiles(folderPath, folderCopyPath);
