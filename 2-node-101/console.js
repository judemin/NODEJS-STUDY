// 시간 로깅
console.time("Time1");
console.log("hi i am timer");

console.log("Hello");

// 객체 로깅
console.dir({ hello: "hello" });

// 에러 로깅
console.error("This is error logging");

// 호출스택 로깅
function b() {
    console.trace("Trace error location");
}

// 테이블 로깅
console.table([
    { name: "person1", birth: 1994 },
    { name: "person2", birth: 1882 }
]);


console.timeEnd("Time1");