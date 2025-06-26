import { View, Text } from 'react-native'
import React from 'react'
import OptionCard from './OptionCard'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'


const Learn = () => {
  const {t} = useTranslation();
  return (
    <View style={{padding: 5}}>
      <OptionCard
        title={t("pawn")}
        icon={"chess-pawn"}
        onPress={() => router.push({ pathname: "/more/Piece", params: { piece: "pawn"}})}
      />
      <OptionCard
        title={t("knight")}
        icon={"chess-knight"}
        onPress={() => router.push({ pathname: "/more/Piece", params: { piece: "knight"}})}
      />
      <OptionCard
        title={t("bishop")}
        icon={"chess-bishop"}
        onPress={() => router.push({ pathname: "/more/Piece", params: { piece: "bishop"}})}
      />
      <OptionCard
        title={t("queen")}
        icon={"chess-queen"}
        onPress={() => router.push({ pathname: "/more/Piece", params: { piece: "queen"}})}
      />
      <OptionCard
        title={t("rook")}
        icon={"chess-rook"}
        onPress={() => router.push({ pathname: "/more/Piece", params: { piece: "rook"}})}
      />
      <OptionCard
        title={t("king")}
        icon={"chess-king"}
        onPress={() => router.push({ pathname: "/more/Piece", params: { piece: "king"}})}
      />
      <OptionCard
        title={t("advancedPlays")}
        icon={"star-box-outline"}
        onPress={() => router.push('/more/AdvancedPlays')}
      />
      <OptionCard
        title={t("openings")}
        icon={"ray-start-arrow"}
        onPress={() => router.push('/more/Openings')}
      />
    </View>
  )
}

export default Learn