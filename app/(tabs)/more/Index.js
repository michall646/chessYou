import { View, Text } from 'react-native'
import React from 'react'
import OptionCard from './OptionCard'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'

const Index = () => {
    const {t} = useTranslation();
  return (
    <View style={{padding: 5}}>
      <OptionCard
        title={t("Settings")}
        icon={"cog"}
        onPress={() => router.push('/more/Settings')}
      />
      <OptionCard
        title={t("about")}
        icon={"information-outline"}
        onPress={() => router.push('/more/About')}
      />
      <OptionCard
        title={t("learn")}
        icon={"school-outline"}
        onPress={() => router.push('/more/Learn')}
      />
    </View>
  )
}

export default Index