import { Dimensions } from "react-native"
import fenToArray from "../../engine/scripts/fenToArray";
import { useRef, useState, useLayoutEffect, useEffect, useCallback, memo, useMemo} from "react"
import { View } from "react-native";
import BoardPiece from "./BoardPiece";
import { router, useFocusEffect } from "expo-router";
import { useSettings } from "../utils/SettingsContext";
import AnimatedSquare from "./AnimatedSquare";
import StaticSquare from "./StaticSquare";
import { useTheme } from "react-native-paper";

const Board = (props) => {
    const boardRef = useRef();
    const squarePositions = props.squarePositions;
    const piecesStates = props.piecesStates;
    const piecesX = props.piecesX;
    const piecesY = props.piecesY;
    const setPiecesComponents = props.setPiecesComponents;
    const selectSquare = props.selectSquare;
    const boardStates = props.boardStates;
    const chess= props.chess;
    const getPieces = props.getPieces;
    const boardRotation = props.boardRotation;
    const {settings} = useSettings();
    const theme = useTheme()


    const updateBoardPositions = (boardRotation) => {
        if(typeof boardRef === "undefined" || !boardRef.current || typeof boardRotation === "undefined" || !boardRotation) return
        console.log(piecesStates.current)

        const rot = boardRotation === "white" ? "white": "black";
        console.log(rot);
        
        
        boardRef.current.measure((x,y, width, height, pageX, pageY) => {
            const windowHeight = Dimensions.get('window').height;
            const windowWidth = Dimensions.get('window').width;
            
            const squareSize = Math.min(( windowHeight - 200)/8, ( windowWidth - 50)/8);
            if(rot === "white"){
            squarePositions.current.forEach((e,i) => {
                const col = i % 8;
                const row = Math.floor(i / 8);
                const xOffset = col * squareSize;
                const yOffset = (7-row) * squareSize;
                squarePositions.current[i] = {
                    x: x + xOffset,
                    y: y + yOffset,
                    width: squareSize,
                    height: squareSize
                }
            });
            }else{
            squarePositions.current.forEach((e,i) => {
                const col = i % 8;
                const row = Math.floor(i / 8);
                const xOffset = (7-col) * squareSize;
                const yOffset = (row) * squareSize;
                squarePositions.current[i] = {
                    x: x + xOffset,
                    y: y + yOffset,
                    width: squareSize,
                    height: squareSize
                }
            });
        }
            
            const piecesTemp = fenToArray(chess.current.fen());
            piecesStates.current = piecesTemp;

            for (let i = 0; i < piecesTemp.length; i++) {
                const value = squarePositions.current[piecesTemp[i].squareIndex];
                piecesX.current[i].value = value.x;
                piecesY.current[i].value = value.y;
              }
            setPiecesComponents(getPieces(piecesTemp));          
            })
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

    const renderSquare = (index, boardStates) => {
        const isBlack = (index + Math.floor(index % 16 / 8) + 1) % 2
        const windowHeight = Dimensions.get('window').height;
        const windowWidth = Dimensions.get('window').width;
        const size = Math.min(( windowHeight - 200)/8, ( windowWidth - 50)/8);
        const file = index % 8;
        const row = 7 - Math.floor(index/ 8);
        let indexText = "";
        if(boardRotation === "white"){
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
        if(settings.boardAnimations){
            return <AnimatedSquare indexText={indexText} select={selectSquare} state={boardStates[index].state} black={isBlack} backgroundColor={background} textColor={text} highlightColor={highlight} index={index} size={size} key={index}/>
        }else{
            return <StaticSquare indexText={indexText} select={selectSquare} state={boardStates[index].state} black={isBlack} backgroundColor={background} textColor={text} highlightColor={highlight} index={index} size={size} key={index}/>
        }
    }

    const board = useMemo(() => {
            console.log("replace board")
            const gridSize = 8;
            const grid = [];
            let squareIndex = 0;
            const rowDir = props.boardRotation === "white" ? 'row': 'row-reverse'
            const colDir = props.boardRotation === "white" ? 'column-reverse': 'column';

            for (let row = 0; row < gridSize; row++) {
                const rowItems = [];
                for (let col = 0; col < gridSize; col++) {
                    rowItems.push(
                        renderSquare(squareIndex, boardStates)
                    );
                    squareIndex++;
                }
                grid.push(
                  <View key={`row-${row}`} style={{flexDirection: rowDir,}}>
                    {rowItems}
                  </View>
                );
              }
              
              return (<View ref={boardRef}  style={{flexDirection: colDir}}>
                        {grid}
                    </View>)
    }, [boardStates, settings, boardRotation])

    useFocusEffect(
        // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
        useCallback(() => {
          // Invoked whenever the route is focused.
          updateBoardPositions(props.boardRotation);
          Dimensions.addEventListener('change', ({ window, screen }) => {
            updateBoardPositions(props.boardRotation);
            });
    
          // Return function is invoked whenever the route gets out of focus.
          return () => {
          };
        }, [])
       );

    useEffect(() => {
        updateBoardPositions(props.boardRotation);
    }, [props.boardRotation]);
    return <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>{board}</View>
}
export default memo(Board)