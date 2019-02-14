const { Chess } = require("./chess");
const { PIECE_OFFSETS } = require("./piece");

const chess = new Chess();
console.log(chess.toFen());
console.log(chess.toAscii(true));
console.log("Square b1:");
console.log(chess.getSquare("b1"));
console.log("Moves b1:");
console.log(chess.getSquareMoves("b1"));
