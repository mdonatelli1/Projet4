import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import AuthProvider from './contexts/AuthProvider.jsx';

import Router from "./Router";

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.main}>
        <Router />
        <StatusBar style="auto" />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: "5%",
    height: "100vh",
    width: "100%",
    backgroundColor: "#1B1918",
    display: "flex",
    alignItems: "center"
  }
});
