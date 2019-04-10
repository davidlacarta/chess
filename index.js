const { Chess } = require("./src/chess");

const chess = new Chess();
console.log(chess.toFen());
console.log(chess.toAscii());
