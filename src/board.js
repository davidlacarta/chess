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
  if (!square || square.piece === null) {
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
  const { board, passantTarget } = state;
  const moves = getSquareMoves({
    state,
    algebraicPosition: algebraicPositionFrom
  });
  if (!moves.find(move => move.square === algebraicPositionTo)) {
    throw "move invalid";
  }
  const arrayPositionFrom = toArrayPosition(algebraicPositionFrom);
  const arrayPositionTo = toArrayPosition(algebraicPositionTo);

  const squareFrom = board[arrayPositionFrom[0]][arrayPositionFrom[1]];
  const squareTo = board[arrayPositionTo[0]][arrayPositionTo[1]];

  board[arrayPositionFrom[0]][arrayPositionFrom[1]] = null;
  board[arrayPositionTo[0]][arrayPositionTo[1]] = squareFrom;

  const squareToIsPassant = algebraicPositionTo === passantTarget;
  if (isPawn(squareFrom) && squareToIsPassant) {
    const offset = squareFrom.color === PIECE_COLOR.WHITE ? -1 : 1;
    const squareCaptured =
      board[arrayPositionTo[0] + offset][arrayPositionTo[1]];
    board[arrayPositionTo[0] + offset][arrayPositionTo[1]] = null;
    return squareCaptured;
  }

  return squareTo;
}

module.exports = {
  fenToState,
  stateToFen,
  squareInBoard,
  getSquareMoves,
  moveSquare
};
