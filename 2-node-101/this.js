console.log(this)
// 전역 스코브의 this만 module exports 된다
console.log(this === module.exports)

function a() {
    console.log(this === global);
}
a();