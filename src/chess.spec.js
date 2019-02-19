describe("Chess", function() {
  const { Chess } = require("./chess");
  let chess;

  it("should return queen movements", function() {
    const movement = MOVEMENT["QUEEN"];
    testGetMoves(new Chess(movement.FEN), movement);
  });

  it("should return knight movements", function() {
    const movement = MOVEMENT["KNIGHT"];
    testGetMoves(new Chess(movement.FEN), movement);
  });
});

function testGetMoves(chess, movement) {
  const moves = chess.getMoves(movement.SQUARE);
  expect(moves).not.toBeUndefined();
  expect(moves.length).not.toEqual(0);
  movement.MOVES.forEach(moveExpected =>
    expect(moves.find(move => moveIsEqual(move, moveExpected))).toBeTruthy()
  );
}

function moveIsEqual(moveA, moveB) {
  const equalSquare = moveA.square === moveB.square;
  const pieceEmpty = moveA.piece === null && moveB.piece === null;
  const pieceNotEmpty = moveA.piece !== null && moveB.piece !== null;
  return (
    equalSquare &&
    (pieceEmpty ||
      (pieceNotEmpty &&
        moveA.piece.type === moveB.piece.type &&
        moveA.piece.color === moveB.piece.color))
  );
}

const MOVEMENT = {
  QUEEN: {
    FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/8/PPP2PPP/RNB1KBNR",
    SQUARE: "d4",
    MOVES: [
      { square: "d3", piece: null },
      { square: "d2", piece: null },
      { square: "d1", piece: null },
      { square: "d5", piece: { type: "p", color: "b" } },
      { square: "e3", piece: null },
      { square: "e5", piece: { type: "p", color: "b" } },
      { square: "c3", piece: null },
      { square: "c5", piece: null },
      { square: "b6", piece: null },
      { square: "a7", piece: { type: "p", color: "b" } }
    ]
  },
  KNIGHT: {
    FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/8/PPP2PPP/RNB1KBNR",
    SQUARE: "b1",
    MOVES: [
      { square: "a3", piece: null },
      { square: "c3", piece: null },
      { square: "d2", piece: null }
    ]
  }
};
