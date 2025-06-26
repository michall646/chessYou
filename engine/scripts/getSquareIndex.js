const getSquareIndex = (cord) => {
    const col = cord[0].charCodeAt(0) - 97;
    const row = cord[1] - 1;
    return row * 8 + col;
}
export default getSquareIndex