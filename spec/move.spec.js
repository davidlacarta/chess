import { isEqual } from "../src/utils";
import { Chess } from "../src/chess";

const MOVES = [
  {
    TITLE: "PAWN PASSANT CAPTURE",
    FEN: "rnbqkbnr/ppp2ppp/8/2Ppp3/3QP3/8/PP3PPP/RNB1KBNR w KQkq d6 0 1",
    SQUARE_FROM: "c5",
    SQUARE_TO: "d6",
    RESULT: { type: "p", color: "b" },
    RESULT_FEN: "rnbqkbnr/ppp2ppp/3P4/4p3/3QP3/8/PP3PPP/RNB1KBNR b KQkq - 0 1"
  },
  {
    TITLE: "PAWN WHITE ADVANCE",
    FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    SQUARE_FROM: "e2",
    SQUARE_TO: "e4",
    RESULT: null,
    RESULT_FEN: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
  },
  {
    TITLE: "QUEEN WHITE MOVE",
    FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/8/PP3PPP/RNB1KBNR w KQkq - 0 1",
    SQUARE_FROM: "d4",
    SQUARE_TO: "d3",
    RESULT: null,
    RESULT_FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2P1P3/3Q4/PP3PPP/RNB1KBNR b KQkq - 1 1"
  },
  {
    TITLE: "QUEEN BLACK MOVE",
    FEN: "rnbqkbnr/ppp2ppp/8/3pp3/2PQP3/8/PP3PPP/RNB1KBNR b KQkq - 0 1",
    SQUARE_FROM: "d8",
    SQUARE_TO: "d7",
    RESULT: null,
    RESULT_FEN: "rnb1kbnr/pppq1ppp/8/3pp3/2PQP3/8/PP3PPP/RNB1KBNR w KQkq - 1 2"
  },
  {
    TITLE: "PAWN PROMOTION",
    FEN: "r1bqkbnr/pPp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    SQUARE_FROM: "b7",
    SQUARE_TO: "b8",
    PROMOTION_TYPE: "q",
    RESULT: null,
    RESULT_FEN:
      "rQbqkbnr/p1p2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R b KQkq - 0 4"
  },
  {
    TITLE: "PAWN PROMOTION CAPTURE",
    FEN: "r1bqkbnr/pPp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    SQUARE_FROM: "b7",
    SQUARE_TO: "a8",
    PROMOTION_TYPE: "q",
    RESULT: { type: "r", color: "b" },
    RESULT_FEN:
      "Q1bqkbnr/p1p2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R b KQkq - 0 4"
  }
];

const MOVES_SAN = [
  {
    TITLE: "PAWN WHITE ADVANCE",
    FEN: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    SQUARE_FROM: "e4",
    RESULT: null,
    RESULT_FEN: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
  },
  {
    TITLE: "PAWN BLACK ADVANCE",
    FEN: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
    SQUARE_FROM: "e5",
    RESULT: null,
    RESULT_FEN: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"
  },
  {
    TITLE: "MOVE KNIGHT",
    FEN: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
    SQUARE_FROM: "Nf3",
    RESULT: null,
    RESULT_FEN: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
  },
  {
    TITLE: "MOVE BISHOP AMBIGUOUS COLUMN D",
    FEN: "3r3r/b7/3b4/R7/4Q2Q/8/8/R6Q b KQkq - 0 1",
    SQUARE_FROM: "Bdb8",
    RESULT: null,
    RESULT_FEN: "1b1r3r/b7/8/R7/4Q2Q/8/8/R6Q w KQkq - 1 2"
  },
  {
    TITLE: "MOVE BISHOP AMBIGUOUS COLUMN A",
    FEN: "3r3r/b7/3b4/R7/4Q2Q/8/8/R6Q b KQkq - 0 1",
    SQUARE_FROM: "Bab8",
    RESULT: null,
    RESULT_FEN: "1b1r3r/8/3b4/R7/4Q2Q/8/8/R6Q w KQkq - 1 2"
  },
  {
    TITLE: "MOVE ROOK BLACK AMBIGUOUS COLUMN D",
    FEN: "3r3r/b7/3b4/R7/4Q2Q/8/8/R6Q b KQkq - 0 1",
    SQUARE_FROM: "Rdf8",
    RESULT: null,
    RESULT_FEN: "5r1r/b7/3b4/R7/4Q2Q/8/8/R6Q w KQkq - 1 2"
  },
  {
    TITLE: "MOVE ROOK WHITE AMBIGUOUS ROW 1",
    FEN: "3r3r/b7/3b4/R7/4Q2Q/8/8/R6Q w KQkq - 0 1",
    SQUARE_FROM: "R1a3",
    RESULT: null,
    RESULT_FEN: "3r3r/b7/3b4/R7/4Q2Q/R7/8/7Q b KQkq - 1 1"
  },
  {
    TITLE: "MOVE QUEEN WHITE AMBIGUOUS COLUMN h ROW 1",
    FEN: "3r3r/b7/3b4/R7/4Q2Q/8/8/R6Q w KQkq - 0 1",
    SQUARE_FROM: "Qh4e1",
    RESULT: null,
    RESULT_FEN: "3r3r/b7/3b4/R7/4Q3/8/8/R3Q2Q b KQkq - 1 1"
  },
  {
    TITLE: "KING CASTLING VALID",
    FEN: "r1bqkbnr/pPp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    SQUARE_FROM: "O-O",
    RESULT_FEN:
      "r1bqkbnr/pPp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQ1RK1 b Qkq - 3 4"
  },
  {
    TITLE: "KING CASTLING VALID HALF",
    FEN: "rnbq1rk1/p3bpp1/1p2pn1p/2ppN3/3P3B/2N1P3/PPP1BPPP/R2QK2R w KQ c6 0 9",
    SQUARE_FROM: "e1g1",
    RESULT_FEN:
      "rnbq1rk1/p3bpp1/1p2pn1p/2ppN3/3P3B/2N1P3/PPP1BPPP/R2Q1RK1 b Q - 1 9"
  },
  {
    TITLE: "PAWN PASSANT CAPTURE",
    FEN: "rnbqkbnr/ppp2ppp/8/2Ppp3/3QP3/8/PP3PPP/RNB1KBNR w KQkq d6 0 1",
    SQUARE_FROM: "cxd6",
    RESULT: { type: "p", color: "b" },
    RESULT_FEN: "rnbqkbnr/ppp2ppp/3P4/4p3/3QP3/8/PP3PPP/RNB1KBNR b KQkq - 0 1"
  },
  {
    TITLE: "PAWN PROMOTION",
    FEN: "r1bqkbnr/pPp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    SQUARE_FROM: "b8Q",
    RESULT: null,
    RESULT_FEN:
      "rQbqkbnr/p1p2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R b KQkq - 0 4"
  },
  {
    TITLE: "PAWN PROMOTION CAPTURE",
    FEN: "r1bqkbnr/pPp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    SQUARE_FROM: "bxa8Q",
    RESULT: { type: "r", color: "b" },
    RESULT_FEN:
      "Q1bqkbnr/p1p2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R b KQkq - 0 4"
  }
];

const MOVES_INVALID = [
  {
    TITLE: "PAWN PASSANT CAPTURE INVALID",
    FEN: "rnbqkbnr/ppp2ppp/8/2Ppp3/3QP3/8/PP3PPP/RNB1KBNR w KQkq - 0 1",
    SQUARE_FROM: "c5",
    SQUARE_TO: "d6",
    TRHOW: "move invalid"
  },
  {
    TITLE: "KNIGTH MOVE INVALID",
    FEN: "rnbqkb1r/ppp2ppp/8/2Ppn3/3PQ3/8/PP3PPP/RNB1KBNR b KQkq - 0 1",
    SQUARE_FROM: "e5",
    SQUARE_TO: "d3",
    TRHOW: "target king"
  },
  {
    TITLE: "PAWN PROMOTION PROMOTION TYPE INVALID",
    FEN: "r1bqkbnr/pPp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
    SQUARE_FROM: "b7",
    SQUARE_TO: "b8",
    PROMOTION_TYPE: "p",
    TRHOW: "promotion type required"
  }
];

const MOVES_INVALID_SAN = [
  {
    TITLE: "MOVE BISHOP AMBIGUOUS COLUMN A",
    FEN: "3r3r/b7/3b4/R7/4Q2Q/8/8/R6Q b KQkq - 0 1",
    SQUARE_FROM: "Bb8",
    TRHOW: "Invalid SAN, amibiguous piece: d6,a7"
  }
];

describe("Move", function() {
  it("should perform movement", function() {
    [...MOVES, ...MOVES_SAN].forEach(movement => {
      testMove(new Chess(movement.FEN), movement);
    });
  });

  it("should throw exception", function() {
    [...MOVES_INVALID, ...MOVES_INVALID_SAN].forEach(movement => {
      const chess = new Chess(movement.FEN);
      try {
        chess.move(
          movement.SQUARE_FROM,
          movement.SQUARE_TO,
          movement.PROMOTION_TYPE
        );
      } catch (e) {
        expect(e === movement.TRHOW).toBeTruthy(
          ["", `expect: ${movement.TRHOW}`, `actual: ${e}`, ""].join("\n")
        );
      }
      expect(chess.toFen() === movement.FEN).toBeTruthy();
    });
  });
});

function testMove(chess, movement) {
  const result = chess.move(
    movement.SQUARE_FROM,
    movement.SQUARE_TO,
    movement.PROMOTION_TYPE
  );
  const fenResult = chess.toFen();
  expect(
    isEqual(result, movement.RESULT) && movement.RESULT_FEN === fenResult
  ).toBeTruthy(
    [
      "",
      `${chess.toAscii(true)}`,
      `${movement.TITLE} - FROM: ${movement.SQUARE_FROM}, TO: ${
        movement.SQUARE_TO
      }`,
      `expected: ${JSON.stringify(movement.RESULT)}, current: ${JSON.stringify(
        result
      )}`,
      `FEN expect: ${movement.RESULT_FEN}`,
      `FEN result: ${fenResult}`,
      ""
    ].join("\n")
  );
}
