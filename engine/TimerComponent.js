import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper';

const TimerComponent = ({miliseconds, color}) => {

    const formatTime = (time) => {
        const miliseconds = time % 1000;
        const totalSeconds = Math.floor(time / 1000);
        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);

        const formattedHours = String(hours);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        const formattedMiliseconds = String(miliseconds/ 100);
        
        if(hours > 0) {
            return `${hours}:${formattedMinutes}`
        }else if(minutes> 0 || seconds > 20){
            
            return `${minutes}:${formattedSeconds}`
        }else {
            return `${formattedSeconds}.${formattedMiliseconds}`
        }
    }
    const theme= useTheme();
    const formatted = formatTime(miliseconds);
    let bg = color === 'w'? "white" : "black";
    let textColor = color === 'w'? "" : "white";
    if(!theme.dark){
        bg = color === 'b'? theme.colors.onSurface : theme.colors.surfaceVariant;
    }
    else{
        bg = color === 'b'? theme.colors.surfaceVariant : theme.colors.onSurface;
    }
    return (
        <View style={{...styles.container, backgroundColor: bg}}>
        <Text style={{color: textColor}}>{formatted}</Text>
        </View>
  )
}
const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        height: 30,
        padding: 5,
        width: 100,
        margin: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
  })

export default TimerComponent
