const fs = require('fs');
const path = require('path');
const process = require('process');
const { stdin, stdout } = require('process');
let output = null;
stdout.write('Hello! Write something\n');
stdin.on('data', function (chunk) {
    if (!output) {
        output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
    }
    if (chunk.toString().trim() === 'exit') {
        stdout.write('Bye\n');
        process.exit();
    }
    else {
        output.write(chunk);
    }
});
process.on('SIGINT', function () {
    stdout.write('Bye\n');
    process.exit();
});
