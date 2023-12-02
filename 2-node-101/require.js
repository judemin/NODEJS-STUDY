// var가 실행은 되는데 가져오지는 않는다
require('./module-example');

console.log(require);
console.log("--------------------------------");
// require.main으로 어떤 파일을 실행한건지 알 수 있음
console.log(require.main);
console.log("--------------------------------");
// 한번 require된 것은 캐싱이 되어서 저장된다
console.log(require.cache);
console.log("--------------------------------");