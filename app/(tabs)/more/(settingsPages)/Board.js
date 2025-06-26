import { View} from 'react-native'
import React from 'react'
import BoardPreview from '../../../../components/utils/BoardPreview'
import {Dimensions} from 'react-native';
import { Text, Switch } from 'react-native-paper';
import OptionCard from '../OptionCard';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getItem, saveItem } from '../../../../engine/storageService';
import { useSettings } from '../../../../components/utils/SettingsContext';
import { Stack } from 'expo-router';

const Board = () => {
    const {settings, updateSettings} = useSettings();
    const [showIndexes, setIndexes] = useState(settings.showBoardIndexes);
    const [animations, setAnimations] = useState(settings.boardAnimations);
    const {t} = useTranslation();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const boardSize = Math.min(windowWidth* 0.8, windowHeight * 0.6);
    const padding = (windowWidth - boardSize)/2 - 5;
    

    const handleShowingIndexesChange = async () => {
        let copy = await getItem("ChessYouSettings", {themeIndex: 0});
        copy.showBoardIndexes = !showIndexes;
        saveItem("ChessYouSettings", copy);
        setIndexes(!showIndexes);
        updateSettings(copy);

    }
    const handleAnimationsChange = async () => {
      let copy = await getItem("ChessYouSettings", {themeIndex: 0});
        copy.boardAnimations = !animations;
        saveItem("ChessYouSettings", copy);
        setAnimations(!animations);
        updateSettings(copy);
    }

  return (
    <View style={{padding: 5}}>
        <Stack.Screen options={{title: t("board")}}/>
        <View style={{paddingHorizontal: padding}}>
        <BoardPreview
            size={boardSize}
            rotation={"white"}
            fen={"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}
        />
        </View>
        <OptionCard
          title={t("showBoardIndexes")}
          icon={"pound"}
          right={<Switch onValueChange={() => handleShowingIndexesChange()} value={showIndexes}/>}
          />
          <OptionCard
          title={t("useAnimations")}
          icon={"animation"}
          right={<Switch onValueChange={() => handleAnimationsChange()} value={animations}/>}
          />
    </View>
  )
}

export default Board