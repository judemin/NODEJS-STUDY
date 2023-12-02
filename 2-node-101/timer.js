setTimeout(() => console.log("SetTimeout"), 2000);
const interval = setInterval(() => console.log("SetInterval"), 1000);
setTimeout(() => clearInterval(interval), 10000);