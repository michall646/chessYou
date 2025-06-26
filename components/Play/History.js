import { View, FlatList } from 'react-native'
import React, { useState, useEffect} from 'react'
import { getItem } from '../../engine/storageService';
import { Text, TouchableRipple } from 'react-native-paper';
import {memo} from 'react'

const History = ({gameIndex,chess, mode, altStack, piecesComponents, selectMove, horizontal, backIcon, forwardIcon}) => {
    const [textData, setTextData] = useState([]);
    const mod = function (n, m) {
      var remain = n % m;
      return Math.floor(remain >= 0 ? remain : remain + m);
  };
  const mapMoves = (item, index) =>{
    const moveNumber = Math.ceil((index + 1)/2);
    const turn = index % 2;
    let type = "move"
    if(index == chess.current.history().length - 1 && altStack.length === 0) type = "selectedMove";
    return({type, moveNumber, turn, text: item.lan})
  }
    const getTextData = (data) => {
        if(!data || data.length === 0) return [];
        const moves = mode === "review"? data.lans.map(mapMoves) : data.map(mapMoves);
        
        const result = [...moves];
        let length =  result.length;
        let moveIndex = 1;
        for (let i = 0; i < length; i += 3) {
            const element = {type: "index", text: `${moveIndex}.`}
            result.splice(i, 0, element);
            length ++;
            moveIndex++;
        }
        if(mode !== "review") return result

        moveIndex = Math.ceil((chess.current.history().length - altStack.length) / 2) + 1 ;
        console.log({moveIndex})
        const isAltBlack = (chess.current.history().length - altStack.length) % 2 === 1 && altStack.length !== 0
        console.log(chess.current.history().length, altStack.length)
        const altResult = [];
        const Altmoves = altStack.map((x,i) => ({type:"altMove", text:x.lan, moveNumber: moveIndex + Math.ceil((i + 1)/ 2) - 1, turn: (i + isAltBlack) % 2}));
        altResult.push(...Altmoves);

        if(isAltBlack){
          
          altResult.splice(0, 0, {type:"altMove", text:"----"});
        }
        length = altResult.length;

        for (let i = 0; i < length; i += 3) {
          const element = {type: "altIndex", text: `${moveIndex}.`}
          altResult.splice(i, 0, element);
          length ++;
          moveIndex++; 
        }

        
        console.log(Math.ceil((chess.current.history().length - altStack.length) / 2) +1)
        let altIndex = result.findLastIndex(x => x.moveNumber === Math.ceil((chess.current.history().length - altStack.length) / 2)) + 1;
        if(altIndex === -1) altIndex = result.length

        const preAlt = result.slice(0, altIndex);
        let indexReminder = preAlt.length % 3;
        preAlt.push(...new Array(mod(-indexReminder, 3)).fill({type: "empty", text: ""}));
        indexReminder = altResult.length % 3;
        altResult.push(...new Array(mod(-indexReminder, 3)).fill({type: "altEmpty", text: ""}));
        const postAlt = result.slice(altIndex);
        console.log([...preAlt, ...altResult, ...postAlt])
        return [...preAlt, ...altResult, ...postAlt]
    }
    useEffect(()=> {
      const setStorageHistory = async () => {
        const games = await getItem("ChessYouGames", []);
        setTextData(getTextData(games[gameIndex]));
      }
      if(mode === "review"){
        setStorageHistory();
      }
      else{
        setTextData(getTextData(chess.current.history({verbose: true})));
      }
    },[gameIndex, chess, mode, altStack, piecesComponents])

    const renderItem = ({item}) => {
      const weight = item.type === "selectedMove" ? 600:500;
      if(item.type === 'index' || item.type === "empty"){
        return <Text style={{margin: 3}}>{item.text}</Text>
      }
      if(item.type === "altIndex" || item.type === "altEmpty") 
        {
          return <Text style={{color: 'gray', margin: 3}}>{item.text}</Text>
        }
      if(item.type === "altMove"){
        return (<TouchableRipple onPress={() => selectMove(chess, (item.moveNumber - 1) * 2 + item.turn + 1, altStack, true)}>
        <   Text style={{margin: 3, color: 'gray',fontWeight: weight}}>{item.text}</Text>
    </TouchableRipple>)
      }
      if(item.type === "move" || item.type === "selectedMove") 
        {
          return (
            <TouchableRipple onPress={() => selectMove(chess, (item.moveNumber - 1) * 2 + item.turn + 1, altStack)}>
                <Text style={{margin: 3,fontWeight: weight}}>{item.text}</Text>
            </TouchableRipple>
          )
        }
     
    }
    if(horizontal){
      return (
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        {backIcon}
        <FlatList
            data={textData}
            renderItem={renderItem}
            horizontal={true}
        />
        {forwardIcon}
        </View>
      )
    }
    
  return (
    <>
    <FlatList
        data={textData}
        numColumns={3}
        renderItem={renderItem}
        horizontal={horizontal}
    />
    <View style={{display: 'flex', flexDirection: 'row'}}>
      {backIcon}
      {forwardIcon}
    </View>
    </>
  )
}

export default memo(History)