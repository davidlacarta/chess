const { Chess } = require("chess-base");

const chessGame = new Chess();
console.log(chessGame.toFen());
console.log(chessGame.toAscii());
