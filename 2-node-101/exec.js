const exec = require('child_process').exec;

var process = exec('cmd /c chcp 65001>nul && dir');

process.stdout.on('data', function (data) {
    console.log(data.toString());
});

process.stderr.on('data', function (data) {
    console.log(data.toString());
});