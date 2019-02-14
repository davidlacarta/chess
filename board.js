const { PIECE_COLOR } = require("./piece");

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

function squareInBoard(algebraicPosition, board) {
  const characters = [...algebraicPosition];
  const letter = characters[0];
  const number = characters[1];
  const square = {
    row: 8 - number,
    col: "abcdefgh".indexOf(letter)
  };
  return board[square.row][square.col];
}

module.exports = { fenToBoard, boardToFen, squareInBoard };
