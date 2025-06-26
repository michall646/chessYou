import { View, Text } from 'react-native'
import React from 'react'
import { useSettings } from './SettingsContext'
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme'
import { generatedTheme } from '../../assets/GeneratedThemes';
import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { adaptNavigationTheme, PaperProvider } from 'react-native-paper'
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const ThemesProvider = ({children}) => {
    const { settings, updateSettings } = useSettings();
  const [autoColorScheme, setColorScheme] = useState(useColorScheme());
  const [materialTheme, setMaterialTheme] = useState(
    useMaterial3Theme({ fallbackSourceColor: "#3400e0" }).theme
  );

  const colorScheme =
    settings.darkMode === "auto"
      ? autoColorScheme
      : settings.darkMode;


  const capitalizeFirstLetter =useCallback((string) => {
    return string?.charAt(0).toUpperCase() + string.slice(1);
  }, [])

  const paperTheme = useMemo(() => {
    console.log(colorScheme);
    if (colorScheme === "dark") {
      if (settings.autoColor) {
        return { ...MD3DarkTheme, colors: materialTheme.dark };
      } else {
        return {
          ...MD3DarkTheme,
          colors:
            generatedTheme[settings.themeIndex][
              capitalizeFirstLetter(colorScheme)
            ].colors,
        };
      }
    } else {
      if (settings.autoColor) {
        return { ...MD3LightTheme, colors: materialTheme.light };
      } else {
        return {
          ...MD3LightTheme,
          colors:
            generatedTheme[settings.themeIndex][
              capitalizeFirstLetter(colorScheme)
            ].colors,
        };
      }
    }
  }, 
  [
    colorScheme,
    materialTheme,
    settings
  ]);
  const navigationTheme = useMemo(() =>
    colorScheme === "dark"
      ? adaptNavigationTheme({
          reactNavigationDark: MD3DarkTheme,
          materialDark: paperTheme,
        }).DarkTheme
      : adaptNavigationTheme({
          reactNavigationLight: MD3LightTheme,
          materialLight: paperTheme,
        }).LightTheme
  , [
    colorScheme,
    materialTheme,
    settings
  ]);

  return (
    <ThemeProvider value={navigationTheme}>
        <StatusBar color={paperTheme.colors.surfaceVariant}/>
        <PaperProvider theme={paperTheme}>
            {children}
        </PaperProvider>
    </ThemeProvider>
  )
}

export default ThemesProvider