import { FlatList, RefreshControl, ScrollView, View} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Chip, Divider, FAB, Icon, IconButton, Text, TouchableRipple, useTheme} from 'react-native-paper'
import { StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Dimensions } from 'react-native'
import { getItem, saveItem } from '../../../engine/storageService'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native-safe-area-context'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Index = () => {
  const [games, setGames] = useState([]);
  const bigSize = Math.min(windowWidth / 2.5, 200);
  const [refreshing, setRefreshing] = useState(false);
  const {t} = useTranslation();

  useEffect(() => {
    const loadGames = async () => {
      const temp = await getItem("ChessYouGames", []);
      temp.reverse();
      setGames(temp);
    }
    loadGames()

  }, [])

  const loadGames = async () => {
      const temp = await getItem("ChessYouGames", []);
      temp.reverse();
      setGames(temp);
    }

  const selectGame = async (game, index) => {
    console.log(index);
    const selected = game;
    let string = '';
      string += 'r';
      if(selected.playerSide === 0){
        string += 'p10x';
        switch (selected.opponent.type) {
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
        string += selected.opponent.level;
        string += 'x';
      }
      else{
          switch (selected.opponent.type) {
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
          string += selected.opponent.level;
          string += 'x';
          string += 'p10x';
      }
      string += selected.time.base;
      string += 'x';
      string += selected.time.add;
      string += 'x';
      string += 't'
      string += 't'
      string += 't'
      string+= 'x'
      string += selected.fen
      string+= 'x'
      string += index;

      router.push({ pathname: "/BoardPage", params: { settings:  string }});
  }

  const reviewLast = () => {
    const lastGame = games.at(-1);
    selectGame(lastGame, games.length - 1)
  }

  const deleteItem = (index) => {
    const temp = games.slice();
    temp.splice(index - 1, 1);
    console.log(index)
    saveItem("ChessYouGames", temp);
    setGames(temp);
    
  }

  const renderItem = (item, index) => {
    let time;
    const isUnderMinute = item.time.base/ 60 < 1;
    if(isUnderMinute) time = `${item.time.base}s + ${item.time.add / 1000}`
    if(!isUnderMinute) time = `${item.time.base / 60} + ${item.time.add / 1000}`

    const gameIndex = games.length - index -1
    return (
      <TouchableRipple onPress={() => selectGame(item, gameIndex)} key={index}>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',marginVertical: 10, padding: 5, flex: 1, alignItems: 'center'}}>
      <View style={{display: 'flex', flexDirection: 'row', marginVertical: 10}}>
        <View style={{display: 'flex', flexDirection: 'column',}}>
          <View style={{display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <Text style={{fontWeight: 600}}>{item.opponent.type} <Text>{item.opponent.level}</Text></Text> 
            <Chip>{time}</Chip>
          </View>
          
        </View>
      </View>
      <IconButton
        icon={'delete'}
        mode="contained"
        onPress={() => deleteItem(gameIndex)}
       />
      </View>
      </TouchableRipple>
    )
  }
  const theme = useTheme();



  return (
    <View style={{flex: 1}}>

    
    <SafeAreaView>
    <ScrollView contentContainerStyle={{padding: 5}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadGames} />}>
      
      

    <View style={{display: 'flex', flexDirection: 'row', margin: 10, width: '100%', justifyContent: 'center', padding: 5, alignItems: 'center'}}>
      <TouchableRipple style={{width: bigSize, aspectRatio: 1, backgroundColor: theme.colors.primaryContainer, margin: 10, borderRadius: 20, display: 'flex', flexDirection: 'collumn', alignItems: 'center', justifyContent: 'center'}} onPress={() => router.push('/play/Options')}>
      <>
      <Icon source={'play'} size={bigSize/ 2}/>
      <Text>{t("play")}</Text>
      </>
      </TouchableRipple>
      <View style={{margin: 5}}>
        <Button mode='contained' style={{margin: 5}} onPress={() => router.push('/puzzle/Index')}>{t("puzzles")}</Button>
        <Button mode='contained' style={{margin: 5}} onPress={() => reviewLast()}>{t("reviewLast")}</Button>
      </View>
      
      
      
    </View>
    <Text style={{marginTop: 40, marginBottom: 5}} variant='headlineSmall'>{t("recentGames")}</Text>
    {games.map((x,i) => renderItem(x,i))}
    </ScrollView>
    </SafeAreaView>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
        margin: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    lastGameContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'blue',
        height: 100,
        width: '100%'
    },
    innerText: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'red',
        width: 'auto',
        height: "100%"
    },
    innerSquare: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'green',
        height: '100%',
        aspectRatio: 1,
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      zIndex: 100
    },
  })

export default Index