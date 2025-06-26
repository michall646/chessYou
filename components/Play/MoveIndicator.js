import { View} from 'react-native'
import React from 'react'
import { Button, Icon, Surface, Text, useTheme} from 'react-native-paper'
import { useTranslation } from 'react-i18next'

const MoveIndicator = ({turn, playerSide, mode, status, nextPuzzle}) => {
    const {t} = useTranslation();
    const theme = useTheme();
    let sideToMoveText = turn === "w"? t("whiteMove") : t("blackMove")
    let text = '';
    let icon = (turn === "w") !== (theme.dark)? 'square-rounded-outline' : 'square-rounded'

    if(mode === "puzzle"){
        if(!status.started){
            text = t('findBestMove');
            icon = 'timer-sand';
        }
        else{
            if(status.isOk){
                if(status.finished){
                    text = t("puzzleFinished")
                    icon = 'flag-checkered'
                }
                else{
                    text = t('puzzleContinue')
                    icon = 'check'
                }
            }
            else{
                text = t("puzzleWrong")
                icon = 'close'
            }
        }
        
    }

    return (
        <Surface elevation={2} style={{padding: 5, margin: 5, borderRadius: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5}}>
            <Icon
                source={icon}
                size={30}
            />
            <View style={{display: 'flex', flexDirection: 'column'}}>
                <Text variant='headlineSmall'>{sideToMoveText}</Text>
                {text !== "" && <Text>{text}</Text>}
            </View>
            
        </Surface>
    )
  
}

export default MoveIndicator