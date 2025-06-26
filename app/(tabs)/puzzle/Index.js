import { View} from 'react-native'
import React, { useState } from 'react'
import Card from './Card'
import { router } from 'expo-router'
import { Surface, Text, useTheme } from 'react-native-paper'
import { Slider } from '@miblanchard/react-native-slider'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'

const Index = () => {
    const [difficulty, setDifficulty] =useState(1000);
    const theme = useTheme();
    const {t} = useTranslation();
    const handleSelect = (index) => {
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
        const settings = "zp10xr10x5x5000xtttxx" + index
        router.push({ pathname: "/BoardPage", params: { settings:  settings, difficulty: difficulty}});
    }
    const renderThumbComponent = () => {
        return (<View style={{borderRadius: 100, width: 40, padding: 3, height: 35, backgroundColor: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                    <Text style={{color: theme.colors.onPrimary}}>
                        {difficulty}
                    </Text>
                </View>)
    }
  return (
    <SafeAreaView>
    <View style={{display: 'flex', flexDirection: 'column', padding: 5,}}>
    <Surface elevation={2} style={{padding: 5, height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
        <Text variant='headlineSmall'>
            {t("eloLevel")}
        </Text>
        <Slider
                minimumValue={200}
                maximumValue={2500}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.secondaryContainer}
                step={50}
                value={difficulty}
                onValueChange={setDifficulty}
                renderThumbComponent={renderThumbComponent}
                minimumTrackStyle={{ borderBottomRightRadius: 0, borderTopRightRadius: 0}}
                trackStyle={{height: 35, borderRadius: 100}}
                containerStyle={{width: '97%'}}

            />
    </Surface>
    <Card 
        icon="dots-horizontal"
        title={t("everything")}
        onPress={handleSelect}
        index={0}

    />
    <Card 
        icon="chess-rook"
        title={t("rookEnding")}
        onPress={handleSelect}
        index={1}
    />
    <Card 
        icon="chess-queen"
        title={t("queenEnding")}
        onPress={handleSelect}
        index={2}
    />
    <Card 
        icon="chess-knight"
        title={t("knightEnding")}
        onPress={handleSelect}
        index={3}
    />
    <Card 
        icon="chess-bishop"
        title={t("bishopEnding")}
        onPress={handleSelect}
        index={4}
    />
    <Card 
        icon="call-split"
        title={t("fork")}
        onPress={handleSelect}
        index={5}
    />
    <Card 
        icon="ray-start"
        title={t("opening")}
        onPress={handleSelect}
        index={6}
    />
    <Card 
        icon="ray-vertex"
        title={t("midGame")}
        onPress={handleSelect}
        index={7}
    />
    <Card 
        icon="ray-end"
        title={t("endGame")}
        onPress={handleSelect}
        index={7}
    />
    </View>
    </SafeAreaView>
  )
}

export default Index