import { View} from 'react-native'
import React from 'react'
import { Icon, Text, TouchableRipple, useTheme } from 'react-native-paper'

const OptionCard = ({title, disc, icon, onPress, right}) => {
  const theme = useTheme();
  return (
    <TouchableRipple onPress={onPress}>
    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginVertical: 3, justifyContent: 'space-between'}}>
    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <View style={{margin: 12}}>
      <Icon
        source={icon}
        size={23}
        />
        </View>
        <View style={{display: 'flex', flexDirection: 'column', marginLeft: 5, justifyContent: 'center'}}>
            <Text variant='titleLarge'>{title}</Text>
            {typeof disc !== "undefined" &&<Text style={{color: theme.colors.outline}}>{disc}</Text>}
        </View>
        
    </View>
      {right}
    </View>
    </TouchableRipple>
  )
}

export default OptionCard