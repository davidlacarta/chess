const {
  PIECE_COLOR,
  PIECE_OFFSETS,
  PIECE_OFFSETS_NUM_MOVES,
  PAWN_OFFSETS,
  isPawn
} = require("./piece");
const {
  flat,
  squareInBoard,
  toArrayPosition,
  toAlgebraicPosition
} = require("./board");

function getSquareMoves({ state, algebraicPosition }) {
  const { board } = state;
  const square = squareInBoard({ board, algebraicPosition });
  if (
    !square ||
    square.piece === null ||
    square.piece.color !== state.activeColour
  ) {
    return [];
  }
  const pieceOffsets = isPawn(square.piece)
    ? PAWN_OFFSETS[square.piece.color]
    : PIECE_OFFSETS[square.piece.type];
  const numMoves = isPawn(square.piece)
    ? getPawnNumMoves(square)
    : PIECE_OFFSETS_NUM_MOVES[square.piece.type];
  return flat(
    pieceOffsets.map(offset => getMoves({ state, square, offset, numMoves }))
  );
}

function getPawnNumMoves(square) {
  const pieceColor = square.piece.color;
  const rowSquare = Number(square.square[1]);
  const isPawnStartPosition =
    (rowSquare === 2 && PIECE_COLOR.WHITE === pieceColor) ||
    (rowSquare === 7 && PIECE_COLOR.BLACK === pieceColor);
  return isPawnStartPosition ? 2 : 1;
}

function getMoves({ state, square, offset, numMoves }) {
  return getMovesRecursive({
    state,
    square,
    offset,
    numMoves,
    nextMoves: [],
    currentSquare: square.square
  });
}

function getMovesRecursive({
  state,
  square,
  offset,
  numMoves,
  nextMoves,
  currentSquare
}) {
  const { board, passantTarget } = state;
  const nextSquare = squareInBoard({
    board,
    algebraicPosition: currentSquare,
    offset
  });
  if (moveIsValid({ square, nextSquare, passantTarget })) {
    nextMoves.push(nextSquare);
  }
  return moveIsLast({ square, nextMoves, nextSquare, numMoves })
    ? nextMoves
    : getMovesRecursive({
        state,
        square,
        offset,
        numMoves,
        nextMoves,
        currentSquare: nextSquare.square
      });
}

function moveIsValid({ square, nextSquare, passantTarget }) {
  const nextSquareIsPlaced = nextSquare && nextSquare.piece !== null;
  const nextSquareIsEmpty = nextSquare && nextSquare.piece === null;
  const nextPieceIsCapture =
    nextSquareIsPlaced && nextSquare.piece.color !== square.piece.color;
  return isPawn(square.piece)
    ? movePawnIsValid({ square, nextSquare, passantTarget })
    : nextSquareIsEmpty || nextPieceIsCapture;
}

function movePawnIsValid({ square, nextSquare, passantTarget }) {
  const nextSquareIsPassant = nextSquare && nextSquare.square === passantTarget;
  const isMoveCapture = isPawnMoveCapture({ square, nextSquare });
  const nextSquareIsPlaced = nextSquare && nextSquare.piece !== null;
  const nextPieceIsCapture =
    nextSquareIsPlaced && nextSquare.piece.color !== square.piece.color;
  return (
    (nextSquare && !isMoveCapture && !nextSquareIsPlaced) ||
    (nextSquare && isMoveCapture && nextPieceIsCapture) ||
    nextSquareIsPassant
  );
}

function moveIsLast({ square, nextMoves, nextSquare, numMoves }) {
  const nextSquareIsPlaced = nextSquare && nextSquare.piece !== null;
  const numMovesCompleted = numMoves !== -1 && nextMoves.length === numMoves;
  return (
    !nextSquare ||
    nextSquareIsPlaced ||
    numMovesCompleted ||
    (isPawn(square.piece) && isPawnMoveCapture({ square, nextSquare }))
  );
}

function isPawnMoveCapture({ square, nextSquare }) {
  const sameColumn = nextSquare && square.square[0] === nextSquare.square[0];
  return !sameColumn;
}

function moveSquare({ state, algebraicPositionFrom, algebraicPositionTo }) {
  const virtualState = state;
  const squareTarget = moveSquareVirtual({
    state: virtualState,
    algebraicPositionFrom,
    algebraicPositionTo
  });
  if (isTargetKing(virtualState)) {
    throw "target king";
  }
  state = virtualState;
  return squareTarget;
}

function moveSquareVirtual({
  state,
  algebraicPositionFrom,
  algebraicPositionTo
}) {
  if (
    !moveSquareIsValid({ state, algebraicPositionFrom, algebraicPositionTo })
  ) {
    throw "move invalid";
  }
  const { board, passantTarget } = state;
  const boardPositionFrom = toArrayPosition(algebraicPositionFrom);
  const boardPositionTo = toArrayPosition(algebraicPositionTo);

  const { squareFrom, squareTo } = moveSquareBoard({
    board,
    boardPositionFrom,
    boardPositionTo
  });

  const squareTarget =
    isPawn(squareFrom) && algebraicPositionTo === passantTarget
      ? cleanSquareBoardPassant({ state, squareFrom, boardPositionTo })
      : squareTo;

  updatePassantTarget({
    state,
    squareFrom,
    boardPositionFrom,
    boardPositionTo
  });
  updateHalfMoveClock({ state, squareFrom, squareTarget });
  updateFullMoveNumber(state);
  changeActiveColor(state);

  return squareTarget;
}

function updateHalfMoveClock({ state, squareFrom, squareTarget }) {
  const isCapture = squareTarget !== null;
  state.halfMoveClock =
    isPawn(squareFrom) || isCapture ? 0 : state.halfMoveClock + 1;
}

function updateFullMoveNumber(state) {
  if (state.activeColour === PIECE_COLOR.BLACK) {
    state.fullMoveNumber += 1;
  }
}

function updatePassantTarget({
  state,
  squareFrom,
  boardPositionFrom,
  boardPositionTo
}) {
  const moveTwoRows = Math.abs(boardPositionFrom[0] - boardPositionTo[0]) === 2;
  if (!isPawn(squareFrom) || !moveTwoRows) {
    state.passantTarget = "-";
    return;
  }

  const boardPositionPassant = getBoardPositionPassant({
    color: squareFrom.color,
    boardPosition: boardPositionTo
  });

  state.passantTarget = toAlgebraicPosition(boardPositionPassant);
}

function cleanSquareBoardPassant({ state, squareFrom, boardPositionTo }) {
  const { board } = state;
  const boardPositionPassant = getBoardPositionPassant({
    color: squareFrom.color,
    boardPosition: boardPositionTo
  });
  return cleanSquareBoard({
    board,
    boardPosition: boardPositionPassant
  });
}

function changeActiveColor(state) {
  state.activeColour =
    state.activeColour === PIECE_COLOR.WHITE
      ? PIECE_COLOR.BLACK
      : PIECE_COLOR.WHITE;
}

function getBoardPositionPassant({ color, boardPosition }) {
  const offset = color === PIECE_COLOR.WHITE ? -1 : 1;
  const boardPositionPassant = boardPosition;
  boardPositionPassant[0] += offset;
  return boardPositionPassant;
}

function moveSquareIsValid({
  state,
  algebraicPositionFrom,
  algebraicPositionTo
}) {
  const moves = getSquareMoves({
    state,
    algebraicPosition: algebraicPositionFrom
  });
  return moves.find(move => move.square === algebraicPositionTo);
}

function moveSquareBoard({ board, boardPositionFrom, boardPositionTo }) {
  const squareFrom = board[boardPositionFrom[0]][boardPositionFrom[1]];
  const squareTo = board[boardPositionTo[0]][boardPositionTo[1]];

  board[boardPositionTo[0]][boardPositionTo[1]] = squareFrom;
  board[boardPositionFrom[0]][boardPositionFrom[1]] = null;

  return { squareFrom, squareTo };
}

function cleanSquareBoard({ board, boardPosition }) {
  const squareCaptured = board[boardPosition[0]][boardPosition[1]];
  board[boardPosition[0]][boardPosition[1]] = null;
  return squareCaptured;
}

function isTargetKing(state) {
  const { board, activeColour } = state;
  const noActiveColour =
    PIECE_COLOR.WHITE === activeColour ? PIECE_COLOR.BLACK : PIECE_COLOR.WHITE;
  const squareKing = getSquareKing({
    board,
    color: noActiveColour
  });
  return isTarget({ state, algebraicPosition: squareKing.square });
}

function getSquareKing({ board, color }) {
  return board
    .map((row, rowIndex) =>
      row
        .map((piece, colIndex) => ({
          piece,
          square: toAlgebraicPosition([rowIndex, colIndex])
        }))
        .find(
          piece =>
            piece.piece != null &&
            piece.piece.color === color &&
            piece.piece.type === "k"
        )
    )
    .filter(square => !!square)[0];
}

function isTarget({ state, algebraicPosition }) {
  return !!getSquareMovesActiveColor(state).find(
    square => square.square === algebraicPosition
  );
}

function getSquareMovesActiveColor(state) {
  return removeDuplicates(
    flat(
      squaresActiveColor(state).map(algebraicPosition => {
        const moves = getSquareMoves({ state, algebraicPosition });
        return moves;
      })
    )
  );
}

function removeDuplicates(squares) {
  return squares.reduce((accum, current) => {
    const isAdded = accum.find(
      accumElement => accumElement.square === current.square
    );
    return isAdded ? accum : accum.concat([current]);
  }, []);
}

function squaresActiveColor(state) {
  const { board, activeColour } = state;
  return flat(
    board.map((row, rowIndex) =>
      row
        .map((piece, colIndex) => ({
          piece,
          square: toAlgebraicPosition([rowIndex, colIndex])
        }))
        .filter(
          piece => piece.piece !== null && piece.piece.color === activeColour
        )
        .map(piece => piece.square)
    )
  );
}

module.exports = {
  getSquareMoves,
  moveSquare,
  isTarget,
  isTargetKing
};
