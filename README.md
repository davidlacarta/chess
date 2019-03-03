# Chess board

Chess board logic

Start
```
const chess = new Chess();
```
Fen position
```
chess.toFen();

// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
```

Movements available
```
chess.getMoves("b1");

// [ { square: 'c3', piece: null }, { square: 'a3', piece: null } ]
```

Board ascii
```
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

Move
```
chess.move("e2", "e4");
chess.toAscii(true);

// 8  ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
// 7  ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟
// 6  . . . . . . . .
// 5  . . . . . . . .
// 4  . . . . ♙ . . .
// 3  . . . . . . . .
// 2  ♙ ♙ ♙ ♙ . ♙ ♙ ♙
// 1  ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖
//
//    a b c d e f g h
```
