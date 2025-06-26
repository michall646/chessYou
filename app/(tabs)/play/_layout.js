import { Stack } from "expo-router"

const playLayout = (props) => {
    return(
        <Stack screenOptions={{animation: 'simple_push', headerShadowVisible: false}}>
            <Stack.Screen name="Index" options={{headerShown: false}}/>
            <Stack.Screen name="Options"/>
            <Stack.Screen name="BotSelection" />
        </Stack>
    )
}
export default playLayout