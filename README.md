[![Build Status](https://travis-ci.org/davidlacarta/chess.svg?branch=master)](https://travis-ci.org/davidlacarta/chess)
[![npm version](https://img.shields.io/badge/npm-chess--base-blue.svg)](https://www.npmjs.com/package/chess-base)

# Chess board

Chess board logic

Start

```
const chess = new Chess();
```

Start with fen position

```
const chess = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
```

Fen position

```
const chess = new Chess();
chess.toFen();

// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

Get square

```
const chess = new Chess();
chess.getSquare();

// { square: 'e2', piece: { type: 'p', color: 'w' } }
```

Movements available

```
const chess = new Chess();
chess.getMoves("b1");

// [ { square: 'c3', piece: null }, { square: 'a3', piece: null } ]
```

Board ascii

```
const chess = new Chess();
chess.toAscii();

// ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
// ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟
// . . . . . . . .
// . . . . . . . .
// . . . . . . . .
// . . . . . . . .
// ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙
// ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖
```

Move

```
const chess = new Chess();
chess.move("e2", "e4");
chess.toAscii();

// ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
// ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟
// . . . . . . . .
// . . . . . . . .
// . . . . ♙ . . .
// . . . . . . . .
// ♙ ♙ ♙ ♙ . ♙ ♙ ♙
// ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖
```

Castling

```
const chess = new Chess("r1bqkbnr/ppp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4");
chess.toAscii();

// ♜ . ♝ ♛ ♚ ♝ ♞ ♜
// ♟ ♟ ♟ . . ♟ ♟ ♟
// . . ♞ ♟ . . . .
// . . . . ♟ . . .
// . . ♗ . . . . .
// . . . . ♙ ♘ . .
// ♙ ♙ ♙ ♙ . ♙ ♙ ♙
// ♖ ♘ ♗ ♕ ♔ . . ♖

chess.castlingKing();
chess.toAscii();

// ♜ . ♝ ♛ ♚ ♝ ♞ ♜
// ♟ ♟ ♟ . . ♟ ♟ ♟
// . . ♞ ♟ . . . .
// . . . . ♟ . . .
// . . ♗ . . . . .
// . . . . ♙ ♘ . .
// ♙ ♙ ♙ ♙ . ♙ ♙ ♙
// ♖ ♘ ♗ ♕ . ♖ ♔ .

chess.castlingQeen();

// throw "castling invalid";
```

Target square

```
const chess = new Chess("r1bqkbnr/ppp2ppp/2np4/4p3/2B5/4PN2/PPPP1PPP/RNBQK2R w KQkq - 2 4");
chess.toAscii();

// ♜ . ♝ ♛ ♚ ♝ ♞ ♜
// ♟ ♟ ♟ . . ♟ ♟ ♟
// . . ♞ ♟ . . . .
// . . . . ♟ . . .
// . . ♗ . . . . .
// . . . . ♙ ♘ . .
// ♙ ♙ ♙ ♙ . ♙ ♙ ♙
// ♖ ♘ ♗ ♕ ♔ . . ♖

chess.target("e1");

// false

chess.target("e5");

// true

chess.targetKing();

// false

```
