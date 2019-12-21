[![Build Status](https://travis-ci.org/davidlacarta/chess.svg?branch=master)](https://travis-ci.org/davidlacarta/chess)
[![npm version](https://img.shields.io/badge/npm-chess--base-blue.svg)](https://www.npmjs.com/package/chess-base)

# Chess board

Chess board logic

```js
const chess = new Chess();
```

```js
const chess = new Chess(
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
);

chess.toFen();

// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

chess.getSquare("e2");

// { square: 'e2', piece: { type: 'p', color: 'w' } }

chess.getMoves("b1");

// [{ square: "c3", piece: null }, { square: "a3", piece: null }];

chess.move("e2", "e4");
chess.toAscii();

// ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
// ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟
//
//
//         ♙
//
// ♙ ♙ ♙ ♙   ♙ ♙ ♙
// ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖
```

```js
const chess = new Chess();

chess.move("e4"); // SAN (Standard Algebraic Notation)
chess.toAscii();

// ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
// ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟
//
//
//         ♙
//
// ♙ ♙ ♙ ♙   ♙ ♙ ♙
// ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖
```

```js
const chess = new Chess(
  "r1bqkbnr/ppp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4"
);

chess.toAscii();

// ♜   ♝ ♛ ♚ ♝ ♞ ♜
// ♟ ♟ ♟     ♟ ♟ ♟
//     ♞ ♟
//         ♟
//     ♗
//         ♙ ♘
// ♙ ♙ ♙ ♙   ♙ ♙ ♙
// ♖ ♘ ♗ ♕ ♔     ♖

chess.castlingKing();
chess.toAscii();

// ♜   ♝ ♛ ♚ ♝ ♞ ♜
// ♟ ♟ ♟     ♟ ♟ ♟
//     ♞ ♟
//         ♟
//     ♗
//         ♙ ♘
// ♙ ♙ ♙ ♙   ♙ ♙ ♙
// ♖ ♘ ♗ ♕   ♖ ♔

chess.castlingQueen();

// throw "castling invalid";
```

```js
const chess = new Chess(
  "r1bqkbnr/ppp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4"
);

chess.toAscii();

// ♜   ♝ ♛ ♚ ♝ ♞ ♜
// ♟ ♟ ♟     ♟ ♟ ♟
//     ♞ ♟
//         ♟
//     ♗
//         ♙ ♘
// ♙ ♙ ♙ ♙   ♙ ♙ ♙
// ♖ ♘ ♗ ♕ ♔     ♖

chess.target("e1");

// false

chess.target("e5");

// true

chess.targetKing();

// false
```

```js
const chess = new Chess();

chess.getMovesTurn();

// [ { piece: { type: 'n', color: 'w' },
//     from: 'b1',
//     to: 'c3',
//     capture: null },
//   { piece: { type: 'n', color: 'w' },
//     from: 'b1',
//     to: 'a3',
//     capture: null },
//   { piece: { type: 'n', color: 'w' },
//     from: 'g1',
//     to: 'h3',
//     capture: null },
//   { piece: { type: 'n', color: 'w' },
//     from: 'g1',
//     to: 'f3',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'a2',
//     to: 'a3',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'a2',
//     to: 'a4',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'b2',
//     to: 'b3',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'b2',
//     to: 'b4',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'c2',
//     to: 'c3',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'c2',
//     to: 'c4',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'd2',
//     to: 'd3',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'd2',
//     to: 'd4',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'e2',
//     to: 'e3',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'e2',
//     to: 'e4',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'f2',
//     to: 'f3',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'f2',
//     to: 'f4',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'g2',
//     to: 'g3',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'g2',
//     to: 'g4',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'h2',
//     to: 'h3',
//     capture: null },
//   { piece: { type: 'p', color: 'w' },
//     from: 'h2',
//     to: 'h4',
//     capture: null } ]
```
