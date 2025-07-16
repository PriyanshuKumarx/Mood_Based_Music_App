// components/MoodSelector.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import { LinearGradient } from "expo-linear-gradient";

const MoodSelector = ({ moods, onSelect }) => {
  const animatedValues = moods.map(() => new Animated.Value(0));

  React.useEffect(() => {
    const animations = animatedValues.map((value, index) => {
      return Animated.spring(value, {
        toValue: 1,
        friction: 5,
        tension: 40,
        delay: index * 100,
        useNativeDriver: true,
      });
    });

    Animated.stagger(100, animations).start();
  }, []);

  return (
    <View style={styles.container}>
      {moods.map((mood, index) => {
        const scale = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        });

        const opacity = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });

        return (
          <Animated.View
            key={mood.id}
            style={[styles.moodItem, { transform: [{ scale }], opacity }]}
          >
            <TouchableOpacity
              style={[styles.moodButton, globalStyles.floating]}
              onPress={() => onSelect(mood)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[mood.color, `${mood.color}CC`]}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodText}>{mood.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 24,
    paddingHorizontal: 10,
  },
  moodItem: {
    margin: 8,
  },
  moodButton: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: "hidden",
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default MoodSelector;
