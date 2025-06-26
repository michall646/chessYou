import { View} from 'react-native'
import React from 'react'
import OptionCard from '../OptionCard'
import { useTranslation } from 'react-i18next'
import { router, Stack } from 'expo-router'
import { Switch, Text, useTheme, Dialog, Button, Portal, RadioButton } from 'react-native-paper'
import { useState } from 'react'
import { ScrollView } from 'react-native'
import ColorIcon from './ColorIcon'
import { getItem, saveItem} from '../../../../engine/storageService'
import {useSettings} from '../../../../components/utils/SettingsContext'

const Apperance = () => {
    const {t} = useTranslation();
    const {settings, updateSettings} = useSettings();
    const [darkMode, setDarkMode] = useState(settings.darkMode);
    const [selectedColor, setSelectedColor] = useState(settings.themeIndex);
    const [autoColor, setAutoColor] = useState(settings.autoColor);
    const theme= useTheme();
    
    const [visible, setVisible] = useState(false);

    const showDialog = () => setVisible(true);

    const hideDialog = () => setVisible(false);

    

    const darkModeDisc = darkMode === "auto" ? t("darkModeAuto"): darkMode === "dark" ? t("darkModeOn") : t("darkModeOff");

     const isSelected = (value) =>{
        return selectedColor == value
    }
    const handleColorChange = async (index) => {
        let copy = {...settings}
        
        copy.themeIndex = index;
        saveItem("ChessYouSettings", copy);
        updateSettings(copy);
        setSelectedColor(index);
    }
    const handleAutoColorChange = async () => {
        let copy = {...settings}
        copy.autoColor = !autoColor;
        saveItem("ChessYouSettings", copy);
        setAutoColor(!autoColor);
        updateSettings(copy);
    }

    const handleDarkModeChange = async (value) => {
        let copy = {...settings}
        copy.darkMode = value;
        saveItem("ChessYouSettings", copy);
        setDarkMode(value);
        updateSettings(copy);
    }
  return (
    <View style={{padding: 5}}>
      <Stack.Screen options={{title: t("Apperance")}}/>
      <OptionCard
            title={t("DarkMode")}
            disc={darkModeDisc}
            icon={"brightness-4"}
            onPress={()=> showDialog()}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical: 10}}>
                <ColorIcon selected={isSelected(0)} primary={"#c199e0"} secondary={"#c9dbf5"} tertiary={"#f0b1ef"} click={()=> handleColorChange(0)}/>
                <ColorIcon selected={isSelected(1)} primary={"#c199e0"} secondary={"#a3a8ff"} tertiary={"#f5b7b5"} click={()=> handleColorChange(1)}/>
                <ColorIcon selected={isSelected(2)} primary={"#fadaa7"} secondary={"#ffc3bf"} tertiary={"#b3fcb3"} click={()=> handleColorChange(2)}/>
                <ColorIcon selected={isSelected(3)} primary={"#fcd260"} secondary={"#fac38c"} tertiary={"#afc9a3"} click={()=> handleColorChange(3)}/>
                <ColorIcon selected={isSelected(4)} primary={'#83cc8e'} secondary={'#d1db63'} tertiary={'#6a9c8b'} click={()=> handleColorChange(4)}/>
                <ColorIcon selected={isSelected(5)} primary={'#b7f481'} secondary={'#dae7c9'} tertiary={'#bbece9'} click={()=> handleColorChange(5)}/>
                <ColorIcon selected={isSelected(6)} primary={'#94d6c4'} secondary={'#9ce6ab'} tertiary={'#6a769c'} click={()=> handleColorChange(6)}/>
                <ColorIcon selected={isSelected(7)} primary={'#94d6c4'} secondary={'#bbece9'} tertiary={'#bda9d4'} click={()=> handleColorChange(7)}/>
                <ColorIcon selected={isSelected(8)} primary={'#9cb7e6'} secondary={'#9ce6ab'} tertiary={'#cce69c'} click={()=> handleColorChange(8)}/>
                <ColorIcon selected={isSelected(9)} primary={'#9497d6'} secondary={'#bda9d4'} tertiary={'#a9d4c5'} click={()=> handleColorChange(9)}/>
                <ColorIcon selected={isSelected(10)} primary={'#d6949e'} secondary={'#d694cb'} tertiary={'#d6bc94'} click={()=> handleColorChange(10)}/>
        </ScrollView>
        <OptionCard
            title={t("useAutoColor")}
            icon={"palette"}
            right={<Switch onValueChange={() => handleAutoColorChange()} value={autoColor}/>}
      />
      <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>{t("DarkMode")}</Dialog.Title>
            <Dialog.Content>
              
               <RadioButton.Group onValueChange={(x) =>handleDarkModeChange(x)} value={darkMode}>
                  <View>
                    <Text>{t("DarkMode")}</Text>
                    <RadioButton value="dark" />
                  </View>
                  <View>
                    <Text>{t("LightMode")}</Text>
                    <RadioButton value="light" />
                  </View>
                  <View>
                    <Text>{t("AutoMode")}</Text>
                    <RadioButton value="auto" />
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

export default Apperance