const odd = "홀수입니다";
const even = "짝수입니다";

console.log("This is module-example");

module.exports = {
    odd,
    even,
}

// 한가지를 쓸때는  module.exports
// 여러가지를 쓸떄는 exports.odd ...