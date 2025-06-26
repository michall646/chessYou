import { Stack } from "expo-router"
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

const moreLayout = (props) => {
    const theme = useTheme();
    const {t} = useTranslation();
    return(
        <Stack screenOptions={{animation: 'simple_push', headerShadowVisible: false}}>
            <Stack.Screen name="Index" options={{headerTitle: 'ChessYou', }}/>
            <Stack.Screen name="Settings" options={{title: t("Settings")}}/>
            <Stack.Screen name="(settingsPages)"/>
            <Stack.Screen name="Learn" options={{title: t("learn")}}/>
            <Stack.Screen name="Piece" options={{title: t("Settings")}}/>
            <Stack.Screen name="Openings" options={{title: t("openings")}}/>
            <Stack.Screen name="OpeningDisc" />
            <Stack.Screen name="AdvancedPlays" options={{title: t("advancedPlays")}}/>
        </Stack>
    )
}
export default moreLayout