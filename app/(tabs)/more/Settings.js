import { View, Text } from 'react-native'
import React from 'react'
import OptionCard from './OptionCard'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'


const Settings = () => {
  const {t} = useTranslation();
  return (
    <View style={{padding: 5}}>
      <OptionCard
        title={t("Apperance")}
        disc={t("ApperanceDisc")}
        icon={"palette-outline"}
        onPress={() => router.push('/more/Apperance')}
      />
      <OptionCard
        title={t("sounds")}
        disc={t("soundsDisc")}
        icon={"volume-high"}
        onPress={() => router.push('/more/Sounds')}
      />
      <OptionCard
        title={t("board")}
        disc={t("boardDisc")}
        icon={"checkerboard"}
        onPress={() => router.push('/more/Board')}
      />
      <OptionCard
        title={t("language")}
        disc={t("languageDisc")}
        icon={"web"}
        onPress={() => router.push('/more/Language')}
      />
    </View>
  )
}

export default Settings