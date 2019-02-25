describe("Chess", function() {
  const { Chess } = require("./chess");

  it("should return movements", function() {
    MOVEMENTS.forEach(movement => {
      testGetMoves(new Chess(movement.FEN), movement);
    });
  });

  it("should return piece to", function() {
    MOVEMENTS_MOVE.forEach(movement => {
      testMove(new Chess(movement.FEN), movement);
    });
  });

  it("should throw exception", function() {
    MOVEMENTS_MOVE_INVALID.forEach(movement => {
      testMoveInvalid(new Chess(movement.FEN), movement);
    });
  });
});

function testMove(chess, movement) {
  const result = chess.move(movement.SQUARE_FROM, movement.SQUARE_TO);
  expect(pieceIsEqual(result, movement.RESULT)).toBeTruthy(
    [
      "",
      `${chess.toAscii(true)}`,
      `${movement.TITLE} - FROM: ${movement.SQUARE_FROM}, TO: ${
        movement.SQUARE_TO
      }`,
      `expected: ${JSON.stringify(movement.RESULT)}, current: ${JSON.stringify(
        result
      )}`,
      ""
    ].join("\n")
  );
}

function testMoveInvalid(chess, movement) {
  expect(() => chess.move(movement.SQUARE_FROM, movement.SQUARE_TO)).toThrow(
    "move invalid"
  );
}

function testGetMoves(chess, movement) {
  const moves = chess.getMoves(movement.SQUARE);
  expect(moves).not.toBeUndefined();
  const expectedsNotFound = notFounds(movement.MOVES, moves);
  const currentsNotFound = notFounds(moves, movement.MOVES);
  expect(expectedsNotFound.length === 0).toBeTruthy(
    notFoundsOutput(
      chess,
      movement,
      expectedsNotFound,
      "Expecteds not found in currents:"
    )
  );
  expect(currentsNotFound.length === 0).toBeTruthy(
    notFoundsOutput(
      chess,
      movement,
      currentsNotFound,
      "Currents not found in expecteds:"
    )
  );
}

function notFoundsOutput(chess, movement, notFounds, notFoundsOutput) {
  return [
    "",
    `${chess.toAscii(true)}`,
    `${movement.TITLE}: ${movement.SQUARE}`,
    `${notFoundsOutput}`,
    `${JSON.stringify(notFounds)}`,
    ""
  ].join("\n");
}

function notFounds(movesA, movesB) {
  return movesA.filter(moveA => !moveIsContained(movesB, moveA));
}

function moveIsContained(moves, moveContained) {
  return moves.find(move => moveIsEqual(move, moveContained));
}

function moveIsEqual(moveA, moveB) {
  if (!moveA && !moveB) {
    return true;
  }
  if (!moveA || !moveB) {
    return false;
  }
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

function pieceIsEqual(pieceA, pieceB) {
  if (!pieceA && !pieceB) {
    return true;
  }

  if (!pieceA || !pieceA) {
    return false;
  }
  const equalType = pieceA.type === pieceB.type;
  const equalColor = pieceA.color === pieceB.color;
  return equalType && equalColor;
}

const MOVEMENTS = [
  {
    TITLE: "QUEEN",
    FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/8/PP3PPP/RNB1KBNR w KQkq - 0 1",
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
  {
    TITLE: "KNIGTH",
    FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/8/PP3PPP/RNB1KBNR w KQkq - 0 1",
    SQUARE: "b1",
    MOVES: [
      { square: "a3", piece: null },
      { square: "c3", piece: null },
      { square: "d2", piece: null }
    ]
  },
  {
    TITLE: "PAWN WHITE INIT",
    FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/8/PP3PPP/RNB1KBNR w KQkq - 0 1",
    SQUARE: "b2",
    MOVES: [{ square: "b3", piece: null }, { square: "b4", piece: null }]
  },
  {
    TITLE: "PAWN WHITE ONE MOVE",
    FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/1P6/P4PPP/RNB1KBNR w KQkq - 0 1",
    SQUARE: "b3",
    MOVES: [{ square: "b4", piece: null }]
  },
  {
    TITLE: "PAWN BLACK INIT",
    FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/8/PP3PPP/RNB1KBNR w KQkq - 0 1",
    SQUARE: "a7",
    MOVES: [{ square: "a6", piece: null }, { square: "a5", piece: null }]
  },
  {
    TITLE: "PAWN BLACK ONE MOVE",
    FEN: "rnbqkbnr/1pp2ppp/p7/3pp3/2PQP3/8/PP3PPP/RNB1KBNR w KQkq - 0 1",
    SQUARE: "a6",
    MOVES: [{ square: "a5", piece: null }]
  },
  {
    TITLE: "PAWN BLACK INIT BLOCK",
    FEN: "r1bqkbnr/ppp2ppp/n7/3pp3/2PQP3/8/PP3PPP/RNB1KBNR w KQkq - 0 1",
    SQUARE: "a7",
    MOVES: []
  },
  {
    TITLE: "PAWN WHITE CAPTURE",
    FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/8/PP3PPP/RNB1KBNR w KQkq - 0 1",
    SQUARE: "e4",
    MOVES: [{ square: "d5", piece: { type: "p", color: "b" } }]
  },
  {
    TITLE: "PAWN WHITE CAPTURE AND ADVANCE",
    FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/8/PP3PPP/RNB1KBNR w KQkq - 0 1",
    SQUARE: "c4",
    MOVES: [
      { square: "d5", piece: { type: "p", color: "b" } },
      { square: "c5", piece: null }
    ]
  },
  {
    TITLE: "PAWN BLACK CAPTURE AND CAPTURE",
    FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/8/PP3PPP/RNB1KBNR w KQkq - 0 1",
    SQUARE: "d5",
    MOVES: [
      { square: "c4", piece: { type: "p", color: "w" } },
      { square: "e4", piece: { type: "p", color: "w" } }
    ]
  },
  {
    TITLE: "PAWN WHITE ADVANCE AND PASSANT",
    FEN: "rnbqkbnr/ppp2ppp/8/2Ppp3/3QP3/8/PP3PPP/RNB1KBNR w KQkq d6 0 1",
    SQUARE: "c5",
    MOVES: [{ square: "c6", piece: null }, { square: "d6", piece: null }]
  }
];

const MOVEMENTS_MOVE = [
  {
    TITLE: "PAWN PASSANT CAPTURE",
    FEN: "rnbqkbnr/ppp2ppp/8/2Ppp3/3QP3/8/PP3PPP/RNB1KBNR w KQkq d6 0 1",
    SQUARE_FROM: "c5",
    SQUARE_TO: "d6",
    RESULT: { type: "p", color: "b" }
  }
];

const MOVEMENTS_MOVE_INVALID = [
  {
    TITLE: "PAWN PASSANT CAPTURE INVALID",
    FEN: "rnbqkbnr/ppp2ppp/8/2Ppp3/3QP3/8/PP3PPP/RNB1KBNR w KQkq - 0 1",
    SQUARE_FROM: "c5",
    SQUARE_TO: "d6"
  }
];
