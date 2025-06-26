import { Stack } from "expo-router"

const puzzleLayout = (props) => {
    return(
        <Stack screenOptions={{animation: 'simple_push'}}>
            <Stack.Screen name="Index" options={{headerShown: false}}/>
        </Stack>
    )
}
export default puzzleLayout