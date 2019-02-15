const { Chess } = require("./chess");

const chess = new Chess("rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/8/PPP2PPP/RNB1KBNR");
console.log(chess.toFen());
console.log(chess.toAscii(true));
console.log(chess.getSquare("d4"));
console.log(chess.getSquareMoves("d4"));
