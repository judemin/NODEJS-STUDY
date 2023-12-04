const path = require('path');

const string = __filename;

console.log(path.step);
console.log(path.delimiter);
console.log("----------------------");
console.log(path.dirname(string));
console.log(path.extname(string));
console.log(path.basename(string));