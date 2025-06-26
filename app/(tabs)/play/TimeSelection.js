import { StyleSheet, View} from 'react-native'
import {useState, useTransition} from 'react'
import { Chip, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper'
import { Collapsible } from 'react-native-fast-collapsible'
import {Slider} from '@miblanchard/react-native-slider';
import { useTranslation } from 'react-i18next';

const TimeSelection = ({gameSettings, setGameSettings}) => {
    const [isVisible, setVisible] = useState(true);
    const [base, setBase] = useState(5);
    const [add, setAdd] = useState(1);
    const theme = useTheme();
    const {t} = useTranslation();

    const handleTimeSelect = (baseValue, addValue) => {
      const temp = {...gameSettings};
      temp.time.base = baseValue * 60;
      temp.time.add = addValue * 1000;

      setGameSettings(temp);
    }
    
    const handleSliderChange = (newBase, newAdd) => {
      const temp = {...gameSettings};
      let baseValue = 1;
      let addValue = 0;

      if(newBase === null){
        baseValue = base;
      }
      else{
        baseValue = newBase;
      }

      if(newAdd === null){
        addValue = add;
      }
      else{
        addValue = newAdd;
      }
      temp.time.base = baseValue * 60;
      temp.time.add = addValue * 1000;
      if(newBase) setBase(newBase);
      if(newAdd) setAdd(newAdd);
      setGameSettings(temp);
    }
    const renderBaseThumbComponent = () => {
            return (<View style={{borderRadius: 100, width: 35, padding: 3, height: 35, backgroundColor: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                        <Text style={{color: theme.colors.onPrimary}}>
                            {base}
                        </Text>
                    </View>)
        }
    const renderAddThumbComponent = () => {
            return (<View style={{borderRadius: 100, width: 35, padding: 3, height: 35, backgroundColor: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                        <Text style={{color: theme.colors.onPrimary}}>
                            {add}
                        </Text>
                    </View>)
        }

  return (
    <View style={{display: 'flex', padding: 10}}>
        <Text variant='titleMedium' style={{marginBottom: 3, marginTop: 6}}>{t("bullet")}</Text>
        <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
            <Chip icon="bullet" onPress={() => handleTimeSelect(1,0)} style={styles.chip} >1 + 0</Chip>
            <Chip icon="bullet" onPress={() => handleTimeSelect(1,1)} style={styles.chip}>1 + 1</Chip>
            <Chip icon="bullet" onPress={() => handleTimeSelect(2,1)} style={styles.chip}>2 + 1</Chip>
            <Chip icon="bullet" onPress={() => handleTimeSelect(2,5)} style={styles.chip}>2 + 5</Chip>
        </View>
        <Text variant='titleMedium'style={{marginBottom: 3, marginTop: 6}}>{t("blitz")}</Text>
        <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
            <Chip icon="lightning-bolt" onPress={() => handleTimeSelect(3,0)} style={styles.chip}>3 + 0</Chip>
            <Chip icon="lightning-bolt" onPress={() => handleTimeSelect(3,5)} style={styles.chip}>3 + 5</Chip>
            <Chip icon="lightning-bolt" onPress={() => handleTimeSelect(5,0)} style={styles.chip}>5 + 0</Chip>
            <Chip icon="lightning-bolt" onPress={() => handleTimeSelect(5,2)} style={styles.chip}>5 + 2</Chip>
        </View>
        <Text variant='titleMedium' style={{marginBottom: 3, marginTop: 6}}>{t("rapid")}</Text>
        <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
            <Chip icon="horse-variant-fast" onPress={() => handleTimeSelect(10,0)} style={styles.chip}>10 + 0</Chip>
            <Chip icon="horse-variant-fast" onPress={() => handleTimeSelect(10,5)} style={styles.chip}>10 + 5</Chip>
            <Chip icon="horse-variant-fast" onPress={() => handleTimeSelect(15,0)} style={styles.chip}>15 + 0</Chip>
            <Chip icon="horse-variant-fast" onPress={() => handleTimeSelect(15,5)} style={styles.chip}>15 + 5</Chip>
        </View>
        <Text variant='titleMedium' style={{marginBottom: 3, marginTop: 6}}>{t("classical")}</Text>
        <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
            <Chip icon="speedometer-slow" onPress={() => handleTimeSelect(25,0)} style={styles.chip}>25 + 0</Chip>
            <Chip icon="speedometer-slow" onPress={() => handleTimeSelect(30,0)} style={styles.chip}>30 + 0</Chip>
            <Chip icon="speedometer-slow" onPress={() => handleTimeSelect(30,10)} style={styles.chip}>30 + 10</Chip>
            <Chip icon="speedometer-slow" onPress={() => handleTimeSelect(60,0)} style={styles.chip}>60 + 0</Chip>
        </View>
        <Surface elevation={4} style={{padding: 10, borderRadius: 20, marginTop: 20}}>
        <TouchableRipple style={{margin: 30}} onPress={() => setVisible(!isVisible)}>
          <Text variant='titleMedium'>{t("customTime")}</Text>
        </TouchableRipple>
      <Collapsible isVisible={isVisible}>
        <View style={{display: 'flex'}}>
          <Text style={{marginTop: 5, marginBottom: 3}}>{t("baseTimeDisc")}</Text>
          <Slider
              minimumValue={1}
              maximumValue={90}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.secondaryContainer}
              step={1}
              value={base}
              onValueChange={(x) =>handleSliderChange(x, null)}
              renderThumbComponent={renderBaseThumbComponent}
              minimumTrackStyle={{ borderBottomRightRadius: 0, borderTopRightRadius: 0}}
              trackStyle={{height: 35, borderRadius: 100}}
              containerStyle={{width: '97%'}}

          />
          <Text style={{marginTop: 5, marginBottom: 3}}>{t("addTimeDisc")}</Text>
          <Slider
              minimumValue={0}
              maximumValue={30}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.secondaryContainer}
              step={1}
              value={add}
              onValueChange={(x) =>handleSliderChange(null, x)}
              renderThumbComponent={renderAddThumbComponent}
              minimumTrackStyle={{ borderBottomRightRadius: 0, borderTopRightRadius: 0}}
              trackStyle={{height: 35, borderRadius: 100}}
              containerStyle={{width: '97%'}}

          />
        </View>
        
        
      
      </Collapsible>
      </Surface>
    </View>
  )
}

const styles = StyleSheet.create({
    chip: {
        marginRight: 3, marginLeft: 3
    }
})

export default TimeSelection
