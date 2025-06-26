import { MaterialIcons } from '@expo/vector-icons'
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router';

import { SafeAreaView, useColorScheme, View } from 'react-native'
import { adaptNavigationTheme, PaperProvider } from 'react-native-paper'
import 'react-native-reanimated'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import '../i18next'; 
import SettingsContext, { SettingsProvider } from '../components/utils/SettingsContext';
import ThemesProvider from '../components/utils/ThemesProvider';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';


// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router'

// Ensure that reloading on `/modal` keeps a back button present.
export const unstable_settings = { initialRouteName: '(tabs)' }

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  return <RootLayoutNav />
}

function RootLayoutNav() {
  const insets = useSafeAreaInsets();
  const visibility = NavigationBar.useVisibility()
  if (typeof window === "undefined") return <Slot />;

    return (
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <SettingsProvider>
            <ThemesProvider>
              <BottomSheetModalProvider>
              <View style={{flex: 1}}>
          
              <Stack

                screenOptions={{
                  animation: 'fade',
                  
                }}
              >
                
                <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade'}} />
                <Stack.Screen name="Board" options={{ headerShown: false, animation: 'fade'}}/>
                <Stack.Screen name="Index" options={{ headerShown: false, animation: 'fade'}}/>
              </Stack>
              </View>
              </BottomSheetModalProvider>
              </ThemesProvider>
          </SettingsProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
        
    )
  }