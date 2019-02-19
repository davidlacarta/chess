const {
  fenToBoard,
  boardToFen,
  squareInBoard,
  getSquareMoves
} = require("./board");
const { boardToAscii } = require("./ascii");

const START_POSITION_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

class Chess {
  constructor(initPosition) {
    this.board = fenToBoard(initPosition || START_POSITION_FEN);
  }

  getSquare(algebraicPosition) {
    return squareInBoard(this.board, algebraicPosition);
  }

  getMoves(algebraicPosition) {
    return getSquareMoves(this.board, algebraicPosition);
  }

  toFen() {
    return boardToFen(this.board);
  }

  toAscii(showAlgebraic) {
    return boardToAscii(this.board, showAlgebraic);
  }
}

module.exports = { Chess };
