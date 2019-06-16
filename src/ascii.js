import { PIECE_COLOR } from "./piece";

const FEN_PIECE_ASCII = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟"
};

function boardToAscii({ board, showAlgebraic }) {
  const colSeparator = " ";
  const rowSeparator = "\n";
  return [...board]
    .reverse()
    .map(row => row.map(piece => pieceToAscii(piece)))
    .map((row, i, rows) =>
      showAlgebraic
        ? `${rows.length - i}  ${row.join(colSeparator)}`
        : row.join(colSeparator)
    )
    .join(rowSeparator)
    .concat(showAlgebraic ? "\n                  " : "")
    .concat(showAlgebraic ? "\n   a b c d e f g h" : "");
}

function pieceToAscii(piece) {
  const isEmptySquare = piece === null;
  if (isEmptySquare) {
    return " ";
  }

  const asciiKey =
    piece.color === PIECE_COLOR.WHITE ? piece.type.toUpperCase() : piece.type;

  return FEN_PIECE_ASCII[asciiKey];
}

export { boardToAscii };
