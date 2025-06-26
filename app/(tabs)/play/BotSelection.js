import { View, StyleSheet } from 'react-native'
import {useState}from 'react'
import { IconButton, Text, TouchableRipple, useTheme } from 'react-native-paper'
import {Slider} from '@miblanchard/react-native-slider';
import { Collapsible } from 'react-native-fast-collapsible';
import { useTranslation } from 'react-i18next';

const BotSelection = ({gameSettings, setGameSettings}) => {
    const [checked, setChecked] = useState(1);
    const [sliderValue, setSliderValue] = useState(1);
    const [isVisible, setVisibility] = useState(false);
    const {t} = useTranslation();
    const theme = useTheme();
    const handleBotChange = (value) => {
        const temp = {...gameSettings};
        const aiIndex = temp.aiMode.findIndex(x => x.type !== "player");
        if(aiIndex === -1) {
          setChecked(value);
          return
        }
        let botType = "customBot"
        if(value === 0) {
          botType = "custom"
        }
        if(value === 1) {
          botType = "rest"
        }
        if(value === 2) {
          botType = "native"
        }
        if(value === 3) {
            botType = "player"
          }
        temp.aiMode[aiIndex].type = botType;
        setChecked(value);
        setGameSettings(temp);
      }
    const handleSliderChange = (value) => {
      setSliderValue(value);
    }

    
      const getTextColor = (index) => {
        return checked === index ? theme.colors.primary : theme.colors.onSurfaceVariant;
      }
      const renderThumbComponent = () => {
        return (<View style={{borderRadius: 100, width: 35, padding: 3, height: 35, backgroundColor: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent:'center'}}>
                    <Text style={{color: theme.colors.onPrimary}}>
                        {sliderValue}
                    </Text>
                </View>)
        }
  return (<>
        <View style={{padding: 10}}>
        
        <TouchableRipple style={styles.botContainer} onPress={() => handleBotChange(1)}>
            <>
            <View style={styles.textContainer}>
                <Text variant='titleMedium' style={{color: getTextColor(1)}}>{t("restBot")}</Text>
                <Text variant='titleSmall'>{t("restDisc")}</Text>
            </View>
            </>
        </TouchableRipple>
        <TouchableRipple style={styles.botContainer} onPress={() => handleBotChange(2)}>
            <>
            <View style={styles.textContainer}>
                <Text variant="titleMedium" style={{color: getTextColor(2)}}>{t("nativeBot")}</Text>
                <Text variant='titleSmall'>{t("nativeDisc")}</Text>
            </View>
            </>
        </TouchableRipple>
        <TouchableRipple style={styles.botContainer} onPress={() => handleBotChange(3)}>
            <>
            <View style={styles.textContainer}>
                <Text variant="titleMedium" style={{color: getTextColor(3)}}>{t("overBoard")}</Text>
                <Text variant='titleSmall'>{t("overBoardDisc")}</Text>
            </View>
            </>
        </TouchableRipple>
        <TouchableRipple style={styles.botContainer} onPress={() => handleBotChange(0)}>
            <>
            <View style={styles.textContainer}>
                <Text variant='titleMedium' style={{color: getTextColor(0)}}>{t("omegaBot")}</Text>
                <Text variant='titleSmall'>{t("omegaDisc")}</Text>
            </View>
            </>
        </TouchableRipple>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Text variant="headlineMedium" style={{marginBottom: 10, marginTop: 10, }}>{t("strength")}</Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text style={{marginRight: 3, marginLeft: 3}}>{t("selectedLevel")}: {sliderValue}</Text>
                </View>
        </View>
        <Slider
            minimumValue={1}
            maximumValue={15}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.secondaryContainer}
            step={1}
            value={sliderValue}
            onValueChange={handleSliderChange}
            renderThumbComponent={renderThumbComponent}
            minimumTrackStyle={{ borderBottomRightRadius: 0, borderTopRightRadius: 0}}
            trackStyle={{height: 35, borderRadius: 100}}
            containerStyle={{width: '97%'}}
            />
        </View>
    </>
  )
}
const styles = StyleSheet.create({
    
    botContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8

    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    botName: {
        fontSize: 20,
        fontWeight: 540
    }
})

export default BotSelection
