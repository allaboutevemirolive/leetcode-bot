const fs = require('fs');
const folderName = 'myFolder';
const fileName = 'myFile.txt';
const data = 'Hello, world!';

fs.mkdir(folderName, (err) => {
    if (err && err.code !== 'EEXIST') {
        throw err;
    }

    fs.writeFile(`${folderName}/${fileName}`, data, (err) => {
        if (err) {
            throw err;
        }

        console.log(`File ${fileName} saved inside ${folderName} folder.`);
    });
});
