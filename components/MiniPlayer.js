import React, { useContext } from "react"; // useState removed since not used
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AudioContext } from "../context/AudioContext";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "../styles/globalStyles";

const MiniPlayer = () => {
  const navigation = useNavigation();
  const {
    currentTrack,
    isPlaying,
    pauseSound,
    resumeSound,
    currentPosition,
    duration,
  } = useContext(AudioContext);
  const translateY = new Animated.Value(100);

  React.useEffect(() => {
    if (currentTrack && isPlaying) {
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: 100,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [currentTrack, isPlaying]);

  if (!currentTrack || !isPlaying) return null;

  const progressPercentage =
    duration > 0 ? (currentPosition / duration) * 100 : 0;

  return (
    <Animated.View
      style={[
        styles.container,
        globalStyles.neumorphism,
        { transform: [{ translateY }] },
      ]}
    >
      <LinearGradient
        colors={["rgba(50,50,50,0.9)", "rgba(30,30,30,0.95)"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Player", { track: currentTrack })}
          style={styles.content}
          activeOpacity={0.9}
        >
          <Image source={{ uri: currentTrack.cover }} style={styles.cover} />

          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>

          <TouchableOpacity
            onPress={isPlaying ? pauseSound : resumeSound}
            style={[styles.controlButton, globalStyles.glassmorphism]}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#FF6B6B"
            />
          </TouchableOpacity>

          <View style={[styles.progressBar, globalStyles.glassmorphism]}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 20,
    overflow: "hidden",
  },
  gradient: {
    padding: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  title: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  artist: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    marginTop: 2,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF6B6B",
    borderRadius: 3,
  },
});

export default MiniPlayer;
