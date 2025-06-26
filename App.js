
import { StyleSheet, Text, View } from 'react-native';
import PlayMode from './components/Play/PlayMode';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <PlayMode/>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

