const getSquareCord = (index) => {
    const col = index % 8;
    const row = Math.floor(index / 8) + 1;
    const char = String.fromCharCode(col + 97);
    return char + row;
}
export default getSquareCord