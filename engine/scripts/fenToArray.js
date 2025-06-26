const fenToArray =(fen) =>{
    const piecePlacement = fen.split(' ')[0];
    const result = [];
    let rank = 8;
    let file = 0;
  
    for (const char of piecePlacement) {
      if (/\d/.test(char)) {
        const skip = parseInt(char, 10);
        file += skip;
      } else if (/[rnbqkpRNBQKP]/.test(char)) {
        const squareIndex = (rank - 1) * 8 + file ;
        result.push({ squareIndex: squareIndex, exists: true, pieceType: char, isAttacked: false, selected: false });
        file++;
      } else if (char === '/') {
        rank--;
        file = 0;
      }
    }
  
    return result;
}
export default fenToArray