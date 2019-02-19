const { Chess } = require("./chess");

const chess = new Chess();
console.log(chess.toAscii(true));
console.log(chess.toFen());
console.log(chess.getMoves("b1"));
