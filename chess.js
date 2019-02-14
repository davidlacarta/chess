const { fenToBoard, boardToFen, squareInBoard } = require("./board");
const { boardToAscii } = require("./ascii");

class Chess {
  constructor() {
    const startPositionFen =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    this.board = fenToBoard(startPositionFen);
  }

  getSquare(algebraicPosition) {
    return squareInBoard(algebraicPosition, this.board);
  }

  toFen() {
    return boardToFen(this.board);
  }

  toAscii(showAlgebraic) {
    return boardToAscii(this.board, showAlgebraic);
  }
}

module.exports = { Chess };
