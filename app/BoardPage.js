import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState} from 'react'
import PlayMode from '../components/Play/PlayMode'
import { useLocalSearchParams } from 'expo-router'

const BoardPage = () => {
  const {settings, difficulty} = useLocalSearchParams();

  const convertToObject = (string) => {
    const data = {};
    const parts = string.split("x");
    if(parts[0][0] === "p") data.mode = 'play';
    if(parts[0][0] === "r") data.mode = 'review';
    if(parts[0][0] === "z") data.mode = 'puzzle';
    data.aiMode = [{}, {}];
    if(parts[0][1] === 'p') data.aiMode[0].type ='player';
    if(parts[0][1] === 'r') data.aiMode[0].type ='rest';
    if(parts[0][1] === 'n') data.aiMode[0].type ='native';
    if(parts[1][0] === 'c') data.aiMode[1].type ='custom';
    data.aiMode[0].level = Number(parts[0].slice(2));
    if(parts[1][0] === 'p') data.aiMode[1].type ='player';
    if(parts[1][0] === 'r') data.aiMode[1].type ='rest';
    if(parts[1][0] === 'n') data.aiMode[1].type ='native';
    if(parts[1][0] === 'c') data.aiMode[1].type ='custom';
    data.aiMode[1].level = Number(parts[1].slice(1));
    data.time = {};
    data.time.base = Number(parts[2]);
    data.time.add = Number(parts[3]);
    data.addRules = {};
    data.addRules.undo = parts[4][0] === "t";
    data.addRules.pause = parts[4][1] === "t";
    data.addRules.hint = parts[4][2] === "t";
    data.fen = parts[5]
    data.game = parts[6];
    return data;

  }

  const [gameSettings, setGameSettings] = useState(convertToObject(settings));

  
  return (
    <PlayMode gameSettings={gameSettings} difficulty={difficulty}/>
  )
}

export default BoardPage

const styles = StyleSheet.create({})