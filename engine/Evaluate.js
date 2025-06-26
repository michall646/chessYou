import { SQUARES } from "chess.js";

const pieceSquareTables = {
    P: [
        0,   0,   0,   0,   0,   0,   0,   0,
    178, 173, 158, 134, 147, 132, 165, 187,
     94, 100,  85,  67,  56,  53,  82,  84,
     32,  24,  13,   5,  -2,   4,  17,  17,
     13,   9,  -3,  -7,  -7,  -8,   3,  -1,
      4,   7,  -6,   1,   0,  -5,  -1,  -8,
     13,   8,   8,  10,  13,   0,   2,  -7,
      0,   0,   0,   0,   0,   0,   0,   0,
    ],
    N: [
        -167, -89, -34, -49, 61, -97, -15, -107,
        -73, -41, 72, 36, 23, 62, 7, -17,
        -47, 60, 37, 65, 84, 129, 73, 44,
        -9, 17, 19, 53, 37, 69, 18, 22,
        -13, 4, 16, 13, 28, 19, 21, -8,
        -23, -9, 12, 10, 19, 17, 25, -16,
        -29, -53, -12, -3, -1, 18, -14, -19,
        -105, -21, -58, -33, -17, -28, -19, -23
    ],
    B: [
        -29, 4, -82, -37, -25, -42, 7, -8,
        -26, 16, -18, -13, 30, 59, 18, -47,
        -16, 37, 43, 40, 35, 50, 37, -2,
        -4, 5, 19, 50, 37, 37, 7, -2,
        -6, 13, 13, 26, 34, 12, 10, 4,
        0, 15, 15, 15, 14, 27, 18, 10,
        4, 15, 16, 0, 7, 21, 33, 1,
        -33, -3, -14, -21, -13, -12, -39, -21
    ],
    R: [
        32, 42, 32, 51, 63, 9, 31, 43,
        27, 32, 58, 62, 80, 67, 26, 44,
        -5, 19, 26, 36, 17, 45, 61, 16,
        -24, -11, 7, 26, 24, 35, -8, -20,
        -36, -26, -12, -1, 9, -7, 6, -23,
        -45, -25, -16, -17, 3, 0, -5, -33,
        -44, -16, -20, -9, -1, 11, -6, -71,
        -19, -13, 1, 17, 16, 7, -37, -26
    ],
    Q: [
        -28, 0, 29, 12, 59, 44, 43, 45,
        -24, -39, -5, 1, -16, 57, 28, 54,
        -13, -17, 7, 8, 29, 56, 47, 57,
        -27, -27, -16, -16, -1, 17, -2, 1,
        -9, -26, -9, -10, -2, -4, 3, -3,
        -14, 2, -11, -2, -5, 2, 14, 5,
        -35, -8, 11, 2, 8, 15, -3, 1,
        -1, -18, -9, 10, -15, -25, -31, -50
    ],
    K: [
        -65, 23, 16, -15, -56, -34, 2, 13,
        29, -1, -20, -7, -8, -4, -38, -29,
        -9, 24, 2, -16, -20, 6, 22, -22,
        -17, -20, -12, -27, -30, -25, -14, -36,
        -49, -1, -27, -39, -46, -44, -33, -51,
        -14, -14, -22, -46, -44, -30, -15, -27,
        1, 7, -8, -64, -43, -16, 9, 8,
        -15, 36, 12, -54, 8, -28, 24, 14
    ]
}
const reverseColumns = (grid)  => {
    
    const reversedGrid = [];
    for (let row = 7; row >= 0; row--) {
      for (let col = 0; col < 8; col++) {
        reversedGrid.push(grid[row * 8 + col]);
      }
    }
  
    return reversedGrid;
  }

const pieceSquareMirror = {
    P: reverseColumns(pieceSquareTables['P']),
    N: reverseColumns(pieceSquareTables['N']),
    B: reverseColumns(pieceSquareTables['B']),
    R: reverseColumns(pieceSquareTables['R']),
    Q: reverseColumns(pieceSquareTables['Q']),
    K: reverseColumns(pieceSquareTables['K']),
  };


const pieceValues = {
    P: 82,
    K: 337,
    B: 365,
    R: 477,
    Q: 1025,
    K: 0
}

const getSquareIndex = (cord) => {
    const col = cord[0].charCodeAt(0) - 97;
    const row = cord[1] - 1;
    return row * 8 + col;
}
const getSquareCord = (index) => {
    const col = index % 8;
    const row = Math.floor(index / 8) + 1;
    const char = String.fromCharCode(col + 97);
    return char + row;
}


const Evaluate = (chess, colorToMove) => {
    const turn = colorToMove;
    if(chess.isCheckmate()) {
        return turn === "b"? 9999 : -9999;
    }
    if(chess.isDraw()) {
        return 0;
    }
    if(chess.isThreefoldRepetition()) {
        return turn === "b"? 2500 : -2500;
    }

    let whitePieces = {};
    let blackPieces = {};
    let material = 0;

    for (const piece in pieceValues) {
        whitePieces[piece] = chess.findPiece({type: piece.toLowerCase(), color: 'w'});
        blackPieces[piece] = chess.findPiece({type: piece.toLowerCase(), color: 'b'});
        const value = pieceValues[piece];
        material += (whitePieces[piece].length - blackPieces[piece].length) * value;
    }
    let squaresEval = 0;

    for(const piece in pieceValues){
        const whiteSquares = whitePieces[piece];
        const blackSquares = blackPieces[piece];
        for(const square of whiteSquares){
            squaresEval += pieceSquareMirror[piece][getSquareIndex(square)];
        }
        for(const square of blackSquares){
            squaresEval -= pieceSquareTables[piece][getSquareIndex(square)];
        }

    }
    let totalEval = material + squaresEval;
    const doubledPenalty = 30;


    /*for(const square of SQUARES){
        let piece = chess.get(square);
        if(piece && piece.type === "p"){
            const upper = getSquareIndex(square) + 8;
            if(upper < 64 && chess.get(getSquareCord(upper)) && chess.get(getSquareCord(upper)).type === "p"){
                totalEval += piece.color === "w" ? -doubledPenalty: doubledPenalty;
            }
            const bottom = getSquareIndex(square) - 8;
            if(bottom  >= 0 && chess.get(getSquareCord(bottom)) && chess.get(getSquareCord(bottom)).type === "p"){
                totalEval += piece.color === "w" ? -doubledPenalty: doubledPenalty;
            }
        }

    } */
    return totalEval;

}
export default Evaluate