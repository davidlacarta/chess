const { fenToState, stateToFen, squareInBoard } = require("./board");
const {
  getSquareMoves,
  moveSquare,
  isTarget,
  isTargetKing,
  castling
} = require("./movement");
const { CASTLING_TYPE } = require("./piece");
const { boardToAscii } = require("./ascii");

const FEN_START_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

class Chess {
  constructor(fenPosition) {
    this.state = fenToState(fenPosition || FEN_START_POSITION);
  }

  getSquare(algebraicPosition) {
    return squareInBoard({ board: this.state.board, algebraicPosition });
  }

  getMoves(algebraicPosition) {
    return getSquareMoves({
      state: this.state,
      algebraicPosition
    });
  }

  castlingKing() {
    castling({ state: this.state, castlingType: CASTLING_TYPE.KING });
  }

  castlingQueen() {
    castling({ state: this.state, castlingType: CASTLING_TYPE.QUEEN });
  }

  target(algebraicPosition) {
    return isTarget({ state: this.state, algebraicPosition });
  }

  targetKing() {
    return isTargetKing(this.state);
  }

  move(algebraicPositionFrom, algebraicPositionTo) {
    return moveSquare({
      state: this.state,
      algebraicPositionFrom,
      algebraicPositionTo
    });
  }

  toFen() {
    return stateToFen(this.state);
  }

  toAscii(showAlgebraic) {
    return boardToAscii(this.state.board, showAlgebraic);
  }
}

module.exports = { Chess };
