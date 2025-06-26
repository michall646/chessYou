import getSquareCord from "./getSquareCord";

function getBoardStates()  {
        const gridSize = 8;
            let squareIndex = 0;
            const boardTemp = [];
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    boardTemp.push({state: "default", row: row, col: col, cord: getSquareCord(squareIndex)});
                    squareIndex++;
                }
            }
            return boardTemp
    }
    export default getBoardStates