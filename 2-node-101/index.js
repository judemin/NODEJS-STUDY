const { odd, even } = require("./module-example");

function helloWorld() {
    console.log("Hello World!");
    helloNode();
}

function helloNode() {
    console.log("Hello Node");
}

helloWorld();
console.log("I can get module variable");
console.log(odd, even);