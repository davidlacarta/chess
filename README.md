# Chess board

Chess board logic

```
const chess = new Chess();

chess.toFen();

// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR

chess.getMoves("b1");

// [ { square: 'c3', piece: null }, { square: 'a3', piece: null } ]

chess.toAscii(true);

// 8  ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
// 7  ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟
// 6  . . . . . . . .
// 5  . . . . . . . .
// 4  . . . . . . . .
// 3  . . . . . . . .
// 2  ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙
// 1  ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖
//
//    a b c d e f g h
```
