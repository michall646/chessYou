// SettingsContext.js
import React, { createContext, useState, useContext, useEffect} from 'react';
import { getItem } from '../../engine/storageService';
import { useTranslation } from 'react-i18next';

// Define the initial state for your settings
const initialSettings = {
  darkMode: 'light',
  themeIndex: 3
};

// Create the context
const SettingsContext = createContext({
  settings: initialSettings,
  updateSettings: (newSettings) => {}, // Placeholder for the update function
});

// Create a custom hook for easy consumption of the context
export const useSettings = () => {
  return useContext(SettingsContext);
};

// Create the Provider component
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(initialSettings);
  const {i18n} = useTranslation();

  const updateSettings = (newSettings) => {
    console.log(newSettings);
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings, // Merge new settings with previous ones
    }));
  };

  useEffect(() => {
    const getFromStorage = async () => {
      const temp =  await getItem("ChessYouSettings", []);
      i18n.changeLanguage(temp.language)
      updateSettings(temp)
    }
    getFromStorage();
  }, [])
  

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;