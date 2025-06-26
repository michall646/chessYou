const getPieceColor = (pieceState) => {
        if(pieceState.pieceType === pieceState.pieceType.toUpperCase()){
            return 'w'
        }
        else{
            return 'b'
        }
    }
    export default getPieceColor