const fs = require('fs').promises;

fs.readFile('./tmp.txt')
    .then((data) => {
        console.log(data);
        console.log(data.toString());
    })
    .catch((err) => {
        throw err;
    });

fs.writeFile('./write.txt', 'Write some text')
    .then(() => {
        console.log("Success")
    })
    .catch((err) => {
        throw err;
    });