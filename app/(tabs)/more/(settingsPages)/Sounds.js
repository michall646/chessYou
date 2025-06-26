import { View } from 'react-native'
import React from 'react'
import { Text, Switch } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { getItem, saveItem} from '../../../../engine/storageService'
import OptionCard from '../OptionCard'
import { Stack } from 'expo-router'
import { useSettings } from '../../../../components/utils/SettingsContext'

const Sounds = () => {
    const {t} = useTranslation();
    const {settings, updateSettings} = useSettings();
    const [sounds, setSounds] = useState(settings.useSounds);
    const [haptics, setHaptics] = useState(settings.haptics);

  const handleSoundsChange = async () => {
    let copy = await getItem("ChessYouSettings", {themeIndex: 0});
    copy.useSounds = !sounds;
    saveItem("ChessYouSettings", copy);
    setSounds(!sounds);
    updateSettings(copy);
  }
  const handleHapticsChange = async () => {
    let copy = await getItem("ChessYouSettings", {themeIndex: 0});
    copy.haptics = !haptics;
    saveItem("ChessYouSettings", copy);
    setHaptics(!haptics);
    updateSettings(copy);
  }

    

  return (
    <View style={{padding: 5}}>
    <Stack.Screen options={{title: t("sounds")}}/>
    <OptionCard
      title={t("useSounds")}
      icon={"volume-source"}
      right={<Switch onValueChange={() => handleSoundsChange()} value={sounds}/>}
      />
      <OptionCard
      title={t("useHaptics")}
      icon={"vibrate"}
      right={<Switch onValueChange={() => handleHapticsChange()} value={haptics}/>}
      />
      </View>
  )
}

export default Sounds