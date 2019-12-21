import { Chess } from "../src/chess";

const CASTLINGS_KING = [
  {
    TITLE: "KING CASTLING VALID",
    FEN: "r1bqkbnr/pPp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    RESULT_FEN:
      "r1bqkbnr/pPp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQ1RK1 b kq - 3 4"
  },
];

const CASTLINGS_QUEEN = [
  {
    TITLE: "QUEEN CASTLING VALID",
    FEN: "1r2k2r/ppp2ppp/8/3N1b2/3n4/8/PP2PPPP/R3KB1R w KQk - 0 13",
    RESULT_FEN:
      "1r2k2r/ppp2ppp/8/3N1b2/3n4/8/PP2PPPP/2KR1B1R b k - 1 13"
  }
];

const CASTLINGS_INVALID = [
  {
    TITLE: "KING CASTLING VALID",
    FEN: "r1bqk1nr/ppp2ppp/2np4/4p3/2B5/4PN2/PPPP1PbP/RNBQK2R w KQkq - 2 4"
  }
];

describe("Castling", function() {
  CASTLINGS_KING.forEach(movement => {
    it("should castling king", function() {
      const chess = new Chess(movement.FEN);
      chess.castlingKing();
      testCastlingKing(chess, movement);
    });
  });

  CASTLINGS_QUEEN.forEach(movement => {
    it("should castling queen", function() {
      const chess = new Chess(movement.FEN);
      chess.castlingQueen();
      testCastlingKing(chess, movement);
    });
  });

  CASTLINGS_INVALID.forEach(movement => {
    it("should throw exception castling target", function() {
      const chess = new Chess(movement.FEN);
      expect(() => chess.castlingKing()).toThrow("castling target");
    });
  });
});

function testCastlingKing(chess, movement) {
  const fenResult = chess.toFen();
  const isEqual = fenResult === movement.RESULT_FEN;

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
