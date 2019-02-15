const { fenToBoard, boardToFen, squareInBoard } = require("./board");
const { PIECE_OFFSETS, PIECE_OFFSETS_ONE_MOVE } = require("./piece");
const { boardToAscii } = require("./ascii");

const START_POSITION_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

class Chess {
  constructor(initPosition) {
    this.board = fenToBoard(initPosition || START_POSITION_FEN);
  }

  getSquare(algebraicPosition) {
    return squareInBoard(algebraicPosition, this.board);
  }

  getSquareMoves(algebraicPosition) {
    const squareBase = squareInBoard(algebraicPosition, this.board);
    const pieceOffsets = PIECE_OFFSETS[squareBase.piece.type];
    const oneMove = PIECE_OFFSETS_ONE_MOVE[squareBase.piece.type];
    const movesBase = pieceOffsets
      .map(offset => {
        const square = squareInBoard(algebraicPosition, this.board, offset);
        if (!square) {
          return;
        }
        square["offset"] = offset;
        return square;
      })
      .filter(square => !!square)
      .filter(square => {
        if (square.piece === null) {
          return true;
        }
        return square.piece.color !== squareBase.piece.color;
      });
    if (oneMove) {
      return movesBase;
    }
    const movesAll = [...movesBase];
    movesBase
      .filter(move => move.piece === null)
      .forEach(move => {
        const nextMove = squareInBoard(move.square, this.board, move.offset);
        if (!nextMove) {
          return;
        }
        if (
          nextMove.piece !== null &&
          nextMove.piece.color === squareBase.piece.color
        ) {
          return;
        }
        movesAll.push(nextMove);
      });
    return movesAll;
  }

  toFen() {
    return boardToFen(this.board);
  }

  toAscii(showAlgebraic) {
    return boardToAscii(this.board, showAlgebraic);
  }
}

module.exports = { Chess };
