const { fenToBoard, boardToFen, squareInBoard } = require("./board");
const { PIECE_OFFSETS, PIECE_OFFSETS_ONE_MOVE } = require("./piece");
const { boardToAscii } = require("./ascii");

const START_POSITION_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function flat(array) {
  return [].concat.apply([], array);
}

function moves(board, square, offset, oneMove) {
  return movesRecursive(board, square, offset, oneMove, [], square.square);
}

function movesRecursive(
  board,
  square,
  offset,
  oneMove,
  nextMoves,
  currentSquare
) {
  const nextSquare = squareInBoard(currentSquare, board, offset);

  const nextSquareIsEmpty = nextSquare && nextSquare.piece === null;
  const nextSquareIsCapture =
    nextSquare &&
    nextSquare.piece !== null &&
    nextSquare.piece.color !== square.piece.color;
  const moveIsValid = nextSquareIsEmpty || nextSquareIsCapture;
  if (moveIsValid) {
    nextMoves.push(nextSquare);
  }

  const isLastMove = !nextSquare || nextSquare.piece !== null || oneMove;
  if (isLastMove) {
    return nextMoves;
  }

  return movesRecursive(
    board,
    square,
    offset,
    oneMove,
    nextMoves,
    nextSquare.square
  );
}

class Chess {
  constructor(initPosition) {
    this.board = fenToBoard(initPosition || START_POSITION_FEN);
  }

  getSquare(algebraicPosition) {
    return squareInBoard(algebraicPosition, this.board);
  }

  getSquareMoves(algebraicPosition) {
    const square = squareInBoard(algebraicPosition, this.board);
    const pieceOffsets = PIECE_OFFSETS[square.piece.type];
    const oneMove = PIECE_OFFSETS_ONE_MOVE[square.piece.type];
    return flat(
      pieceOffsets.map(offset => moves(this.board, square, offset, oneMove))
    );
  }

  toFen() {
    return boardToFen(this.board);
  }

  toAscii(showAlgebraic) {
    return boardToAscii(this.board, showAlgebraic);
  }
}

module.exports = { Chess };
