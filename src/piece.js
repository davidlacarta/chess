const PIECE_COLOR = {
  WHITE: "w",
  BLACK: "b"
};

const PIECE_TYPE = {
  PAWN: "p",
  KNIGHT: "n",
  BISHOP: "b",
  ROOK: "r",
  QUEEN: "q",
  KING: "k"
};

const OFFSETS_CROSS = [[0, 1], [0, -1], [1, 0], [-1, 0]];
const OFFSETS_DIAGONAL = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
const OFFSETS_KNIGHT = [
  [1, 2],
  [-1, 2],
  [1, -2],
  [-1, -2],
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1]
];

const PIECE_OFFSETS = {
  n: OFFSETS_KNIGHT,
  b: OFFSETS_DIAGONAL,
  r: OFFSETS_CROSS,
  q: [...OFFSETS_CROSS, ...OFFSETS_DIAGONAL],
  k: [...OFFSETS_CROSS, ...OFFSETS_DIAGONAL]
};

const PAWN_PROMOTION = {
  w: 8,
  b: 1
};

const PAWN_START = {
  w: 2,
  b: 7
};

const PAWN_OFFSETS = {
  w: [[1, 0], [1, -1], [1, 1]],
  b: [[-1, 0], [-1, -1], [-1, 1]]
};

const PIECE_OFFSETS_NUM_MOVES = {
  n: 1,
  b: -1,
  r: -1,
  q: -1,
  k: 1
};

const CASTLING_TYPE = {
  KING: "k",
  QUEEN: "q"
};

const CASTLING_COLUMN_MOVES = {
  k: { king: { from: "e", to: "g" }, rook: { from: "h", to: "f" } },
  q: { king: { from: "e", to: "c" }, rook: { from: "a", to: "d" } }
};

const CASTLING_COLUMN_SAFE = {
  k: ["e", "f", "g"],
  q: ["c", "d", "e"]
};

function castlingMoves({ activeColour, castlingType }) {
  const castlingRow = PIECE_COLOR.WHITE === activeColour ? "1" : "8";

  const {
    king: { from: kingFrom, to: kingTo },
    rook: { from: rookFrom, to: rookTo }
  } = CASTLING_COLUMN_MOVES[castlingType];

  return {
    king: { from: `${kingFrom}${castlingRow}`, to: `${kingTo}${castlingRow}` },
    rook: { from: `${rookFrom}${castlingRow}`, to: `${rookTo}${castlingRow}` }
  };
}

function castlingSafeSquares({ activeColour, castlingType }) {
  const castlingRow = PIECE_COLOR.WHITE === activeColour ? "1" : "8";

  return CASTLING_COLUMN_SAFE[castlingType].map(
    square => `${square}${castlingRow}`
  );
}

function isPawn(piece) {
  return piece && piece.type === PIECE_TYPE.PAWN;
}

function inverseColor(rightColor) {
  return PIECE_COLOR.WHITE === rightColor
    ? PIECE_COLOR.BLACK
    : PIECE_COLOR.WHITE;
}

export {
  PIECE_COLOR,
  PIECE_TYPE,
  PIECE_OFFSETS,
  PIECE_OFFSETS_NUM_MOVES,
  PAWN_OFFSETS,
  PAWN_PROMOTION,
  PAWN_START,
  CASTLING_TYPE,
  isPawn,
  inverseColor,
  castlingMoves,
  castlingSafeSquares
};
