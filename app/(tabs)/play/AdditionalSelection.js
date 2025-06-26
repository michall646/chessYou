import { View} from 'react-native'
import React, { useState } from 'react'
import { Switch, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

const AdditionalSelection = ({gameSettings, setGameSettings}) => {
    
    const [values, setValues] =useState([true, true, true]);
    const {t} = useTranslation();
    const handleSelect = (index) => {
        const tempSettings = {...gameSettings};
        const tempValues = [...values];
        tempValues[index] = !tempValues[index];
        if(index === 0){
            tempSettings.addRules.undo = !values[0];
            
        }
        if(index === 1){
            tempSettings.addRules.pause = !values[1];
        }
        if(index === 2){
            tempSettings.addRules.hint = !values[2];
        }
        setValues(tempValues)
        setGameSettings(tempSettings);
    }
  return (
    <View style={{display: 'flex', padding: 10}}>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
            <Text>{t("undo")}</Text>
            <Switch value={values[0]} onValueChange={() =>handleSelect(0)} />
        </View>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
            <Text>{t("pause")}</Text>
            <Switch value={values[1]} onValueChange={() =>handleSelect(1)} />
        </View>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
            <Text>{t("hint")}</Text>
            <Switch value={values[2]} onValueChange={() =>handleSelect(2)} />
        </View>
        
        
        
    </View>
  )
}

export default AdditionalSelection