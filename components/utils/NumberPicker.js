import { StyleSheet, Text, View } from 'react-native'
import {useState} from 'react'
import { IconButton, TextInput } from 'react-native-paper'

const NumberPicker = ({label, min, max}) => {
    const [value, setValue] = useState(0);
    const handleValueChange = (count, change) => {
        let newValue = count + change;
        if(newValue < 0) newValue = 0;
        setValue(newValue);
    }
  return (
    <View style={styles.container}>
      <IconButton
      onPress={() => handleValueChange(value, -1)}
        icon={'minus'}/>
      <TextInput 
        value={value}
        label={label}/>
      <IconButton
        onPress={() => handleValueChange(value, +1)}
        icon={'plus'}/>
    </View>
  )
}

export default NumberPicker

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row'
    }
})