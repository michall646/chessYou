
import { View, Text } from "react-native"
import { Chess } from "chess.js"
import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react"
import Piece from "./Piece"
import { runOnRuntime, SlideInDown, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import PromotionModal from "./PromotionModal"
import GetBestMove from "../../engine/GetBestMove"
import { runOnJS } from "react-native-reanimated"
import { Button, IconButton } from "react-native-paper"

import getSquareCord from "../../engine/scripts/getSquareCord"
import getSquareIndex from "../../engine/scripts/getSquareIndex"
import getPieceColor from "../../engine/scripts/getPieceColor"
import Board from "./Board"
import getBoardStates from "../../engine/scripts/getBoardState"
import GameOverModal from "./GameOverModal"
import getStockishRest from "../../engine/getStockishRest"
import useCustomTimer from "./Timer"
import TimerComponent from "../../engine/TimerComponent"
import useNativeStockfish from "../../engine/useNativeStockfish"
import findBookMove from "../../engine/findBookMove"
import { useNetInfo } from "@react-native-community/netinfo";
import { Platform } from "react-native"
import { getItem, saveItem } from "../../engine/storageService"
import History from "./History"
import MoveIndicator from "./MoveIndicator"
import fenToArray from "../../engine/scripts/fenToArray"
import PuzzleHistory from "./PuzzleHistory"
import { Dimensions } from "react-native"
import NoteOverlay from "./NoteOverlay"
import { useTranslation } from "react-i18next"
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { Easing } from "react-native-reanimated"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BotErrorModal from "./BotErrorModal"

const moveAudio = require('../../assets/sounds/move.mp3');



const PlayMode = ({gameSettings, difficulty}) => {
    //const chess = useRef(new Chess("k7/5P2/1K6/8/8/8/8/8 w - - 0 1"));
    const chess = useRef(new Chess("rnbqkbnr/ppp1pp1p/6p1/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 1"));
    const squarePositions = useRef(new Array(64).fill({}));

    const piecesX = useRef(new Array(64).fill({}).map(x=>useSharedValue(0)));
    const piecesY = useRef(new Array(64).fill({}).map(x=>useSharedValue(0)));
    const [piecesComponents, setPiecesComponents] = useState([]);
    const piecesStates = useRef([]);
    const selectedPiece = useRef(null);
    const promotionMove = useRef(null);
    const [promotionVisible, setpromotionVisible] = useState(false);
    const [gameoverVisible, setGameoverVisible] = useState(false);
    const [botErrorVisible, setBotErrorVisible] = useState(false);
    const [botErrorContent, setBotErrorContent] = useState("");
    const [boardStates, setBoardStates] = useState(getBoardStates());
    const boardStatesRef = useRef(getBoardStates());
    const [gameResult, setGameResult] = useState({});
    const [boardRotation, setBoardRotation] = useState();
    const boardRotRef = useRef();
    const [paused, setPaused] = useState(true);
    const { type, isConnected } = useNetInfo();
    const redoStack = useRef([]);
    const [altStack, setAltStack] = useState([]);
    const altRef = useRef([]);
    const [puzzleMoves, setPuzzleMoves] = useState(['e2e4', 'e7e5']);
    const puzzleMovesRef = useRef(['e2e4', 'e7e5'])
    const [puzzleStatus, setPuzzleStatus] = useState({finished: false, isOk: false, started: false});
    const [puzzlesHistory, setPuzzlesHistory] = useState([]);
    const puzzleHistoryRef = useRef([]);
    const [isNoteMode, setNoteMode] = useState(false);
    const noteModeRef = useRef(false);
    const hasArrowStarted = useRef(false)
    const arrowStartIndex = useRef(0);
    const [arrows, setArrows] = useState([]);
    const arrowsRef = useRef([]);
    const {t} = useTranslation();
    const moveSound = useAudioPlayer(moveAudio);
    const insets = useSafeAreaInsets();
    

    const renderPiece = (item, index) => {

        const size = squarePositions.current[0].width;
        return <Piece 
                    isAttacked={item.isAttacked} 
                    exists={item.exists} 
                    x={piecesX.current[index]} 
                    y={piecesY.current[index]} 
                    piece={item.pieceType} 
                    color={getPieceColor(item)}
                    key={index} 
                    index={index}
                    selected={index === selectedPiece.current}
                    size={size}
                    select={selectPiece}/>
    }

    const getPieces = useCallback((pieces) => {
        const elements = pieces.map((x, index) => renderPiece(x, index));
        return elements
    }, []);

    const movePiece = (piece, toSquare, promotion, ignore) => {
        if(typeof piece === "undefined") return
        const newPosition = squarePositions.current[toSquare];
        const takenPiece = piecesStates.current.findIndex(x => x.squareIndex === toSquare && x.exists);
        const yChange = piecesY.current[piece].value - squarePositions.current[toSquare].y;
        piecesStates.current[piece].squareIndex = toSquare;
        
        piecesY.current[piece].value = withTiming(newPosition.y,{
            duration: 300,
            easing: Easing.inOut(Easing.quad),
        }, (isFinished) =>{
             if(isFinished && !ignore&& yChange !== 0){
                
                runOnJS(requestAiMove)();  
            }
            
        });
        
        piecesX.current[piece].value = withTiming(newPosition.x,{
            duration: 300,
            easing: Easing.inOut(Easing.quad),
        }, (isFinished) =>{
             if(isFinished && !ignore&& yChange === 0){
                
                runOnJS(requestAiMove)();   
            }
        });
        
        if(promotion) {
            piecesStates.current[piece].pieceType = promotion;
            
        }
        if(takenPiece !== -1) {
            piecesStates.current[takenPiece].exists = false; 
            
        }

        

        const elements = getPieces(piecesStates.current);
        setPiecesComponents(elements);

        let boardTemp = [...boardStatesRef.current];
        boardTemp = boardTemp.map(x => ({...x, state: "default"}));
        setBoardStates(boardTemp);
        boardStatesRef.current = boardTemp
        
    }

    const selectPiece = useCallback((index) => {
        if(noteModeRef.current){
            handleArrow(piecesStates.current[index].squareIndex);
            return
        }
        if(gameResult.result) return
        if(getPieceColor(piecesStates.current[index]) === chess.current.turn())
            
        {
            if(redoStack.current.length > 0 && gameSettings.mode !== "review") return
            selectedPiece.current = index;
            
            const squareIndex = piecesStates.current[index].squareIndex;
            const cord = getSquareCord(squareIndex);
            const moves = chess.current.moves({ square: cord, verbose: true});
            const moveToIndexes = moves.map(x => getSquareIndex(x.to));

            const attackMoves = moves.filter(x => x.isCapture());
            const attackSquareIndexes = attackMoves.map(x => getSquareIndex(x.to));
            const attackPieceIndexes = attackSquareIndexes.map(s => piecesStates.current.findIndex(p => p.squareIndex === s && p.exists));
            const piecesTemp = [...piecesStates.current];
            piecesTemp.forEach((x,i) => piecesTemp[i].isAttacked = false);
            attackPieceIndexes.forEach((x,i) => piecesTemp[x].isAttacked = true);
            piecesStates.current = piecesTemp;

            let boardTemp = [...boardStatesRef.current];
            boardTemp.forEach((x, i) => boardTemp[i].state = "default"); 
            moveToIndexes.forEach((x,i) => boardTemp[x].state = "moveTo");
            setBoardStates(boardTemp);
            boardStatesRef.current = boardTemp

            const elements = getPieces(piecesTemp);
            setPiecesComponents(elements);
        }
        else{
            if(!selectedPiece.current) return
            const squareIndex = piecesStates.current[selectedPiece.current].squareIndex;
            const cord = getSquareCord(squareIndex);
            const moves = chess.current.moves({ square: cord, verbose: true});
            const moveToIndexes = moves.map(x => getSquareIndex(x.to));
            const attackedIndex = piecesStates.current[index].squareIndex;
            piecesStates.current.forEach((x,i) => piecesStates.current[i].isAttacked = false);

            if(moveToIndexes.includes(attackedIndex)){
                moveSound.play()

                const attackedCord = getSquareCord(attackedIndex);
                const selectedMove = moves.find(x => x.to === attackedCord);
                if(selectedMove.isPromotion()){
                    promotionMove.current = selectedMove;
                    setpromotionVisible(true);
                    return;
                }
                
                
                chess.current.move({from: cord, to: getSquareCord(attackedIndex)});
                if(gameSettings.mode === "review"){
                    if(redoStack.current.at(-1).lan !== selectedMove.lan || altRef.current.length > 0){
                        const temp = [...altRef.current];
                        temp.push({lan: cord+getSquareCord(attackedIndex)})
                        setAltStack(temp);
                        altRef.current = temp;
                    }
                }
                else{
                    switchPlayerTimer(chess.current.turn());
                }
                //en passant
                
                movePiece(selectedPiece.current, attackedIndex, false, gameSettings.mode === "review" || gameSettings.mode === "puzzle");
                if(gameSettings.mode === "puzzle"){
                    handlePuzzle(chess);
                }
            }
            if(chess.current.isGameOver()) handleGameOver();
            
        }
        
        
    },[])

    const selectSquare = useCallback((index) => {
        
        if(noteModeRef.current){
            handleArrow(index);
            return
        }

        if(redoStack.current.length > 0 && gameSettings.mode !== "review") return
        if(boardStatesRef.current[index].state === "moveTo"){
            console.log(boardStates)
            

            const fromIndex = piecesStates.current[selectedPiece.current].squareIndex;
            const moves = chess.current.moves({ square: getSquareCord(fromIndex), verbose: true});
            const selectedMove = moves.filter(x => x.to === getSquareCord(index))[0];
            const color = getPieceColor(piecesStates.current[selectedPiece.current]);
            piecesStates.current.forEach((x,i) => piecesStates.current[i].isAttacked = false);
            
            if(selectedMove.isPromotion()){
                promotionMove.current = selectedMove;
                setpromotionVisible(true);
                return;
            }
            console.log(selectedMove)
            if(selectedMove.isEnPassant()){
                if(selectedMove.color === "w"){
                    const capturedIndex = index - 8;
                    const capturedPieceIndex = piecesStates.current.findIndex(x => x.squareIndex === capturedIndex)
                    console.log(capturedPieceIndex)
                    piecesStates.current[capturedPieceIndex].exists = false;
                }
                else{
                    const capturedIndex = index + 8;
                    const capturedPieceIndex = piecesStates.current.findIndex(x => x.squareIndex === capturedIndex)
                    console.log(capturedPieceIndex)
                    piecesStates.current[capturedPieceIndex].exists = false;
                }
            }
            
            
            if(gameSettings.mode === "review"){
                if(redoStack.current.at(-1).lan !== selectedMove.lan || altRef.current.length > 0){
                    const temp = [...altRef.current];
                    temp.push({lan: getSquareCord(fromIndex)+getSquareCord(index)})
                    setAltStack(temp);
                    altRef.current = temp;

                }
                else{
                    redoStack.current.pop();
                };
                
            }
            else{
                switchPlayerTimer(chess.current.turn());
            }
            
            moveSound.play();
            if(Platform.OS !== 'web') Haptics.impactAsync();
            movePiece(selectedPiece.current, index, false, gameSettings.mode === "review" || gameSettings.mode === "puzzle");

            if(selectedMove.isKingsideCastle()){
                const kingRookIndex = piecesStates.current.findIndex((x,i) => i > selectedPiece.current && x.pieceType.toUpperCase() === "R" && getPieceColor(x) === color);
                movePiece(kingRookIndex, index - 1, null, true);
                
            }
            if(selectedMove.isQueensideCastle()){
                const queenRookIndex = piecesStates.current.findIndex((x,i) => i < selectedPiece.current && x.pieceType.toUpperCase() === "R" && getPieceColor(x) === color); 
                movePiece(queenRookIndex, index + 1, null, true);
            }
            chess.current.move({from: getSquareCord(fromIndex), to: getSquareCord(index)});
            
            if(chess.current.isGameOver()) handleGameOver();
            
            if(gameSettings.mode === "puzzle"){
                handlePuzzle(chess);
            }
            selectedPiece.current = null;
            
        }
    }, [])
      
    const selectPromotion = (index) => {
        let piece;
        if(index === 0) piece = 'r';
        if(index === 1) piece = 'n';
        if(index === 2) piece = 'b';
        if(index === 3) piece = 'q';
        
        
        if(gameSettings.mode === "review"){
            const temp = [...altRef.current];
            temp.push({lan: promotionMove.current.from+promotionMove.current.to+"="+piece})
            setAltStack(temp);
            altRef.current = temp;

        }
        else{
            switchPlayerTimer(chess.current.turn());
        }
        piecesStates.current.forEach((x,i) => piecesStates.current[i].isAttacked = false);
        chess.current.move({from: promotionMove.current.from, to: promotionMove.current.to, promotion: piece})
        const coloredPiece = getPieceColor(piecesStates.current[selectedPiece.current]) === "b"? piece: piece.toUpperCase();
        movePiece(selectedPiece.current, getSquareIndex(promotionMove.current.to), coloredPiece, gameSettings.mode === "review", gameSettings.mode === "puzzle");
        setpromotionVisible(false);
        if(chess.current.isGameOver()) handleGameOver();
    }

    const handleAiMove = (move) => {

        if(!move[1]) return
        

        const allMoves = chess.current.moves({verbose: true});
        const selectedMove = allMoves.find(x => x.lan === move[1].lan);
        const fromIndex= getSquareIndex(selectedMove.from);
        const pieceIndex = piecesStates.current.findIndex(x => x.squareIndex === fromIndex && x.exists);
        const toIndex = getSquareIndex(selectedMove.to);
        piecesStates.current.forEach((x,i) => piecesStates.current[i].isAttacked = false);
        const color = getPieceColor(piecesStates.current[pieceIndex]);
        switchPlayerTimer(chess.current.turn());
        let promotion = selectedMove.promotion? selectedMove.promotion : false
        if(selectedMove.color === "w" && promotion) promotion = promotion.toUpperCase()
        
        chess.current.move(selectedMove);
        
        movePiece(pieceIndex, toIndex, promotion);
        
        moveSound.play();
        if(Platform.OS !== 'web') Haptics.selectionAsync();

        if(selectedMove.isEnPassant()){
                if(selectedMove.color === "w"){
                    const capturedIndex = toIndex - 8;
                    const capturedPieceIndex = piecesStates.current.findIndex(x => x.squareIndex === capturedIndex)
                    console.log(capturedPieceIndex)
                    piecesStates.current[capturedPieceIndex].exists = false;
                }
                else{
                    const capturedIndex = toIndex + 8;
                    const capturedPieceIndex = piecesStates.current.findIndex(x => x.squareIndex === capturedIndex)
                    console.log(capturedPieceIndex)
                    piecesStates.current[capturedPieceIndex].exists = false;
                }
            }

        

        if(selectedMove.isKingsideCastle()){
            const kingRookIndex = piecesStates.current.findIndex((x,i) =>i > pieceIndex && x.pieceType.toUpperCase() === "R" && getPieceColor(x) === color);
            movePiece(kingRookIndex, toIndex - 1,  null, true);
            
        }
        if(selectedMove.isQueensideCastle()){
            const queenRookIndex = piecesStates.current.findIndex((x,i) => i < pieceIndex && x.pieceType.toUpperCase() === "R" && getPieceColor(x) === color); 
            movePiece(queenRookIndex, toIndex + 1,null, true);
        }

        if(chess.current.isGameOver()) handleGameOver();
        
    }
    const handleHintResponse = async (move) => {

        if(!move[1]) return

        const allMoves = chess.current.moves({verbose: true});
        const selectedMove = allMoves.find(x => x.lan === move[1].lan);
        const fromIndex= getSquareIndex(selectedMove.from);
        const pieceIndex = piecesStates.current.findIndex(x => x.squareIndex === fromIndex && x.exists);
        const toIndex = getSquareIndex(selectedMove.to);
        piecesStates.current[pieceIndex].selected = true;
        piecesStates.current.forEach((x,i) => piecesStates.current[i].isAttacked = false);
        const boardTemp = [...boardStatesRef.current];
        boardTemp.forEach(x => x.state = "default")
        boardTemp[toIndex].state = "moveTo";
        setBoardStates(boardTemp);
        boardStatesRef.current = boardTemp;
        selectedPiece.current = pieceIndex;

        const elements = getPieces(piecesStates.current);
        setPiecesComponents(elements);
    }
    const {start, stop, sendCommand} = useNativeStockfish(handleAiMove);

    const showBotError = (error) => {
        setBotErrorVisible(true);
        setBotErrorContent(error);
        startPause();
    }

    const requestAiMove = async () => {
        if(gameResult.result || gameSettings.mode === "review" || gameSettings.mode === "puzzle") return

        const turn = chess.current.turn();
        const sideIndex = turn === 'w'? 0:1;

        const skillTable = [
            [{depth: 1, weight: 3},{depth: 2, weight: 2}],
            [{depth: 1, weight: 2},{depth: 2, weight: 2},{depth: 3, weight: 1}],
            [{depth: 3, weight: 3},{depth: 4, weight: 2},{depth: 6, weight: 1}],//3.8
            [{depth: 3, weight: 1},{depth: 4, weight: 1},{depth: 5, weight: 3}],//4.4
            [{depth: 4, weight: 2},{depth: 5, weight: 2},{depth: 6, weight: 2}],//5.0
            [{depth: 4, weight: 1},{depth: 5, weight: 2},{depth: 6, weight: 3}],//5.3
            [{depth: 5, weight: 2},{depth: 6, weight: 2},{depth: 7, weight: 2}],//6.0
            [{depth: 6, weight: 3},{depth: 7, weight: 2},{depth: 9, weight: 1}],//6.8
            [{depth: 7, weight: 1},{depth: 8, weight: 2},{depth: 9, weight: 2}],//8.2
            [{depth: 9, weight: 3},{depth: 10, weight: 2},{depth: 11, weight: 1}],//9.6
            [{depth: 9, weight: 2},{depth: 10, weight: 2},{depth: 11, weight: 3}],//10.1
            [{depth: 10, weight: 1},{depth: 11, weight: 2},{depth: 12, weight: 2}],//11.2
            [{depth: 12, weight: 2},{depth: 13, weight: 3},{depth: 15, weight: 2}],//13.2
            [{depth: 13, weight: 2},{depth: 14, weight: 3},{depth: 16, weight: 2}],//14.2
            [{depth: 16, weight: 1}],//16.0
        ]

        const getWeightedRandom = (data) =>{
            console.log(data);
            if (!data || data.length === 0) {
                return null;
            }

            const totalWeight = data.reduce((sum, entry) => sum + (entry.weight || 0), 0);

            if (totalWeight <= 0) {
                return data[Math.floor(Math.random() * data.length)] || null; // Fallback to uniform random
            }

            const randomNumber = Math.random() * totalWeight;
            let cumulativeWeight = 0;

            for (const entry of data) {
                const weight = entry.weight || 0;
                cumulativeWeight += weight;
                if (randomNumber <= cumulativeWeight) {
                console.log(entry)
                return entry;
                }
            }

            return null; // Should not reach here if totalWeight > 0
        }
        console.log(getWeightedRandom(skillTable[gameSettings.aiMode[sideIndex].level- 1] ).depth)
        if(gameSettings.aiMode[sideIndex].type === "player") return

        
        const bookMove = await findBookMove(chess.current.fen(), chess);
        if(bookMove){ 
            handleAiMove([0, bookMove]);
            return;
          }
        if(gameSettings.aiMode[sideIndex].type === "native"){
            
            sendCommand("position fen "+chess.current.fen());
            sendCommand("go depth "+getWeightedRandom(skillTable[gameSettings.aiMode[sideIndex].level- 1]).depth);
        }
        if(gameSettings.aiMode[sideIndex].type === "rest"){
            console.log("fen" + chess.current.fen())
            getStockishRest(chess.current.fen(), gameSettings.aiMode[sideIndex].level - 1, handleAiMove, showBotError)
        }
        if(gameSettings.aiMode[sideIndex].type === "custom"){
            GetBestMove(chess.current, gameSettings.aiMode[sideIndex].level - 1, handleAiMove)
        }

    }
    
    const requestHint = async () =>{
        if(isConnected){
            getStockishRest(chess.current.fen(), 10/*max*/, handleHintResponse)
        }
        else if(Platform.OS === 'android'){
            /*sendCommand("position fen "+chess.current.fen());
            sendCommand("go depth 10");
            */
            //implement different callback
        }
        else{
            GetBestMove(chess.current, 10/*max*/, handleHintResponse)
        }
    }
    const undo = (teleport, puzzle) => {
        console.log("undo");
        
        let repetitions = gameSettings.addRules.undo? 2 : 1;
        if(gameSettings.mode === "review") repetitions = 1;
        if(teleport || puzzle) repetitions = 1;
        for (let i = 0; i < repetitions; i++) {
            
            const popped = chess.current.undo({verbose: true});
            if((teleport && altRef.current.length === 0) || !gameSettings.addRules.undo || (gameSettings.mode === "review" && altRef.current.length === 0) || (puzzle && puzzleStatus.finished)) {
                redoStack.current.push(popped);
                console.log("pushing", popped, teleport)
            }
            if (gameSettings.mode === "review" && altStack.length !== 0){
                const temp = [...altRef.current];
                temp.pop();
                setAltStack(temp);
                altRef.current = temp;
            }
            if(!popped) return;
            
            const allMoves = chess.current.moves({verbose: true});
            const move = allMoves.find(x => x.lan === popped.lan);
            const toSquare = getSquareIndex(move.to);
            const fromSquare = getSquareIndex(move.from);
            const compareColors = (val1, val2) => {
                return (val1 === 'w' && val2 === val2.toUpperCase()) || (val1 === 'b' && val2 === val2.toLowerCase())
                
            };

            const movedPiece = piecesStates.current.findIndex(x => x.squareIndex === toSquare && x.exists);
            const takenPiece = piecesStates.current.findIndex(x => x.squareIndex === toSquare && !x.exists && x.pieceType.toLowerCase() === popped.captured && !compareColors(popped.color, x.pieceType));
            if(takenPiece !== -1) {
                piecesStates.current[takenPiece].exists = true; 
            }
            if(move.isEnPassant()){
                if(move.color === "w"){
                    const capturedIndex = toSquare - 8;
                    const capturedPieceIndex = piecesStates.current.findIndex(x => x.squareIndex === capturedIndex)
                    console.log(capturedPieceIndex)
                    piecesStates.current[capturedPieceIndex].exists = true;
                }
                else{
                    const capturedIndex = toSquare + 8;
                    const capturedPieceIndex = piecesStates.current.findIndex(x => x.squareIndex === capturedIndex)
                    console.log(capturedPieceIndex)
                    piecesStates.current[capturedPieceIndex].exists = true;
                }
            }
            const color = getPieceColor(piecesStates.current[movedPiece]);
            movePiece(movedPiece, fromSquare, null, true);//add anti-promotion
            if(move.isKingsideCastle()){
                const kingRookIndex = piecesStates.current.findIndex((x,i) =>i > movedPiece && x.pieceType.toUpperCase() === "R" && getPieceColor(x) === color);
                movePiece(kingRookIndex, toSquare +1,  null, true);
                
            }
            if(move.isQueensideCastle()){
                const queenRookIndex = piecesStates.current.findIndex((x,i) => i < movedPiece && x.pieceType.toUpperCase() === "R" && getPieceColor(x) === color); 
                movePiece(queenRookIndex, toSquare - 2,null, true);
            }
            const elements = getPieces(piecesStates.current);
            setPiecesComponents(elements);
    }
    }
    const redo = () => {
        console.log(redoStack.current)
        if(redoStack.current.length === 0 || altStack.length !== 0) return;
        
        const move = redoStack.current.pop();
        const allMoves = chess.current.moves({verbose: true});
        const selectedMove = allMoves.find(x => x.lan === move.lan);
        if(!selectedMove) return
        const {fromIndex, pieceIndex, toIndex, color} = handleMoveEssentials(selectedMove);

        if(selectedMove.isEnPassant()){
                if(selectedMove.color === "w"){
                    const capturedIndex = toIndex - 8;
                    const capturedPieceIndex = piecesStates.current.findIndex(x => x.squareIndex === capturedIndex)
                    console.log(capturedPieceIndex)
                    piecesStates.current[capturedPieceIndex].exists = false;
                }
                else{
                    const capturedIndex = toIndex + 8;
                    const capturedPieceIndex = piecesStates.current.findIndex(x => x.squareIndex === capturedIndex)
                    console.log(capturedPieceIndex)
                    piecesStates.current[capturedPieceIndex].exists = false;
                }
            }
       
        
        
        chess.current.move(selectedMove);
        if(redoStack.current.length === 0){
            movePiece(pieceIndex, toIndex, null, false);
        }
        else{
            movePiece(pieceIndex, toIndex, null, true);
        }
        

    }
    const handleGameOver = async (isResign, isTime, timeColor) => {
        if(gameSettings.mode !== "play") return
        if(gameResult.result) return
        whitePause();
        blackPause(); 
        
        const result = {};
        setGameoverVisible(true);
        if(isResign){
            setGameResult({result: "resign", color: chess.current.turn()})
            result.cause = "resign";
            result.win = chess.current.turn() === 'w'? 'b': 'w';
        }
        if(isTime){
            setGameResult({result: "time", color: timeColor})
            result.cause = "time";
            result.win = timeColor === 'w'? 'b': 'w';
        }

        if(chess.current.isCheckmate()){
            setGameResult({result: "mate", color: chess.current.turn()})
            result.cause = "mate";
            result.win = chess.current.turn() === 'w'? 'b': 'w';
        }
        if(chess.current.isDrawByFiftyMoves()){
            setGameResult({result: "50MoveDraw", color: "draw"})
            result.cause = "50MoveDraw";
            result.win = "draw";
            
        }
        if(chess.current.isInsufficientMaterial()){
            setGameResult({result: "materialDraw", color: "draw"})
            result.cause = "materialDraw";
            result.win = "draw";
        }
        if(chess.current.isStalemate()){
            setGameResult({result: "stalemate", color: "draw"})
            result.cause = "stalemate";
            result.win = "draw";
        }
        const history = chess.current.history({ verbose: true });
        const lans = history.map(x => ({lan: x.lan}));
        const sans = history.map(x => ({lan: x.san}));
        let playerSide = gameSettings.aiMode.findIndex(x => x.type === "player");
        let opponentSide = 1 - playerSide;
        const opponent = {...gameSettings.aiMode[opponentSide]}

        const time = {...gameSettings.time}
        if(gameSettings.aiMode[0].type === "player" && gameSettings.aiMode[1].type === "player") playerSide = "both";
        const temp = await getItem("ChessYouGames", []);
        let fen = gameSettings.fen;
        if(fen.trim() === "") fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        
        temp.push({lans, sans, result, playerSide, opponent, time, fen});
        saveItem("ChessYouGames", temp);
    }
    const handleTimeEnd = (color) => {
        handleGameOver(false, true, color);

    }
    
    const [
        whiteTime,
        whiteStart,
        whitePause,
        whiteReset,
        whiteStatus,
        whiteAdvance
    ] = useCustomTimer(gameSettings.time.base, () => handleTimeEnd('w'));
    const [
        blackTime,
        blackStart,
        blackPause,
        blackReset,
        blackStatus,
        blackAdvance
    ] = useCustomTimer(gameSettings.time.base, () => handleTimeEnd('w'));

    const resign = () => {
        handleGameOver(true);
    }
    const rotate = () => {
        if(boardRotation === 'white'){
            setBoardRotation("black");
            boardRotRef.current = "black";
        }
        if(boardRotation === 'black'){
            setBoardRotation("white");
            boardRotRef.current = "white";
        }
    }
    
    const startPause = () => {
        if(gameResult.result) return
        const turn = chess.current.turn();
        const sideIndex = turn === 'w'? 0:1;
        
        if(paused) {
            const turn = chess.current.turn();
            if(turn === 'w') whiteStart();
            if(turn === 'b') blackStart();
            setPaused(false);
        }
        else{
            whitePause();
            blackPause();
            setPaused(true);
        }
        if(chess.current.history().length === 0 && gameSettings.aiMode[sideIndex].type !== "player"){
            requestAiMove();
        }
    }
    const switchPlayerTimer = (oldTurn, white, black) => {
        if(gameSettings.mode === "puzzle" || gameSettings.mode === "review") return
        const additionTime = -gameSettings.time.add;
        setPaused(false);
        if(oldTurn === 'w'){
            whiteAdvance(additionTime);
            whitePause();
            blackStart();
        }
        else{
            blackAdvance(additionTime);
            blackPause();
            whiteStart();
        }
    }
    const selectMove = useCallback((chess, toIndex, altStack, isAlt) => {
        if(isAlt) {
            const fromIndex = chess.current.history().length;
            //to index mus be smaller than fromIndex
            for(let i = 0; i <fromIndex - toIndex; i++){
                undo(true);
            }

        }
        const fromIndex = chess.current.history().length;
        //if going forward, redo
        if(fromIndex < toIndex){
            for(let i = 0; i < toIndex - fromIndex; i++){
                redo();
            }
        }else{
        //if going backward, undo
        for(let i = 0; i <fromIndex - toIndex; i++){
            undo(true);
        }
        }

    }, [])
    const handlePuzzle = (chess) => {
    
        if(chess.current.history({verbose: true}).at(-1).lan === puzzleMovesRef.current[chess.current.history().length - 2]){
            setPuzzleStatus({started: true, isOk: true, finished: !puzzleMovesRef.current[chess.current.history().length - 1]});
            if(!puzzleMovesRef.current[chess.current.history().length - 1]){
                const temp = puzzleHistoryRef.current.slice();
                if(temp.at(-1).status === "unfinished"){
                    temp.at(-1).status = 'done'
                    setPuzzlesHistory(temp);
                    puzzleHistoryRef.current = temp;
                }
                return
            }
            const allMoves = chess.current.moves({verbose: true});
            const selectedMove = allMoves.find(x => x.lan === puzzleMovesRef.current[chess.current.history().length - 1]);
            console.log(selectedMove)
            const {fromIndex, pieceIndex, toIndex, color} = handleMoveEssentials(selectedMove);
            setTimeout(() => {
                chess.current.move(selectedMove);
            movePiece(pieceIndex, toIndex,false, true);
            }, 500);
            
        }
        else{
            const temp = puzzleHistoryRef.current.slice();
            if(temp.at(-1)) temp.at(-1).status = 'wrong'
            
            setPuzzlesHistory(temp);
            puzzleHistoryRef.current = temp
            setPuzzleStatus({started: true, isOk: false, finished: false});
            setTimeout(() => {
                undo(false, true);
            }, 500);
            
        }
    }
    const puzzleHint = () => {
        const move = puzzleMovesRef.current[chess.current.history().length - 1];

        const allMoves = chess.current.moves({verbose: true});
        const selectedMove = allMoves.find(x => x.lan === move);
        if(!selectedMove) return
        const {fromIndex, pieceIndex, toIndex, color} = handleMoveEssentials(selectedMove, true);
        piecesStates.current[pieceIndex].selected = true;
        const boardTemp = [...boardStatesRef.current];
        boardTemp.forEach(x => x.state = "default")
        boardTemp[toIndex].state = "moveTo";
        setBoardStates(boardTemp);
        boardStates.current = boardTemp;
        selectedPiece.current = pieceIndex;

        const elements = getPieces(piecesStates.current);
        setPiecesComponents(elements);
    }
    const puzzleSolution = () => {
            const allMoves = chess.current.moves({verbose: true})
            const selectedMove = allMoves.find(x => x.lan === puzzleMovesRef.current[chess.current.history().length - 1]);
            if(!selectedMove) return
            const {fromIndex, pieceIndex, toIndex, color} = handleMoveEssentials(selectedMove);

            switchPlayerTimer(chess.current.turn());
            chess.current.move(selectedMove);
            movePiece(pieceIndex, toIndex,false, true);
            handlePuzzle(chess);
    }
    const nextPuzzle = () => {
        const puzzles = require('../../assets/puzzles/puzzles1.json');

        const index = Number(gameSettings.game);
        let filter = '';
        if(index === 1){
            filter = "rookEndgame"
        }
        if(index === 2){
            filter = "queenEndgame"
        }
        if(index === 3){
            filter = "knightEndgame"
        }
        if(index === 4){
            filter = "bishopEndgame"
        }
        if(index === 5){
            filter = "fork"
        }
        if(index === 6){
            filter = "opening"
        }
        if(index === 7){
            filter = "opening"
        }
        if(index === 8){
            filter = "middlegame"
        }

        const targetElo = difficulty? difficulty: 1200;

        const filtered = filter === '' ? puzzles.filter(x => x.Rating > targetElo - 100 && x.Rating < targetElo + 100) : puzzles.filter(x => x.Themes.includes(filter) && x.Rating > targetElo - 100 && x.Rating < targetElo + 100);


        const puzzleIndex = Math.floor(Math.random() * filtered.length);

        const selectedPuzzle = filtered[puzzleIndex];
        const moves = selectedPuzzle.Moves.split(" ");
        const tempChess = new Chess(selectedPuzzle.FEN);
        
        
        // Create a copy of moves array before modifying
        const firstMove = moves[0];
        const remainingMoves = moves.slice(1);
        selectedPiece.current = null;
        
        tempChess.move(firstMove);
        setPuzzleMoves(remainingMoves);
        
        // Add a ref to track moves if needed
        puzzleMovesRef.current = remainingMoves;
        chess.current = tempChess;
        console.log(chess.current.fen())
        setPuzzleStatus({started: false, finished: false, isOk: false});

        const temp = puzzleHistoryRef.current.slice();
        temp.push({status: 'unfinished'});
        setPuzzlesHistory(temp)
        puzzleHistoryRef.current = temp;

        const piecesTemp = fenToArray(chess.current.fen());
        piecesStates.current = piecesTemp;

        for (let i = 0; i < piecesTemp.length; i++) {
            const value = squarePositions.current[piecesTemp[i].squareIndex];
            piecesX.current[i].value = value.x;
            piecesY.current[i].value = value.y;
            }

        const elements = getPieces(piecesTemp);
        setPiecesComponents(elements);

        const sideName = tempChess.turn() === "w"? "white": "black";
        boardRotRef.current = sideName;
        setBoardRotation(sideName);
        

    }

    useEffect(() => {
        const setReviewStack = async (settings) => {
            console.log(settings)
            const games = await getItem("ChessYouGames", []);
            redoStack.current = games[settings.game].lans.reverse();
        }
        const loadReviewFen = async (settings) => {
            const games = await getItem("ChessYouGames", []);
            chess.current.load(games[settings.game].fen)
        }
        if(gameSettings.mode === "review"){
            setReviewStack(gameSettings);
            loadReviewFen(gameSettings)
        }
        if(gameSettings.mode === "puzzle"){
            nextPuzzle();
        }
        const sideIndex = gameSettings.aiMode.findIndex(x => x.type === "player");
        const sideName = sideIndex === 0 ? 'white' : 'black';
        if(gameSettings.mode === "play"){
            let fen = gameSettings.fen
            if(fen.trim() === "") fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
            chess.current.load(fen)
        }
        if(gameSettings.mode !== "puzzle"){
            setBoardRotation(sideName);
            boardRotRef.current = sideName;
        }
        
    },[gameSettings])

    const handleMoveEssentials = (move, ignoreCastle) => {
        const fromIndex= getSquareIndex(move.from);
        const pieceIndex = piecesStates.current.findIndex(x => x.squareIndex === fromIndex && x.exists);
        const toIndex = getSquareIndex(move.to);
        const color = getPieceColor(piecesStates.current[pieceIndex]);
        moveSound.play();
        if(Platform.OS !== 'web') Haptics.selectionAsync();

        if(ignoreCastle)  return {fromIndex, pieceIndex, toIndex, color}
        if(move.isKingsideCastle()){
            const kingRookIndex = piecesStates.current.findIndex((x,i) =>i > pieceIndex && x.pieceType.toUpperCase() === "R" && getPieceColor(x) === color);
            movePiece(kingRookIndex, toIndex - 1,  null, true);
            
        }
        if(move.isQueensideCastle()){
            const queenRookIndex = piecesStates.current.findIndex((x,i) => i < pieceIndex && x.pieceType.toUpperCase() === "R" && getPieceColor(x) === color); 
            movePiece(queenRookIndex, toIndex + 1,null, true);
        }
        if(chess.current.isGameOver()) handleGameOver();

        return {fromIndex, pieceIndex, toIndex, color}

    }

    const handleArrow = (index) => {
        if(!hasArrowStarted.current){
            arrowStartIndex.current = index;
            hasArrowStarted.current = true;
        }
        else{
            if(index === arrowStartIndex.current){
                return
            }
            const size = squarePositions.current[0].width;



            const startX = squarePositions.current[arrowStartIndex.current].x + (size/2);
            const startY = squarePositions.current[arrowStartIndex.current].y  + (size/2);

            let endX,endY;

            if(boardRotation === "White"){
                endX = (size * 7) - squarePositions.current[index].x +(size/2);
                endY = (size * 7) - squarePositions.current[index].y +(size/2);
            }
            else{
                endX = squarePositions.current[index].x +(size/2);
                endY = squarePositions.current[index].y +(size/2);
            }



            
            const temp = arrowsRef.current.slice();
            console.log(temp)

            temp.push({from: {x: startX, y: startY}, to: {x: endX, y: endY}});
            
            hasArrowStarted.current = false;
            setArrows(temp);
            arrowsRef.current = temp;
           
        }
        
    }
    const turnNoteMode = () => {
        if(noteModeRef){
            hasArrowStarted.current = false;
            setArrows([]);
            arrowsRef.current = [];
        }
        setNoteMode(!isNoteMode);
        
        noteModeRef.current = !noteModeRef.current;
    }
    const getButtons = useCallback(() => {
        if(isNoteMode){
        return [
            <IconButton mode="contained-tonal" onPress={() => turnNoteMode()} icon={"close"} key={0}/>,
            <IconButton mode="contained-tonal" onPress={() => {setArrows([]); hasArrowStarted.current = false; arrowsRef.current = []}} icon={"trash-can"} key={1}/>
            
            
        ]
    }
    else{
    if(gameSettings.mode === "puzzle"){
        console.log(puzzleStatus)
        if(puzzleStatus.finished){
            
            return[
                <IconButton mode="contained-tonal" onPress={() => undo(false, true)} icon={"undo"} key={0}/>,
                <IconButton mode="contained-tonal" onPress={() => redo()} icon={"redo"} key={1}/>,
                <IconButton mode="contained-tonal" onPress={() => nextPuzzle()} icon={"play"} key={2}/>,
                
                
            ]
        }
        else{
            return [
                <IconButton mode="contained-tonal" onPress={() => puzzleHint()} icon={"lightbulb"} key={0}/>,
                <IconButton mode="contained-tonal" onPress={() => puzzleSolution()} icon={"help-circle-outline"} key={1}/>,
                <IconButton mode="contained-tonal" onPress={() => turnNoteMode()} icon={"pen"} key={2}/>
                
            ]
        }
        
    }
    if(gameSettings.mode === "play"){
        return [
            pauseButton && <IconButton mode="contained-tonal" onPress={() => startPause()} icon={startPauseIcon} key={0}/>,
            <IconButton mode="contained-tonal" onPress={() => rotate()} icon={"rotate-left"} key={1}/>,
            gameSettings.addRules.hint && <IconButton mode="contained-tonal" onPress={() => requestHint()} icon={"lightbulb"} key={2}/>,
            gameSettings.addRules.undo && <IconButton mode="contained-tonal" onPress={() => undo()} icon={"undo-variant"} key={3}/>,
            <IconButton mode="contained-tonal" onPress={() => resign()} icon={"flag-outline"} key={4}/>,
            <IconButton mode="contained-tonal" onPress={() => turnNoteMode()} icon={"pencil-outline"} key={5}/>,
        ]
    }
    if(gameSettings.mode === "review"){
        return [
            <IconButton mode="contained-tonal" onPress={() => rotate()} icon={"rotate-left"} key={0}/>,
        ]
    }
    }
}, [isNoteMode, paused, puzzleMoves, puzzleStatus, boardRotation, puzzleStatus])
    

    

    const startPauseIcon = paused ? 'play':  'pause';
    const pauseButton = gameSettings.addRules.pause || (paused);

    const iconButtons = getButtons();
    


    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;



    if(windowHeight<windowWidth){
        return(<>
            <GameOverModal  visible={gameoverVisible} setVisible={setGameoverVisible} gameResult={gameResult}/>
            <PromotionModal visible={promotionVisible} setVisible={setpromotionVisible} select={selectPromotion}/>
            <BotErrorModal visible={botErrorVisible} setVisible={setBotErrorVisible} content={botErrorContent}/>
        
            
            <View style={{flex: 1, display: 'flex', justifyContent: 'space-around', alignContent: 'center', flexDirection: 'row', padding: 10}}>
                <View>
                <NoteOverlay
                arrowsList={arrows}
                mode={isNoteMode}
                />
                {piecesComponents}
                <Board
                    squarePositions={squarePositions}
                    piecesStates={piecesStates}
                    piecesX={piecesX}
                    piecesY={piecesY}
                    setPiecesComponents={setPiecesComponents}
                    selectSquare={selectSquare}
                    boardStates={boardStates}
                    chess={chess}
                    getPieces={getPieces}
                    boardRotation={boardRotation}
                    boardRotRef={boardRotRef}
                    />
                    </View>
                <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: windowWidth / 4}}>
                <MoveIndicator
                    turn={chess.current.turn()}
                    playerSide={gameSettings.aiMode.findIndex(x => x.type === "player")}
                    mode={gameSettings.mode}
                    status={puzzleStatus}
                />
                <History
                    gameIndex={gameSettings.game}
                    chess={chess}
                    altStack={altStack}
                    mode={gameSettings.mode}
                    piecesComponents={piecesComponents}
                    selectMove={selectMove}
                    horizontal={false}
                    backIcon={<IconButton onPress={() => undo(true)} icon={"arrow-left"}/>}
                    forwardIcon={<IconButton onPress={() => redo()} icon={"arrow-right"}/>}
                />
               
                <PuzzleHistory history={puzzlesHistory}/>
                <TimerComponent
                    miliseconds={whiteTime}
                    color={'w'}/>
                <TimerComponent
                    miliseconds={blackTime}
                    color={'b'}/>
                <View style={{display: 'flex', flexDirection: 'row'}}>
                {iconButtons}
                </View>
                </View>
            </View>
            
            </>
            
        )
    }
    else{
        return(<>
            <GameOverModal  visible={gameoverVisible} setVisible={setGameoverVisible} gameResult={gameResult}/>
            <PromotionModal visible={promotionVisible} setVisible={setpromotionVisible} select={selectPromotion}/>
            <BotErrorModal visible={botErrorVisible} setVisible={setBotErrorVisible} content={botErrorContent}/>
            
            <View style={{flex: 1, display: 'flex', justifyContent: 'center', alignContent: 'center', flexDirection: 'column', alignItems: 'center', paddingBottom: insets.bottom, padding: 10, paddingTop: 15}}>
                <MoveIndicator
                        turn={chess.current.turn()}
                        playerSide={gameSettings.aiMode.findIndex(x => x.type === "player")}
                        mode={gameSettings.mode}
                        status={puzzleStatus}
                    />
                    <History
                        gameIndex={gameSettings.game}
                        chess={chess}
                        altStack={altStack}
                        mode={gameSettings.mode}
                        piecesComponents={piecesComponents}
                        selectMove={selectMove}
                        horizontal={true}
                        backIcon={<IconButton onPress={() => undo(true)} icon={"arrow-left"}/>}
                        forwardIcon={ <IconButton onPress={() => redo()} icon={"arrow-right"}/>}
                />
                <View>
                {piecesComponents}
                <NoteOverlay
                arrowsList={arrows}
                mode={isNoteMode}
                />
                <Board
                    squarePositions={squarePositions}
                    piecesStates={piecesStates}
                    piecesX={piecesX}
                    piecesY={piecesY}
                    setPiecesComponents={setPiecesComponents}
                    selectSquare={selectSquare}
                    boardStates={boardStates}
                    chess={chess}
                    getPieces={getPieces}
                    boardRotation={boardRotation}
                    />
                    </View>
                    
                
                <PuzzleHistory history={puzzlesHistory}/>
            
            
            <TimerComponent
                miliseconds={whiteTime}
                color={'w'}/>
            <TimerComponent
                miliseconds={blackTime}
                color={'b'}/>
           
            <View style={{display: 'flex', flexDirection: 'row'}}>
            
            {iconButtons}
            
            </View>
            </View>
            </>
        )
    }
    
}
export default PlayMode