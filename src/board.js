const {
  PIECE_COLOR,
  PIECE_OFFSETS,
  PIECE_OFFSETS_NUM_MOVES,
  PAWN_OFFSETS,
  isPawn
} = require("./piece");

const REGEX_FEN_PIECE = /(r|n|b|q|k|p)/i;
const REGEX_FEN_PIECE_WHITE = /(R|N|B|Q|K|P)/;

function flat(array) {
  return [].concat.apply([], array);
}

function fenToState(fenState) {
  const fenStateRecords = fenState.split(" ");
  const piecesPlacement = fenStateRecords[0];
  const activeColour = fenStateRecords[1];
  const castlingAvailability = fenStateRecords[2];
  const passantTarget = fenStateRecords[3];
  const halfMoveClock = Number(fenStateRecords[4]);
  const fullMoveNumber = Number(fenStateRecords[5]);
  return {
    board: fenPiecesPlacementToBoard(piecesPlacement),
    activeColour,
    castlingAvailability,
    passantTarget,
    halfMoveClock,
    fullMoveNumber
  };
}

function fenPiecesPlacementToBoard(piecesPlacement) {
  const fenRows = piecesPlacement.split("/");
  return fenRows.reverse().map(fenRow => fenRowToArray(fenRow));
}

function fenRowToArray(fenRow) {
  return flat(
    [...fenRow].map(fenCharacter =>
      REGEX_FEN_PIECE.test(fenCharacter)
        ? fenCharacterToPiece(fenCharacter)
        : Array(Number(fenCharacter))
            .fill()
            .map(() => null)
    )
  );
}

function fenCharacterToPiece(fenCharacter) {
  return {
    type: fenCharacter.toLowerCase(),
    color: REGEX_FEN_PIECE_WHITE.test(fenCharacter)
      ? PIECE_COLOR.WHITE
      : PIECE_COLOR.BLACK
  };
}

function stateToFen(state) {
  return [
    boardToFen(state.board),
    state.activeColour,
    state.castlingAvailability,
    state.passantTarget,
    state.halfMoveClock.toString(),
    state.fullMoveNumber.toString()
  ].join(" ");
}

function boardToFen(board) {
  const rowSeparator = "/";
  return [...board]
    .reverse()
    .map(row => row.map(piece => pieceToFenDot(piece)))
    .map(fenRowDots => fenRowDotsToFenRow(fenRowDots))
    .join(rowSeparator);
}

function pieceToFenDot(piece) {
  const isEmptySquare = piece === null;
  if (isEmptySquare) {
    return ".";
  }
  return PIECE_COLOR.WHITE === piece.color
    ? piece.type.toUpperCase()
    : piece.type;
}

function fenRowDotsToFenRow(fenRowDots) {
  const initChar = "";
  return [...fenRowDots].reduce((previousChars, currentChar) => {
    if (REGEX_FEN_PIECE.test(currentChar)) {
      return previousChars.concat(currentChar);
    }
    if (previousChars === initChar) {
      return previousChars.concat("1");
    }
    const previousChar = previousChars.slice(-1);
    if (REGEX_FEN_PIECE.test(previousChar)) {
      return previousChars.concat("1");
    }
    return previousChars.slice(0, -1).concat(Number(previousChar) + 1);
  }, initChar);
}

function squareInBoard({ board, algebraicPosition, offset }) {
  const arrayPosition = toArrayPosition(algebraicPosition);
  if (offset) {
    arrayPosition[0] += offset[0];
    arrayPosition[1] += offset[1];
  }
  if (isOverflow({ board, arrayPosition })) {
    return;
  }
  return {
    square: toAlgebraicPosition(arrayPosition),
    piece: board[arrayPosition[0]][arrayPosition[1]]
  };
}

function toArrayPosition(algebraicPosition) {
  const characters = [...algebraicPosition];
  const letter = characters[0];
  const number = characters[1];
  const row = "12345678".indexOf(number);
  const col = "abcdefgh".indexOf(letter);
  return [row, col];
}

function toAlgebraicPosition(arrayPosition) {
  const row = arrayPosition[0];
  const col = arrayPosition[1];
  const letter = "abcdefgh"[col];
  const number = "12345678"[row];
  return `${letter}${number}`;
}

function isOverflow({ board, arrayPosition }) {
  const row = arrayPosition[0];
  const col = arrayPosition[1];
  return (
    row < 0 || row > board.length - 1 || col < 0 || col > board[row].length - 1
  );
}

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
    pieceOffsets.map(offset => moves({ state, square, offset, numMoves }))
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

function moves({ state, square, offset, numMoves }) {
  return movesRecursive({
    state,
    square,
    offset,
    numMoves,
    nextMoves: [],
    currentSquare: square.square
  });
}

function movesRecursive({
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
    : movesRecursive({
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

module.exports = {
  fenToState,
  stateToFen,
  squareInBoard,
  getSquareMoves,
  moveSquare
};
