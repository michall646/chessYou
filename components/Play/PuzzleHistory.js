import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { Chip, Icon, useTheme } from 'react-native-paper'
import { memo } from 'react'

const PuzzleHistory = ({history}) => {
  const theme = useTheme();
    const renderItem = ({item, index}) => {
      let icon = "help";
      let color = theme.colors.outline;
      if(item.status === 'done'){
        icon = "check"
        color = theme.colors.primary;
      }
      if(item.status === "wrong"){
        icon = "close"
        color = theme.colors.error;
      }
        return (<View style={{backgroundColor: color, borderRadius: 8, paddingHorizontal: 15, height: 30, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}><Icon size={20} source={icon}/></View>)
    }
  return (
    <FlatList
        data={history}
        horizontal={true}
        renderItem={renderItem}
        contentContainerStyle={{margin: 5}}
    />
  )
}

export default memo(PuzzleHistory)