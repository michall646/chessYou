import { View } from 'react-native'
import React from 'react'
import { Text, Portal, Dialog} from 'react-native-paper'
import { useTranslation } from 'react-i18next'

const BotErrorModal = (props) => {
    const {t} = useTranslation();
  return (
    <Portal>
        <Dialog visible={props.visible} onDismiss={() => props.setVisible(!props.visible)} contentContainerStyle={{width: 100, height: 100}}>
        <Dialog.Title>{t("botError")}</Dialog.Title>
        <Dialog.Content>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <Text>{props.content}</Text>
            </View>
        </Dialog.Content>
            
        </Dialog>
    </Portal>
  )
}

export default BotErrorModal