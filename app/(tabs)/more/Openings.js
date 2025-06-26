import { ScrollView, View} from 'react-native'
import React from 'react'
import OptionCard from './OptionCard'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import { Text } from 'react-native-paper'

const Openings = () => {
  const {t} = useTranslation();
  return (
    <ScrollView contentContainerStyle={{padding: 5}}>
    <Text>{t("whiteOpenings")}</Text>
      <OptionCard
          title={t("ruyLopez")}
          icon={"chess-bishop"}
          onPress={() => router.push({ pathname: "/more/OpeningDisc", params: { opening: 'ruyLopez'}})}
        />
      <OptionCard
        title={t("italianGame")}
        icon={"chess-bishop"}
        onPress={() => router.push({ pathname: "/more/OpeningDisc", params: { opening: 'italianGame'}})}
      />
      <OptionCard
        title={t("scotchGame")}
        icon={"forwardburger"}
        onPress={() => router.push({ pathname: "/more/OpeningDisc", params: { opening: 'scotchGame'}})}
      />
      <OptionCard
        title={t("evansGambit")}
        icon={"step-forward"}
        onPress={() => router.push({ pathname: "/more/OpeningDisc", params: { opening: 'evansGambit'}})}
      />
      <OptionCard
        title={t("kingsIndianAttack")}
        icon={"vector-square-plus"}
        onPress={() => router.push({ pathname: "/more/OpeningDisc", params: { opening: 'kingsIndianAttack'}})}
      />
      <OptionCard
        title={t("londonSystem")}
        icon={"tea"}
        onPress={() => router.push({ pathname: "/more/OpeningDisc", params: { opening: 'kingsIndianAttack'}})}
      />
      <OptionCard
        title={t("queensGambit")}
        icon={"chess-queen"}
        onPress={() => router.push({ pathname: "/more/OpeningDisc", params: { opening: 'queensGambit'}})}
      />
      
       <Text>{t("blackOpenings")}</Text>
      <OptionCard
        title={t("caroKann")}
        icon={"apple-keyboard-control"}
        onPress={() => router.push({ pathname: "/more/OpeningDisc", params: { opening: 'caroKann'}})}
      />
      <OptionCard
        title={t("kingsIndianDefense")}
        icon={"vector-square-plus"}
        onPress={() => router.push({ pathname: "/more/OpeningDisc", params: { opening: 'kingsIndianDefense'}})}
      />
      <OptionCard
        title={t("acceleratedDragon")}
        icon={"speedometer"}
        onPress={() => router.push({ pathname: "/more/OpeningDisc", params: { opening: 'acceleratedDragon'}})}
      />
      <OptionCard
        title={t("slavDefense")}
        icon={"shield"}
        onPress={() => router.push({ pathname: "/more/OpeningDisc", params: { opening: 'slavDefense'}})}
      />
    </ScrollView>
  )
}

export default Openings