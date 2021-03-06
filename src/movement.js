import {
  PIECE_COLOR,
  PIECE_TYPE,
  PIECE_OFFSETS,
  PIECE_OFFSETS_NUM_MOVES,
  PAWN_OFFSETS,
  PAWN_PROMOTION,
  PAWN_START,
  CASTLING_TYPE,
  isPawn,
  inverseColor,
  castlingMoves,
  castlingSafeSquares
} from "./piece";
import {
  squareInBoard,
  setPiece,
  toArrayPosition,
  toAlgebraicPosition
} from "./board";
import { flat, cloneDeep, replace } from "./utils";

function moves({ state, withColor, withPieceType }) {
  const { board, activeColour } = state;
  return flat(
    squares({ board, withColor: withColor || activeColour, withPieceType }).map(
      ({ piece, algebraicPosition }) => {
        const moves = movesPosition({ state, algebraicPosition });
        return moves.map(move => ({
          piece,
          from: algebraicPosition,
          to: move.square,
          capture: move.piece
        }));
      }
    )
  );
}

function movesPosition({ state, algebraicPosition }) {
  const square = squareInBoard({ board: state.board, algebraicPosition });

  const pieceValidSquare =
    square && square.piece && square.piece.color === state.activeColour;
  if (!pieceValidSquare) {
    return [];
  }

  return flat(
    getPieceOffsets(square).map(offset =>
      getMoves({
        state,
        square,
        offset,
        numMoves: getNumMoves(square),
        nextMoves: [],
        currentSquare: square.square
      })
    )
  );
}

function getPieceOffsets(square) {
  return isPawn(square.piece)
    ? PAWN_OFFSETS[square.piece.color]
    : PIECE_OFFSETS[square.piece.type];
}

function getNumMoves(square) {
  return isPawn(square.piece)
    ? getPawnNumMoves(square)
    : PIECE_OFFSETS_NUM_MOVES[square.piece.type];
}

function getPawnNumMoves(square) {
  const color = square.piece.color;
  const [, row] = square.square;

  const isPawnStartPosition = PAWN_START[color] === Number(row);

  return isPawnStartPosition ? 2 : 1;
}

function getMoves({
  state,
  square,
  offset,
  numMoves,
  nextMoves,
  currentSquare
}) {
  const { board, passantTarget } = state;
  const nextSquare = squareInBoard({
    board,
    algebraicPosition: currentSquare,
    offset
  });

  if (moveIsValid({ square, nextSquare, passantTarget })) {
    nextMoves.push(nextSquare);
  }

  return moveIsLast({ square, nextMoves, nextSquare, numMoves })
    ? nextMoves
    : getMoves({
        state,
        square,
        offset,
        numMoves,
        nextMoves,
        currentSquare: nextSquare.square
      });
}

function moveIsValid({ square, nextSquare, passantTarget }) {
  const nextSquareIsPlaced = nextSquare && nextSquare.piece !== null;
  const nextSquareIsEmpty = nextSquare && nextSquare.piece === null;
  const nextPieceIsCapture =
    nextSquareIsPlaced && nextSquare.piece.color !== square.piece.color;

  return isPawn(square.piece)
    ? movePawnIsValid({ square, nextSquare, passantTarget })
    : nextSquareIsEmpty || nextPieceIsCapture;
}

function movePawnIsValid({ square, nextSquare, passantTarget }) {
  const nextSquareIsPassant = nextSquare && nextSquare.square === passantTarget;
  const isMoveCapture = isPawnMoveCapture({ square, nextSquare });
  const nextSquareIsPlaced = nextSquare && nextSquare.piece !== null;
  const nextPieceIsCapture =
    nextSquareIsPlaced && nextSquare.piece.color !== square.piece.color;

  return (
    (nextSquare && !isMoveCapture && !nextSquareIsPlaced) ||
    (nextSquare && isMoveCapture && nextPieceIsCapture) ||
    nextSquareIsPassant
  );
}

function moveIsLast({ square, nextMoves, nextSquare, numMoves }) {
  const nextSquareIsPlaced = nextSquare && nextSquare.piece !== null;
  const numMovesCompleted = numMoves !== -1 && nextMoves.length === numMoves;

  return (
    !nextSquare ||
    nextSquareIsPlaced ||
    numMovesCompleted ||
    (isPawn(square.piece) && isPawnMoveCapture({ square, nextSquare }))
  );
}

function isPawnMoveCapture({ square, nextSquare }) {
  const sameColumn = nextSquare && square.square[0] === nextSquare.square[0];
  return !sameColumn;
}

function moveSquare({
  state,
  algebraicPositionFrom,
  algebraicPositionTo,
  promotionType
}) {
  return !algebraicPositionTo
    ? moveSquareSAN({ state, movementSAN: algebraicPositionFrom })
    : moveSquareAlgebraic({
        state,
        algebraicPositionFrom,
        algebraicPositionTo,
        promotionType
      });
}

function moveSquareSAN({ state, movementSAN }) {
  const {
    castlingKing,
    castlingQueen,
    from: moveFrom,
    to: moveTo,
    pieceType,
    promotionType
  } = decode({ state, movementSAN });

  if (castlingKing) {
    return castling({ state, castlingType: CASTLING_TYPE.KING });
  }

  if (castlingQueen) {
    return castling({ state, castlingType: CASTLING_TYPE.QUEEN });
  }

  const potentialMoves = getPotentialMoves({
    state,
    withPieceType: pieceType,
    moveFrom,
    moveTo
  });

  if (potentialMoves.length !== 1) {
    throw potentialMoves.length === 0
      ? `Invalid SAN: ${movementSAN}`
      : `Invalid SAN, amibiguous piece: ${potentialMoves
          .map(({ from }) => from)
          .join(",")}`;
  }

  return moveSquareAlgebraic({
    state,
    algebraicPositionFrom: potentialMoves[0].from,
    algebraicPositionTo: moveTo,
    promotionType
  });
}

function getPotentialMoves({ state, withPieceType, moveFrom, moveTo }) {
  return moves({ state, withPieceType }).filter(({ to, from }) => {
    const [rowFrom, colFrom] = from;

    const validTo = to === moveTo;
    const validFrom =
      !moveFrom ||
      moveFrom === from ||
      moveFrom === rowFrom ||
      moveFrom === colFrom;

    return validTo && validFrom;
  });
}

function decode({ state, movementSAN }) {
  const castlingKing = movementSAN === "0-0" || movementSAN === "O-O";
  const castlingQueen = movementSAN === "0-0-0" || movementSAN === "O-O-O";

  if (castlingKing || castlingQueen) {
    return { castlingKing, castlingQueen };
  }

  const { promotionType, movementWithoutPromotion } = decodePromotionType(
    movementSAN
  );

  const { from, to, pieceType } = decodeMove(movementWithoutPromotion);

  const { halfCastlingKing, halfCastlingQueen } = decodeHalfCastling({
    state,
    from,
    to
  });

  if (halfCastlingKing || halfCastlingQueen) {
    return { castlingKing: halfCastlingKing, castlingQueen: halfCastlingQueen };
  }

  return {
    castlingKing,
    castlingQueen,
    from,
    to,
    pieceType,
    promotionType
  };
}

function decodePromotionType(movementSAN) {
  const movementClean = sanitize({
    target: movementSAN,
    chars: ["x", "e.p.", "+", "=", ":"]
  });

  const promotionType =
    isRegularPiece(lastChar(movementClean)) &&
    lastChar(movementClean).toLowerCase();

  const movementWithoutPromotion = promotionType
    ? movementClean.slice(0, movementClean.length - 1)
    : movementClean;

  return {
    promotionType,
    movementWithoutPromotion
  };
}

function decodeMove(movementWithoutPromotion) {
  const [pieceTypeFrom, to] = splitTwoLastChars(movementWithoutPromotion);

  const { from, pieceType } = isRegularPiece(firstChar(pieceTypeFrom))
    ? {
        from: pieceTypeFrom.slice(1),
        pieceType: firstChar(pieceTypeFrom).toLowerCase()
      }
    : { from: pieceTypeFrom, pieceType: PIECE_TYPE.PAWN };

  return { from, to, pieceType };
}

function decodeHalfCastling({ state, from, to }) {
  const { activeColour, board } = state;
  const square = squareInBoard({ board, algebraicPosition: from });

  if (!square || !square.piece || square.piece.type !== PIECE_TYPE.KING) {
    return { halfCastlingKing: false, halfCastlingQueen: false };
  }

  return {
    halfCastlingKing: decodeHalfCastlingType({
      activeColour,
      castlingType: CASTLING_TYPE.KING,
      from,
      to
    }),
    halfCastlingQueen: decodeHalfCastlingType({
      activeColour,
      castlingType: CASTLING_TYPE.QUEEN,
      from,
      to
    })
  };
}

function decodeHalfCastlingType({ activeColour, castlingType, from, to }) {
  const {
    king: { from: kingFrom, to: kingTo }
  } = castlingMoves({ activeColour, castlingType });

  return kingFrom === from && kingTo === to;
}

function splitTwoLastChars(chars) {
  return [chars.slice(0, chars.length - 2), chars.slice(-2)];
}

function lastChar(chars) {
  return chars.slice(-1);
}

function firstChar(chars) {
  return chars.slice(0, 1);
}

function isRegularPiece(char) {
  return /(R|N|B|Q|K)/.test(char);
}

function sanitize({ target, chars }) {
  return chars.reduce((acc, char) => acc.replace(char, ""), target);
}

function moveSquareAlgebraic({
  state,
  algebraicPositionFrom,
  algebraicPositionTo,
  promotionType
}) {
  const { activeColour } = state;
  const virtualState = cloneDeep(state);
  const squareCaptured = moveSquareVirtual({
    state: virtualState,
    algebraicPositionFrom,
    algebraicPositionTo
  });

  if (isTargetKing(virtualState)) {
    throw "target king";
  }

  const virtualSquareTo = squareInBoard({
    board: virtualState.board,
    algebraicPosition: algebraicPositionTo
  });
  if (
    isPawnPromotion({
      square: virtualSquareTo,
      activeColour
    })
  ) {
    pawnPromotion({ state, virtualState, virtualSquareTo, promotionType });
  }

  return { state: cloneDeep(virtualState), squareCaptured };
}

function isPawnPromotion({ square, activeColour }) {
  const squareNumber = Number(square.square[1]);
  const isRowPromotion = squareNumber === PAWN_PROMOTION[activeColour];

  return isPawn(square.piece) && isRowPromotion;
}

function pawnPromotion({
  state: { activeColour },
  virtualState,
  virtualSquareTo,
  promotionType
}) {
  const isValidType = Object.values(PIECE_TYPE).find(
    type => PIECE_TYPE.PAWN !== type && type === promotionType
  );
  if (!isValidType) {
    throw "promotion type required";
  }
  const { board } = virtualState;
  const piece = { type: promotionType, color: activeColour };
  setPiece({ board, piece, algebraicPosition: virtualSquareTo.square });
}

function moveSquareVirtual({
  state,
  algebraicPositionFrom,
  algebraicPositionTo
}) {
  if (
    !moveSquareIsValid({ state, algebraicPositionFrom, algebraicPositionTo })
  ) {
    throw "move invalid";
  }
  const { board, passantTarget } = state;
  const boardPositionFrom = toArrayPosition(algebraicPositionFrom);
  const boardPositionTo = toArrayPosition(algebraicPositionTo);

  const { squareFrom, squareTo } = moveSquareBoard({
    board,
    boardPositionFrom,
    boardPositionTo
  });

  const squareTarget =
    isPawn(squareFrom) && algebraicPositionTo === passantTarget
      ? cleanSquareBoardPassant({ state, squareFrom, boardPositionTo })
      : squareTo;

  updatePassantTarget({
    state,
    squareFrom,
    boardPositionFrom,
    boardPositionTo
  });
  updateHalfMoveClock({ state, squareFrom, squareTarget });
  updateFullMoveNumber(state);
  updateCastling({ state, algebraicPositionFrom });
  changeActiveColor(state);

  return squareTarget;
}

function updateHalfMoveClock({ state, squareFrom, squareTarget }) {
  const isCapture = squareTarget !== null;
  state.halfMoveClock =
    isPawn(squareFrom) || isCapture ? 0 : state.halfMoveClock + 1;
}

function updateFullMoveNumber(state) {
  if (state.activeColour === PIECE_COLOR.BLACK) {
    state.fullMoveNumber += 1;
  }
}

function updatePassantTarget({
  state,
  squareFrom,
  boardPositionFrom,
  boardPositionTo
}) {
  const moveTwoRows = Math.abs(boardPositionFrom[0] - boardPositionTo[0]) === 2;
  if (!isPawn(squareFrom) || !moveTwoRows) {
    state.passantTarget = "-";
    return;
  }

  const boardPositionPassant = getBoardPositionPassant({
    color: squareFrom.color,
    boardPosition: boardPositionTo
  });

  state.passantTarget = toAlgebraicPosition(boardPositionPassant);
}

function cleanSquareBoardPassant({ state, squareFrom, boardPositionTo }) {
  const { board } = state;
  const boardPositionPassant = getBoardPositionPassant({
    color: squareFrom.color,
    boardPosition: boardPositionTo
  });
  return cleanSquareBoard({
    board,
    boardPosition: boardPositionPassant
  });
}

function changeActiveColor(state) {
  state.activeColour =
    state.activeColour === PIECE_COLOR.WHITE
      ? PIECE_COLOR.BLACK
      : PIECE_COLOR.WHITE;
}

function getBoardPositionPassant({ color, boardPosition }) {
  const offset = color === PIECE_COLOR.WHITE ? -1 : 1;
  const boardPositionPassant = boardPosition;
  boardPositionPassant[0] += offset;
  return boardPositionPassant;
}

function moveSquareIsValid({
  state,
  algebraicPositionFrom,
  algebraicPositionTo
}) {
  const moves = movesPosition({
    state,
    algebraicPosition: algebraicPositionFrom
  });
  return moves.find(move => move.square === algebraicPositionTo);
}

function moveSquareBoard({ board, boardPositionFrom, boardPositionTo }) {
  const squareFrom = board[boardPositionFrom[0]][boardPositionFrom[1]];
  const squareTo = board[boardPositionTo[0]][boardPositionTo[1]];

  board[boardPositionTo[0]][boardPositionTo[1]] = squareFrom;
  board[boardPositionFrom[0]][boardPositionFrom[1]] = null;

  return { squareFrom, squareTo };
}

function cleanSquareBoard({ board, boardPosition }) {
  const squareCaptured = board[boardPosition[0]][boardPosition[1]];
  board[boardPosition[0]][boardPosition[1]] = null;
  return squareCaptured;
}

function isTargetKing(state) {
  const { board, activeColour } = state;
  const squareKing = getSquareKing({
    board,
    color: inverseColor(activeColour)
  });

  if (!squareKing) {
    return false;
  }

  return isTarget({ state, algebraicPosition: squareKing.square });
}

function getSquareKing({ board, color }) {
  return board
    .map((row, rowIndex) =>
      row
        .map((piece, colIndex) => ({
          piece,
          square: toAlgebraicPosition([rowIndex, colIndex])
        }))
        .find(
          piece =>
            piece.piece !== null &&
            piece.piece.color === color &&
            piece.piece.type === PIECE_TYPE.KING
        )
    )
    .filter(square => !!square)[0];
}

function isTarget({ state, algebraicPosition }) {
  return !!moves({ state }).find(({ to }) => to === algebraicPosition);
}

function squares({ board, withColor = false, withPieceType = false }) {
  return flat(
    board.map((row, rowIndex) =>
      row
        .map((piece, colIndex) => ({
          piece,
          algebraicPosition: toAlgebraicPosition([rowIndex, colIndex])
        }))
        .filter(({ piece }) => {
          if (!piece) {
            return false;
          }

          const colorValid =
            !withColor || (withColor && piece.color === withColor);

          const typeValid =
            !withPieceType || (withPieceType && piece.type === withPieceType);

          return colorValid && typeValid;
        })
    )
  );
}

function castling({ state, castlingType }) {
  const { activeColour, board } = state;

  const safeSquares = castlingSafeSquares({ activeColour, castlingType });

  checkAvailabilityCastling({ safeSquares, board });

  checkTargetCastling({ safeSquares, state });

  const {
    king: { from: kingFrom, to: kingTo },
    rook: { from: rookFrom, to: rookTo }
  } = castlingMoves({ activeColour, castlingType });

  moveSquareBoard({
    board,
    boardPositionFrom: toArrayPosition(kingFrom),
    boardPositionTo: toArrayPosition(kingTo)
  });
  moveSquareBoard({
    board,
    boardPositionFrom: toArrayPosition(rookFrom),
    boardPositionTo: toArrayPosition(rookTo)
  });

  state.passantTarget = "-";
  state.halfMoveClock += 1;
  updateCastling({ state });
  updateFullMoveNumber(state);
  changeActiveColor(state);

  return { state };
}

function checkAvailabilityCastling({ safeSquares, board }) {
  const isAnySafeSquareEmptyOrKing = !!safeSquares.find(
    algebraicPosition =>
      !isEmptySquare({ board, algebraicPosition }) &&
      !isKingSquare({ board, algebraicPosition })
  );

  if (isAnySafeSquareEmptyOrKing) {
    throw "castling invalid";
  }
}

function checkTargetCastling({ safeSquares, state }) {
  const stateInverseColor = cloneDeep(state);
  stateInverseColor.activeColour = inverseColor(state.activeColour);

  const isAnySafeSquareTarget = !!safeSquares.find(safeSquare =>
    isTarget({ state: stateInverseColor, algebraicPosition: safeSquare })
  );

  if (isAnySafeSquareTarget) {
    throw "castling target";
  }
}

function updateCastling({ state, algebraicPositionFrom }) {
  const keysReplace = keysReplaceCastling({ state, algebraicPositionFrom });

  const keysReplaceColour =
    state.activeColour === PIECE_COLOR.WHITE
      ? keysReplace.map(key => key.toUpperCase())
      : keysReplace;

  const castlingRest = replace(
    state.castlingAvailability,
    keysReplaceColour,
    ""
  );

  state.castlingAvailability = castlingRest || "-";
}

function keysReplaceCastling({ state, algebraicPositionFrom }) {
  if (!algebraicPositionFrom) {
    return [PIECE_TYPE.KING, PIECE_TYPE.QUEEN];
  }

  const {
    kingFrom,
    rookFromSideKing,
    rookFromSideQueen
  } = castlingPositionsFrom(state.activeColour);

  const isMoveKing = algebraicPositionFrom === kingFrom;
  if (isMoveKing) {
    return [PIECE_TYPE.KING, PIECE_TYPE.QUEEN];
  }

  const isMoveSideKing = algebraicPositionFrom === rookFromSideKing;
  if (isMoveSideKing) {
    return [PIECE_TYPE.KING];
  }

  const isMoveSideQueen = algebraicPositionFrom === rookFromSideQueen;
  if (isMoveSideQueen) {
    return [PIECE_TYPE.QUEEN];
  }

  return [];
}

function castlingPositionsFrom(activeColour) {
  const {
    king: { from: kingFrom },
    rook: { from: rookFromSideKing }
  } = castlingMoves({
    activeColour: activeColour,
    castlingType: CASTLING_TYPE.KING
  });

  const {
    rook: { from: rookFromSideQueen }
  } = castlingMoves({
    activeColour: activeColour,
    castlingType: CASTLING_TYPE.QUEEN
  });

  return { kingFrom, rookFromSideKing, rookFromSideQueen };
}

function isEmptySquare({ board, algebraicPosition }) {
  const square = squareInBoard({ board, algebraicPosition });
  return square.piece === null;
}

function isKingSquare({ board, algebraicPosition }) {
  const square = squareInBoard({ board, algebraicPosition });
  return square.piece !== null && square.piece.type === PIECE_TYPE.KING;
}

export { moves, movesPosition, moveSquare, isTarget, isTargetKing, castling };
