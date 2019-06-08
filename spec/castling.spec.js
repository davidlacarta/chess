const { Chess } = require("../src/chess");

const CASTLINGS_KING = [
  {
    TITLE: "KING CASTLING VALID",
    FEN: "r1bqkbnr/pPp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    RESULT_FEN:
      "r1bqkbnr/pPp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQ1RK1 b Qkq - 3 4"
  }
];

const CASTLINGS_INVALID = [
  {
    TITLE: "KING CASTLING VALID",
    FEN: "r1bqk1nr/ppp2ppp/2np4/4p3/2B5/4PN2/PPPP1PbP/RNBQK2R w KQkq - 2 4"
  }
];

describe("Castling", function() {
  it("should castling king", function() {
    CASTLINGS_KING.forEach(movement => {
      testCastlingKing(new Chess(movement.FEN), movement);
    });
  });

  it("should throw exception castling target", function() {
    CASTLINGS_INVALID.forEach(movement => {
      const chess = new Chess(movement.FEN);
      expect(() => chess.castlingKing()).toThrow("castling target");
    });
  });
});

function testCastlingKing(chess, movement) {
  chess.castlingKing();
  const fenResult = chess.toFen();
  const isEqual = movement.RESULT_FEN === fenResult;
  expect(isEqual).toBeTruthy(
    [
      "",
      `${chess.toAscii(true)}`,
      `${movement.TITLE}`,
      `FEN expect: ${movement.RESULT_FEN}`,
      `FEN result: ${fenResult}`,
      ""
    ].join("\n")
  );
}
