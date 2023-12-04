const os = require('os');

console.log(os.cpus());
console.table(os.cpus());
console.table(os.cpus()[0].times);