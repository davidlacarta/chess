const { fenToBoard, boardToFen, squareInBoard } = require("./board");
const { PIECE_OFFSETS } = require("./piece");
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

  getSquareMoves(algebraicPosition) {
    const square = squareInBoard(algebraicPosition, this.board);
    const pieceOffsets = PIECE_OFFSETS[square.piece.type];
    return pieceOffsets
      .map(offset => squareInBoard(algebraicPosition, this.board, offset))
      .filter(square => !!square);
  }

  toFen() {
    return boardToFen(this.board);
  }

  toAscii(showAlgebraic) {
    return boardToAscii(this.board, showAlgebraic);
  }
}

module.exports = { Chess };
