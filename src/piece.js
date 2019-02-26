const PIECE_COLOR = {
  WHITE: "w",
  BLACK: "b"
};

const PIECE_OFFSETS_CROSS = offsetCombinations([0, 1]);
const PIECE_OFFSETS_DIAGONAL = offsetCombinations([1, 1]);
const PIECE_OFFSETS_KNIGHT = offsetCombinations([1, 2]);

const PAWN_OFFSETS = {
  w: [[1, 0], [1, -1], [1, 1]],
  b: [[-1, 0], [-1, -1], [-1, 1]]
};

const PIECE_OFFSETS = {
  n: PIECE_OFFSETS_KNIGHT,
  b: PIECE_OFFSETS_DIAGONAL,
  r: PIECE_OFFSETS_CROSS,
  q: [...PIECE_OFFSETS_CROSS, ...PIECE_OFFSETS_DIAGONAL],
  k: [...PIECE_OFFSETS_CROSS, ...PIECE_OFFSETS_DIAGONAL]
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

const CASTLING = {
  k: { king: { from: "e", to: "g" }, rook: { from: "h", to: "f" } },
  q: { king: { from: "e", to: "c" }, rook: { from: "a", to: "d" } }
};

const CASTLING_SAFE = {
  k: ["e", "f", "g"],
  q: ["b", "c", "d", "e"]
};

function offsetCombinations(offset) {
  const reverseRow = [offset[0] * -1, offset[1]];
  const reverseCol = [offset[0], offset[1] * -1];
  const reverseRowCol = [offset[0] * -1, offset[1] * -1];
  const reverseInverse = [offset, reverseRow, reverseCol, reverseRowCol].map(
    offsetCombination => [offsetCombination[1], offsetCombination[0]]
  );
  return removeDuplicates([
    offset,
    reverseRow,
    reverseCol,
    reverseRowCol,
    ...reverseInverse
  ]);
}

function removeDuplicates(offsets) {
  return offsets.reduce((previous, current) => {
    const isAdded = previous.find(
      element => element[0] === current[0] && element[1] === current[1]
    );
    return isAdded ? previous : previous.concat([current]);
  }, []);
}

function isPawn(piece) {
  return piece && piece.type === "p";
}

module.exports = {
  PIECE_COLOR,
  PIECE_OFFSETS,
  PIECE_OFFSETS_NUM_MOVES,
  PAWN_OFFSETS,
  CASTLING,
  CASTLING_TYPE,
  CASTLING_SAFE,
  isPawn
};
