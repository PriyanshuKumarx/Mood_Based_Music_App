import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./AppNavigator";
import MiniPlayer from "../components/MiniPlayer";

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <AppNavigator />
      <MiniPlayer />
    </NavigationContainer>
  );
}
