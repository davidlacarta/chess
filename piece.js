const PIECE_COLOR = {
  WHITE: "w",
  BLACK: "b"
};

const PIECE_OFFSETS_CROSS = offsetCombinations([0, 1]);
const PIECE_OFFSETS_DIAGONAL = offsetCombinations([1, 1]);
const PIECE_OFFSETS_KNIGHT = offsetCombinations([1, 2]);

const PIECE_OFFSETS = {
  n: PIECE_OFFSETS_KNIGHT,
  b: PIECE_OFFSETS_DIAGONAL,
  r: PIECE_OFFSETS_CROSS,
  q: [...PIECE_OFFSETS_CROSS, ...PIECE_OFFSETS_DIAGONAL],
  k: [...PIECE_OFFSETS_CROSS, ...PIECE_OFFSETS_DIAGONAL]
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

module.exports = { PIECE_COLOR, PIECE_OFFSETS };
