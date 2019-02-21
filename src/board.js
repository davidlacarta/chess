const {
  PIECE_COLOR,
  PIECE_OFFSETS,
  PIECE_OFFSETS_NUM_MOVES,
  PAWN_OFFSETS_NUM_MOVES,
  PAWN_OFFSETS,
  getPawnNumMovesType,
  isPawn
} = require("./piece");

const REGEX_FEN_PIECE = /(r|n|b|q|k|p)/i;
const REGEX_FEN_PIECE_WHITE = /(R|N|B|Q|K|P)/;

function flat(array) {
  return [].concat.apply([], array);
}

/**
 * Forsyth–Edwards Notation (FEN) is a standard notation for describing a particular board position of a chess game
 * https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
 *
 * Here is the FEN for the starting position:
 * rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
 */
function fenToBoard(fenPosition) {
  const fenRows = fenPosition.split(" ")[0].split("/");
  return fenRows.map(fenRow => fenRowToArray(fenRow));
}

function fenRowToArray(fenRow) {
  return flat(
    [...fenRow].map(fenCharacter =>
      REGEX_FEN_PIECE.test(fenCharacter)
        ? fenCharacterToPiece(fenCharacter)
        : Array(Number(fenCharacter))
            .fill()
            .map((_, i) => null)
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

function boardToFen(board) {
  const rowSeparator = "/";
  return [...board]
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

function squareInBoard(board, algebraicPosition, offset) {
  const arrayPosition = toArrayPosition(algebraicPosition);
  if (offset) {
    arrayPosition[0] -= offset[0];
    arrayPosition[1] += offset[1];
  }
  if (isOverflow(board, arrayPosition)) {
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
  const row = 8 - number; // row reverse
  const col = "abcdefgh".indexOf(letter);
  return [row, col];
}

function toAlgebraicPosition(arrayPosition) {
  const row = arrayPosition[0];
  const col = arrayPosition[1];
  const number = 8 - row; // row reverse
  const letter = "abcdefgh"[col];
  return `${letter}${number}`;
}

function isOverflow(board, arrayPosition) {
  const row = arrayPosition[0];
  const col = arrayPosition[1];
  return (
    row < 0 || row > board.length - 1 || col < 0 || col > board[row].length - 1
  );
}

function getSquareMoves(board, algebraicPosition) {
  const square = squareInBoard(board, algebraicPosition);
  if (!square || square.piece === null) {
    return [];
  }
  const pieceOffsets = isPawn(square.piece)
    ? PAWN_OFFSETS[square.piece.color]
    : PIECE_OFFSETS[square.piece.type];
  const numMoves = isPawn(square.piece)
    ? PAWN_OFFSETS_NUM_MOVES[getPawnNumMovesType(square)]
    : PIECE_OFFSETS_NUM_MOVES[square.piece.type];
  return flat(
    pieceOffsets.map(offset => moves(board, square, offset, numMoves))
  );
}

function moves(board, square, offset, numMoves) {
  return movesRecursive(board, square, offset, numMoves, [], square.square);
}

function movesRecursive(
  board,
  square,
  offset,
  numMoves,
  nextMoves,
  currentSquare
) {
  const nextSquare = squareInBoard(board, currentSquare, offset);
  if (moveIsValid(square, nextSquare)) {
    nextMoves.push(nextSquare);
  }
  return moveIsLast(nextMoves, nextSquare, numMoves)
    ? nextMoves
    : movesRecursive(
        board,
        square,
        offset,
        numMoves,
        nextMoves,
        nextSquare.square
      );
}

function moveIsValid(square, nextSquare) {
  const nextSquareIsPlaced = nextSquare && nextSquare.piece !== null;
  const nextSquareIsEmpty = nextSquare && nextSquare.piece === null;
  const nextPieceIsCapture =
    nextSquareIsPlaced && nextSquare.piece.color !== square.piece.color;
  return isPawn(square.piece)
    ? nextSquare && !nextSquareIsPlaced
    : nextSquareIsEmpty || nextPieceIsCapture;
}

function moveIsLast(nextMoves, nextSquare, numMoves) {
  const nextSquareIsPlaced = nextSquare && nextSquare.piece !== null;
  const numMovesCompleted = numMoves !== -1 && nextMoves.length === numMoves;
  return !nextSquare || nextSquareIsPlaced || numMovesCompleted;
}

function moveSquare(board, algebraicPositionFrom, algebraicPositionTo) {
  const moves = getSquareMoves(board, algebraicPositionFrom);
  if (!moves.find(move => move.square === algebraicPositionTo)) {
    throw "move invalid";
  }
  const arrayPositionFrom = toArrayPosition(algebraicPositionFrom);
  const arrayPositionTo = toArrayPosition(algebraicPositionTo);

  const squareFrom = board[arrayPositionFrom[0]][arrayPositionFrom[1]];
  const squareTo = board[arrayPositionTo[0]][arrayPositionTo[1]];

  board[arrayPositionFrom[0]][arrayPositionFrom[1]] = null;
  board[arrayPositionTo[0]][arrayPositionTo[1]] = squareFrom;

  return squareTo;
}

module.exports = {
  fenToBoard,
  boardToFen,
  squareInBoard,
  getSquareMoves,
  moveSquare
};
