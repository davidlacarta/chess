import { fenToState, stateToFen, squareInBoard } from "./board";
import {
  moves,
  movesPosition,
  moveSquare,
  isTarget,
  isTargetKing,
  castling
} from "./movement";
import { CASTLING_TYPE } from "./piece";
import { boardToAscii } from "./ascii";

const FEN_START_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

class Chess {
  constructor(fenPosition) {
    this.state = fenToState(fenPosition || FEN_START_POSITION);
  }

  getSquare(algebraicPosition) {
    return squareInBoard({ board: this.state.board, algebraicPosition });
  }

  getMovesTurn() {
    return moves({ state: this.state });
  }

  getMoves(algebraicPosition) {
    return movesPosition({
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

  move(algebraicPositionFrom, algebraicPositionTo, promotionType) {
    const { state, squareCaptured } = moveSquare({
      state: this.state,
      algebraicPositionFrom,
      algebraicPositionTo,
      promotionType
    });
    this.state = state;
    return squareCaptured;
  }

  toFen() {
    return stateToFen(this.state);
  }

  toAscii(props) {
    const showAlgebraic = props && props.extend;
    return boardToAscii({ board: this.state.board, showAlgebraic });
  }
}

export { Chess };
