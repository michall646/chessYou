import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper'
import getBoardStates from '../../engine/scripts/getBoardState';
import BoardPiece from '../Play/BoardPiece';
import fenToArray from '../../engine/scripts/fenToArray';
import getPieceColor from '../../engine/scripts/getPieceColor';
import StaticPiece from './StaticPiece';
import {memo, useCallback} from 'react'
import { useSettings } from './SettingsContext';
import StaticSquare from '../Play/StaticSquare';

const BoardPreview = ({size, rotation, fen}) => {
    const theme = useTheme();
    const {settings} = useSettings();
    

    const renderBoard = (squares) => {

            const gridSize = 8;
            const grid = [];
            let squareIndex = 0;
            const rowDir = rotation === "white" ? 'row': 'row-reverse'
            const colDir = rotation === "white" ? 'column-reverse': 'column'
            for (let row = 0; row < gridSize; row++) {
                const rowItems = [];
                for (let col = 0; col < gridSize; col++) {
                    rowItems.push(
                        squares[squareIndex]
                    );
                    squareIndex++;
                }
                grid.push(
                  <View key={`row-${row}`} style={{flexDirection: rowDir,}}>
                    {rowItems}
                  </View>
                );
              }
              
              return (<View  style={{flexDirection: colDir}}>
                        {grid}
                    </View>)
    }
    function numberToLetter(num) {
        const asciiOfA = 'A'.charCodeAt(0);
        const targetAscii = asciiOfA + num;
        return String.fromCharCode(targetAscii);
}
    const getSquareColors = useCallback((black) => {
            if(theme.dark){
                background = black?  theme.colors.surface : theme.colors.onSurface
                highlight = theme.colors.onSecondary;
                text = black?theme.colors.onSurface:  theme.colors.surface;
                return {background, text, highlight}
            }else{
                text = black?  theme.colors.surface : theme.colors.onSurface
                highlight = theme.colors.secondary;
                background = black?theme.colors.onSurface:  theme.colors.surface;
                return {background, text, highlight}
            }
        }, [theme])
     const renderSquare = (item, index) => {
        const isBlack = (index + Math.floor(index % 16 / 8) + 1) % 2
        const sqSize = size / 8;
        let indexText = "";
        const file = index % 8;
        const row = 7 - Math.floor(index/ 8);

        if(rotation === "white"){
            if(row === 7 && settings.showBoardIndexes){
                indexText = numberToLetter(file);
            }
            if(file === 0 && settings.showBoardIndexes){
                indexText = 8 - row;
            }
        }
        else{
            if(row === 0 && settings.showBoardIndexes){
                indexText = numberToLetter(file);
            }
            if(file === 7 && settings.showBoardIndexes){
                indexText = 8 - row;
            }
        }
        const {background,text, highlight} = getSquareColors(isBlack);

        return (<View key={index}>
                    <StaticSquare select={() => {}} state={item.state} black={isBlack} backgroundColor={background} textColor={text} highlightColor={highlight} index={index} indexText={indexText} size={sqSize}/>
                </View>)
    }
    const renderPiece = (item, index, array) => {
            const squareIndex = item.squareIndex;
            const file = squareIndex % 8;
            const row = 7 - Math.floor(squareIndex/ 8);
            if(index === 0) console.log(file,row)
            
            let x,y;

            if(rotation === "white"){
                
                x = file * (size/8);
                y = row * (size/8);
            }
            else{
                x = (7 -file) * (size/8);
                y = (7- row) * (size/8);
    
            }
            
            return <StaticPiece 
                        isAttacked={item.isAttacked} 
                        exists={item.exists} 
                        x={x} 
                        y={y} 
                        piece={item.pieceType} 
                        color={getPieceColor(item)}
                        key={index} 
                        index={index}
                        selected={false}
                        size={size/ 8}
                        select={() => {}}/>
        }
    const squares = getBoardStates().map(renderSquare);
    const board = renderBoard(squares);
    const pieceObjects = fenToArray(fen);
    const pieces = pieceObjects.map((x, i, a) => renderPiece(x,i,a));
  return (
    <View style={{height: size, width: size}}>
        {pieces}
        {board}
    </View>
  )
}

export default memo(BoardPreview)