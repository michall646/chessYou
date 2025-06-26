import { ScrollView, View} from 'react-native'
import React from 'react'
import OptionCard from './OptionCard'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import { Text } from 'react-native-paper'

const AdvancedPlays = () => {
  const {t} = useTranslation();
  return (
    <ScrollView contentContainerStyle={{padding: 5}}>
    <Text>{t("advancedMoves")}</Text>
        <OptionCard
          title={t("castle")}
          icon={"castle"}
          onPress={() => router.push({ pathname: "/more/PlayDisc", params: { play: 'castle'}})}
        />
        <OptionCard
          title={t("enPassant")}
          icon={"chess-pawn"}
          onPress={() => router.push({ pathname: "/more/PlayDisc", params: { play: 'enPassant'}})}
        />
        <Text>{t("tactics")}</Text>
        <OptionCard
          title={t("pinning")}
          icon={"pin"}
          onPress={() => router.push({ pathname: "/more/PlayDisc", params: { play: 'pinning'}})}
        />
        <OptionCard
          title={t("forks")}
          icon={"directions-fork"}
          onPress={() => router.push({ pathname: "/more/PlayDisc", params: { play: 'fork'}})}
        />
        <OptionCard
          title={t("discoveredAttacks")}
          icon={"eye-off"}
          onPress={() => router.push({ pathname: "/more/PlayDisc", params: { play: 'discoveredAttacks'}})}
        />

      
    </ScrollView>
  )
}

export default AdvancedPlays