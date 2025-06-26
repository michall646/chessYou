import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CombinedDefaultTheme, CombinedDarkTheme } from '../themes'; // Adjust path

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isThemeLoaded, setIsThemeLoaded] = useState(false); // To prevent flickering

  // Load theme from AsyncStorage on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        let copy = await getItem("ChessYouSettings", {themeIndex: 0});
        const storedTheme = await AsyncStorage.getItem('appTheme');
        if (storedTheme !== null) {
          setIsDarkTheme(storedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme from AsyncStorage:', error);
      } finally {
        setIsThemeLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save theme to AsyncStorage whenever it changes
  useEffect(() => {
    if (isThemeLoaded) { // Only save after initial load to avoid overwriting
      const saveTheme = async () => {
        try {
          await AsyncStorage.setItem('appTheme', isDarkTheme ? 'dark' : 'light');
        } catch (error) {
          console.error('Error saving theme to AsyncStorage:', error);
        }
      };
      saveTheme();
    }
  }, [isDarkTheme, isThemeLoaded]);

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  const theme = useMemo(
    () => (isDarkTheme ? CombinedDarkTheme : CombinedDefaultTheme),
    [isDarkTheme]
  );

  if (!isThemeLoaded) {
    // Optionally render a loading screen or splash screen here
    return null; // Or a <View><Text>Loading Theme...</Text></View>
  }

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkTheme }}>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeToggle = () => useContext(ThemeContext);