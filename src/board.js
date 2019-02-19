const {
  PIECE_COLOR,
  PIECE_OFFSETS,
  PIECE_OFFSETS_ONE_MOVE
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
    arrayPosition[0] += offset[0];
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
  const pieceOffsets = PIECE_OFFSETS[square.piece.type];
  const oneMove = PIECE_OFFSETS_ONE_MOVE[square.piece.type];
  return flat(
    pieceOffsets.map(offset => moves(board, square, offset, oneMove))
  );
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
  const nextSquare = squareInBoard(board, currentSquare, offset);

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

module.exports = { fenToBoard, boardToFen, squareInBoard, getSquareMoves };
