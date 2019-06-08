const { Chess } = require("../dist/chess.js");

const chess = new Chess();
console.log(chess.toFen());
console.log(chess.toAscii());
