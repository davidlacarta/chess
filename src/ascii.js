const { PIECE_COLOR } = require("./piece");

const FEN_PIECE_ASCII = {
  K: "\u2654", // ♔
  Q: "\u2655", // ♕
  R: "\u2656", // ♖
  B: "\u2657", // ♗
  N: "\u2658", // ♘
  P: "\u2659", // ♙
  k: "\u265A", // ♚
  q: "\u265B", // ♛
  r: "\u265C", // ♜
  b: "\u265D", // ♝
  n: "\u265E", // ♞
  p: "\u265F" // ♟
};

function boardToAscii(board, showAlgebraic) {
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
    return ".";
  }
  return piece.color === PIECE_COLOR.WHITE
    ? FEN_PIECE_ASCII[piece.type.toUpperCase()]
    : FEN_PIECE_ASCII[piece.type];
}

module.exports = { boardToAscii };
