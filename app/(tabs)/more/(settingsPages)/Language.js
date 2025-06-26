import { View} from 'react-native'
import React from 'react'
import {Dimensions} from 'react-native';
import { Text, Switch, Portal, Dialog, RadioButton } from 'react-native-paper';
import OptionCard from '../OptionCard';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getItem, saveItem } from '../../../../engine/storageService';
import { useSettings } from '../../../../components/utils/SettingsContext';
import { Stack } from 'expo-router';



const Language = () => {
    const {t, i18n} = useTranslation();
    const [visible, setVisible] = useState(false);
    const {settings, updateSettings} = useSettings();
    const [lang, setLang] = useState(settings.language);
    
    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    const handleLanguageChange = async (value) => {
        let copy = {...settings}
                
        copy.language = value;
        saveItem("ChessYouSettings", copy);
        updateSettings(copy);
        setLang(value);
        i18n.changeLanguage(value)
    }

    const dictionary = {
      pl: "Polski",
      en: "English"
    }


  return (
    <View style={{padding: 5}}>
    <Stack.Screen options={{title: t("language")}}/>
    <OptionCard
        title={t("language")}
        icon={"web"}
        onPress={()=> showDialog()}
        right={<Text>{dictionary[lang]}</Text>}
    />
    <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Content>
              
               <RadioButton.Group onValueChange={(x) =>handleLanguageChange(x)} value={lang}>
                  <View>
                    <Text>English</Text>
                    <RadioButton value="en" />
                  </View>
                  <View>
                    <Text>Polski</Text>
                    <RadioButton value="pl" />
                  </View>
                </RadioButton.Group>
                 </Dialog.Content>
              <Dialog.Actions>
            </Dialog.Actions>
           
            
          </Dialog>
        </Portal>
        </View>
  )
}

export default Language