const buffer = Buffer.from('Change me into buffer');

console.log(buffer);
console.log(buffer.length);
console.log(buffer.toString());

const array = [Buffer.from('Chunk1 '), Buffer.from('Chunk2 '), Buffer.from('Chunk3 ')];
console.log(Buffer.concat(array).toString());

console.log(Buffer.alloc(5));