import { PIECE_COLOR } from "./piece";
import { flat } from "./utils";

const REGEX_FEN_PIECE = /(r|n|b|q|k|p)/i;
const REGEX_FEN_PIECE_WHITE = /(R|N|B|Q|K|P)/;

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

function setPiece({ board, piece, algebraicPosition }) {
  const arrayPosition = toArrayPosition(algebraicPosition);
  board[arrayPosition[0]][arrayPosition[1]] = piece;
}

function toArrayPosition(algebraicPosition) {
  const [letter, number] = algebraicPosition;
  const row = "12345678".indexOf(number);
  const col = "abcdefgh".indexOf(letter);
  return [row, col];
}

function toAlgebraicPosition(arrayPosition) {
  const [row, col] = arrayPosition;
  const letter = "abcdefgh"[col];
  const number = "12345678"[row];
  return `${letter}${number}`;
}

function isOverflow({ board, arrayPosition }) {
  const [row, col] = arrayPosition;
  return row < 0 || row > 7 || col < 0 || col > 7;
}

export {
  flat,
  fenToState,
  stateToFen,
  squareInBoard,
  setPiece,
  toArrayPosition,
  toAlgebraicPosition
};
