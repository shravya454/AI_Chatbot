import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatScreen from './screens/ChatScreen';

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <ChatScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
