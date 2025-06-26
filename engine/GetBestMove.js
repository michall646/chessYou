import Evaluate from "./Evaluate"
import { Chess } from "chess.js";
import findBookMove from "./findBookMove";


const pieceValues = {
  p: 82,
  k: 337,
  b: 365,
  r: 477,
  q: 1025,
  k: 0
}






  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const orderMove = (move) => {
    let score = 0;
    if(move.isCapture()) {
      score += 10 * (pieceValues[move.captured] - pieceValues[move.piece]);
    }
    if(move.piece === 'p'){
           if(move.promotion === 'q') score += 6000;
      else if(move.promotion === 'r') score += 3000;
      else if(move.promotion === 'k') score += 2000;
      else if(move.promotion === 'b') score += 2000;
      else if(move.isBigPawn()) score += 4000;

    }
    if (move.isQueensideCastle() || move.isKingsideCastle()) score += 2000;

    return {...move, score: score}
  }

const minimax = (chess, depth, alpha, beta, isMax, skill) => {
    
    if(depth === 0 || chess.isGameOver()){
        const colorToMove = isMax ? 'w' : 'b';
        const evaluation = Evaluate(chess, colorToMove);
        const max = 150 - skill* 15;
        const min = -150 + skill* 15;
        return [evaluation + getRandom(min, max) + depth, null, []];
    }
    let bestMove;
    let moveHistory = [];

    if(isMax) {
        let maxEval = Number.NEGATIVE_INFINITY;
        const moves = chess.moves({verbose: true}).map(orderMove);
        const ordered = moves.sort((a,b) => b.score - a.score);
        for(const move of ordered){
            chess.move(move);
            
            let [moveEval, best, tree] = minimax(chess, depth - 1, alpha, beta, false, skill);

            chess.undo();
            if(moveEval > maxEval){
                maxEval = moveEval;
                bestMove = move;
                moveHistory = tree;
            }
            
            if(beta <= alpha) {

                break;
            }
            alpha = Math.max(alpha, moveEval);
            
        }
        moveHistory.push([bestMove, isMax]);
        return [maxEval, bestMove, moveHistory];
    }
    else{
        let minEval = Number.POSITIVE_INFINITY;
        const moves = chess.moves({verbose: true}).map(orderMove);
        const ordered = moves.sort((a,b) => b.score - a.score);
        for(const move of ordered){
            
            chess.move(move);
            let [moveEval, best, tree] = minimax(chess, depth - 1, alpha, beta, true, skill);
            chess.undo();
            if(moveEval < minEval){
                minEval = moveEval;
                bestMove = move;
                moveHistory = tree;
            }
           
            if(beta <= alpha) {
                break};
            beta = Math.min(beta, moveEval);
            
        }
        moveHistory.push([bestMove, isMax]);
        return [minEval, bestMove, moveHistory]
    }
}

const GetBestMove = async (chess, skill, callback) => {
    
    console.log(chess)
    const isMax = chess.turn() === "w";
    console.log(isMax)
    const fen = chess.fen();
    const chessCopy = new Chess(fen);
    let depth = 2;
    if(skill < 3) depth = 2;
    if(skill >2 && skill < 7) depth =3;
    if(skill > 5 ) depth = 4;
    const result = minimax(chessCopy, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, isMax, skill);
    callback(result);
}

export default GetBestMove