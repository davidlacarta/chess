const { Chess } = require("./src/chess");
const chess = new Chess(
  "r1bqkbnr/ppp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4"
);

console.log(chess.toAscii(true));
console.log(chess.toFen());
console.log(chess.castlingKing());

console.log(chess.toAscii(true));
console.log(chess.toFen());
