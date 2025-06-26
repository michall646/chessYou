import { View} from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import BoardPreview from '../../../components/utils/BoardPreview';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native-paper';
import { ScrollView } from 'react-native';

const OpeningDisc = () => {
    const {opening} = useLocalSearchParams();
    const {t} = useTranslation();
    const openingsData = {
        ruyLopez: {
            name: t("ruyLopez"),
            moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5",
            disc: t("ruyLopezDisc"),
            fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'
        },
        italianGame: {
            name: t("italianGame"),
            moves: '1.e4 e5 2.Nf3 Nc6 3.Bc4',
            disc: t("italianGameDisc"),
            fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1'
        },
        scotchGame: {
            name: t("scotchGame"),
            moves: '1.e4 e5 2.Nf3 Nc6 3.d4',
            disc: t("scothGameDisc"),
            fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 1'
        },
        evansGambit: {
            name: t("evansGambit"),
            moves: '1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4',
            disc: t("evansGambitDisc"),
            fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R w KQkq - 0 1'
        },
        kingsIndianAttack: {
            name: t("kingsIndianAttack"),
            moves: '1.Nf3 d5 2.g3',
            disc: t("kingsIndianAttackDisc"),
            fen: 'rnbqkbnr/ppp1pppp/8/3p4/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq - 0 2'
        },
        londonSystem: {
            name: t("londonSystem"),
            moves: '1.d4 d5 2.Nf3 Nf6 3.Bf4',
            disc: t("londonSystemDisc"),
            fen: 'rnbqkbnr/ppp1pppp/8/3p4/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq - 0 2'
        },
        queensGambit: {
            name: t("queensGambit"),
            moves: '1.d4 d5 2.c4',
            disc: t("queensGambitDisc"),
            fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2"
        },

        caroKann: {
            name: t("caroKann"),
            moves: '1.e4 c6 2.d4 d5 3.e5',
            disc: t("caroKannDisc"),
            fen: "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        },
        kingsIndianDefense: {
            name: t("kingsIndianDefense"),
            moves: '1.d4 Nf6 2.c4 g6',
            disc: t("kingsIndianDefenseDisc"),
            fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        },
        acceleratedDragon: {
            name: t("acceleratedDragon"),
            moves: '1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6',
            disc: t("acceleratedDragonDisc"),
            fen: "r1bqkbnr/pp1ppp1p/2n3p1/8/3NP3/8/PPP2PPP/RNBQKB1R w KQkq - 0 5",
        },
        slavDefense: {
            name: t("slavDefense"),
            moves: '1.d4 d5 2.c4 c6',
            disc: t("slavDefenseDisc"),
            fen: "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq - 0 3",
        }

    }
  return (
    <ScrollView contentContainerStyle={{padding: 5}}>
        <Stack.Screen options={{title: openingsData[opening].name}}/>
      <Text style={{marginTop: 3, marginBottom: 10}} variant='headlineSmall'>{openingsData[opening].moves}</Text>
      
      <BoardPreview 
        size={300}
        rotation={"black"}
        fen={openingsData[opening].fen}
        />
        <Text variant='headlineSmall' style={{marginVertical: 3}}>{openingsData[opening].disc}</Text>
    </ScrollView>
  )
}

export default OpeningDisc