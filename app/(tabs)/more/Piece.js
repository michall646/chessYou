import { View} from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next';
import { Surface, Text, useTheme} from 'react-native-paper';
import PieceSvg from '../../../components/Play/Pieces/PieceSVG';

const UniversalPiece = () => {
  const {piece} = useLocalSearchParams();
  const {t} = useTranslation();
  const theme = useTheme();
        const bg= 'transparent';
        const color = theme.colors.primaryContainer;
        const stroke = theme.colors.onSecondaryContainer;
        const size = 50;
        const iconSize = 50 * 0.8;
        const borderWidth = 50 * 0.1;
        pieceNotation = {
          "pawn" : "P",
          "knight": "N",
          "bishop": "B",
          "rook": "R",
          "queen": "Q",
          "king": "K"
        }

  return (
    <View style={{padding: 5}}>
      <Stack.Screen options={{title: t(piece)}}/>
      <Surface elevation={2} style={[{borderColor: bg, borderWidth: borderWidth, borderRadius: 5, width: size, height: size, zIndex: 2, margin: 0,}]}>
              
                    
                    <PieceSvg 
                      width={iconSize}
                      height={iconSize}
                      fill={color}
                      stroke={stroke}
                      strokeWidth={4}
                      piece={pieceNotation[piece]}
                      style={{position: 'absolute', top: 0, left: 0,}}
                    />
                    <PieceSvg 
                      width={iconSize}
                      height={iconSize}
                      fill={color}
                      piece={pieceNotation[piece]}
                      style={{position: 'absolute', top: 0, left: 0,}}
                    />
            </Surface>
      <Text variant='headlineSmall'>{t(piece + "Disc")}</Text>
    </View>
  )
}

export default UniversalPiece