import { View } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

const PlayDisc = () => {
    const {play} = useLocalSearchParams();
    const {t} = useTranslation();
  return (
    <View style={{padding: 5}}>
        <Text variant='headlineSmall'>{t(play + "Disc")}</Text>
    </View>
  )
}

export default PlayDisc