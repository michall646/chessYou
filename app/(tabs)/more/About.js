import { ScrollView, View} from 'react-native'
import React from 'react'
import { Surface, Text, useTheme } from 'react-native-paper'

const About = () => {
    const theme = useTheme();
  return (
    <ScrollView contentContainerStyle={{padding: 5}}>
        <Surface elevation={3} style={{padding: 10, margin: 5, display: 'flex', alignItems: 'center', borderRadius: 10}}>
            <Text variant='displaySmall'>ChessYou</Text>
        </Surface>
        <View style={{display: 'flex', flexDirection: 'row'}}>
            <Surface elevation={2} style={{padding: 10, margin: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, flex: 1, height: 100}}>
                <Text variant='bodyMedium'>Version:</Text>
                <Text variant='bodySmall'>Alpha 0.1</Text>
            </Surface>
            <Surface elevation={2} style={{padding: 10, margin: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, flex: 1, height: 100}}>
                <Text variant='bodyMedium'>Github</Text>
                <Text variant='bodySmall'>ChessYou</Text>
            </Surface>
        </View>
        <Surface elevation={2} style={{padding: 10, margin: 5, display: 'flex', alignItems: 'center', borderRadius: 10}}>
            <Text variant='bodyLarge'>Author: Michal646</Text>
        </Surface>
    </ScrollView>
  )
}

export default About