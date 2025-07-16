import "react-native-gesture-handler";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AudioProvider } from "./context/AudioContext";
import { StatusBar } from "expo-status-bar";
import MainNavigator from "./navigation/MainNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AudioProvider>
        <StatusBar style="light" />
        <MainNavigator />
      </AudioProvider>
    </SafeAreaProvider>
  );
}
