import { View} from 'react-native'
import React from 'react'
import { Icon, Text, TouchableRipple } from 'react-native-paper'

const Card = ({icon, title, disc, onPress, index}) => {
  return (
    <TouchableRipple onPress={() => onPress(index)} style={{display: 'flex', flexDirection: 'row', gap: 7, alignItems: 'center', paddingVertical: 10}}>
        <>
        <Icon
            source={icon}
            size={30}
        />
        <View style={{display: 'flex', flexDirection: 'collumn',}}>
        <Text variant="titleLarge">{title}</Text>
        </View>
        </>
    </TouchableRipple>
  )
}

export default Card