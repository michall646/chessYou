import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useRef, useCallback } from 'react'
import { Button, SegmentedButtons, RadioButton, useTheme, TextInput } from 'react-native-paper'
import { router } from 'expo-router'
import Slider from '@react-native-community/slider'
import BotSelection from './BotSelection'
import NumberPicker from '../../../components/utils/NumberPicker'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import TimeSelection from './TimeSelection'
import AdditionalSelection from './AdditionalSelection'
import { useTranslation } from 'react-i18next'
import { validateFen } from 'chess.js'

const Options = () => {
    const [playerSide, setPlayerSide] = useState('w');
    const [fen, setFen] = useState("");
    const [fenOk, setFenOk] = useState(true);
    const botSheetRef = useRef(null);
    const timeSheetRef = useRef(null);
    const addSheetRef = useRef(null);
    
    const {t} = useTranslation();
    const theme = useTheme();

  // callbacks
  const handleBotPresent = useCallback(() => {
    botSheetRef.current?.present();
    timeSheetRef.current?.dismiss();
    addSheetRef.current?.dismiss();
  }, []);
  const handleTimePresent = useCallback(() => {
    timeSheetRef.current?.present();
    botSheetRef.current?.dismiss();
    addSheetRef.current?.dismiss();
  }, []);
  const handleAddPresent = useCallback(() => {
    addSheetRef.current?.present();
    timeSheetRef.current?.dismiss();
    botSheetRef.current?.dismiss();
  }, []);
    
    const [gameSettings, setGameSettings] = useState({
      mode: "play", 
      aiMode: [{type: 'player', level: 10}, {type: 'rest', level: 10}],
      time: {base: 300, add: 1000},
      game: 0,
      
      addRules: {
        undo: true,
        pause: true,
        hint: true
      },
      puzzle: 0
      
    });
    const handlePlayerSideChange = (value) => {
      const temp = {...gameSettings};
      let playerVal = 0;
      let opponentVal = 1;
      if(value === "b"){
        playerVal = 1;
        opponentVal = 0;
      }
      if(value === "r"){
        const rand = Math.round(Math.random());
        playerVal = rand;
        opponentVal = (rand + 1) % 2; //opposite of rand
      }
      
      if(temp.aiMode[opponentVal].type === 'player') {
        temp.aiMode[opponentVal] = {...temp.aiMode[playerVal]};
      }
      temp.aiMode[playerVal].type = "player";
      temp.aiMode[playerVal].level = 10;
      setPlayerSide(value);
      setGameSettings(temp);
    }
    
    const convertToString = (data) => {
      let string = '';
      if(data.mode === 'play') string += 'p';
      if(data.mode === 'review') string += 'r';
      if(data.mode === 'puzzle') string += 'z';
      for(let i in data.aiMode){
        switch (data.aiMode[i].type) {
          case 'player':
            string += 'p';
            break;
          case 'rest':
            string += 'r';
            break;
          case 'native':
            string += 'n';
            break;
          case 'custom':
            string += 'c';
            break;
          default:
            string += 'p';
            break;
        }
        string += data.aiMode[i].level;
        string += 'x';
      }
      string += data.time.base;
      string += 'x';
      string += data.time.add;
      string += 'x';
      string += data.addRules.undo ? 't' : 'f';
      string += data.addRules.pause ? 't' : 'f';
      string += data.addRules.hint ? 't' : 'f';
      string += 'x';
      string += fen;
      string += 'x';
      string += data.game;
      console.log(string);
      return string
    }
    const handlePlayPress =() => {
      router.push({ pathname: "/BoardPage", params: { settings:  convertToString(gameSettings) }});
      botSheetRef.current.dismiss();
      timeSheetRef.current.dismiss();
      addSheetRef.current.dismiss();
      
    }
    const handleFenChange = (value) => {
      console.log(value)
      const result = validateFen(value)
      if(value.trim() === "") result.ok = true
      setFenOk(result.ok)
      setFen(value)
    }

    const whiteIcon = theme.dark? "square-rounded": "square-rounded-outline";
    const blackIcon = theme.dark? "square-rounded-outline": "square-rounded";

  return (
    <View style={{padding: 15}}>
      
      <SegmentedButtons
        value={playerSide}
        style={{marginVertical: 8}}
        onValueChange={handlePlayerSideChange}
        buttons={[
          {
            value: 'w',
            icon: whiteIcon,
          },
          {
            value: 'r',
            icon: "dice-6-outline",
          },
          { 
            value: 'b',
            icon: blackIcon, 
        },
        ]}
      />
      
      <BottomSheetModal
            backgroundStyle={{backgroundColor: theme.colors.surfaceVariant}}
            ref={botSheetRef}
          >
            <BottomSheetView style={styles.contentContainer}>
            <BotSelection
              gameSettings={gameSettings}
              setGameSettings={setGameSettings}
            />
            </BottomSheetView>
      </BottomSheetModal>
      <BottomSheetModal
            backgroundStyle={{backgroundColor: theme.colors.surfaceVariant}}
            ref={timeSheetRef}
          >
            <BottomSheetView style={styles.contentContainer}>
              <TimeSelection
                gameSettings={gameSettings}
                setGameSettings={setGameSettings}
              />
            </BottomSheetView>
      </BottomSheetModal>
      <BottomSheetModal
            backgroundStyle={{backgroundColor: theme.colors.surfaceVariant}}
            ref={addSheetRef}
          >
            <BottomSheetView style={styles.contentContainer}>
              <AdditionalSelection
                gameSettings={gameSettings}
                setGameSettings={setGameSettings}
              />
            </BottomSheetView>
      </BottomSheetModal>
      <Button
      mode='contained-tonal'
        onPress={handleBotPresent}
        style={{marginVertical: 5}}
      >{t("selectOpponent")}</Button>
      <Button
      mode='contained-tonal'
        onPress={handleTimePresent}
        style={{marginVertical: 5}}
      >{t("selectTime")}</Button>
      <Button
      mode='contained-tonal'
      onPress={handleAddPresent}
      style={{marginVertical: 5}}
      >{t("selectRules")}</Button>
    <TextInput 
      label={t("customFen")} 
      mode='outlined'
      style={{marginVertical: 10}}
      value={fen}
      onChangeText={handleFenChange}
      error={!fenOk}
      /> 
    <Button mode='contained' disabled={!fenOk} style={{marginVertical: 8}} onPress={() =>  handlePlayPress()}>{t("play")}</Button>
    </View>
  )
}

export default Options

const styles = StyleSheet.create({})