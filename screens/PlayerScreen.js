import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "../styles/globalStyles";
import { AudioContext } from "../context/AudioContext";
import MusicPlayer from "../components/MusicPlayer";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function PlayerScreen({ route, navigation }) {
  const { track } = route.params;
  const { currentTrack, isPlaying, toggleFavorite, favorites } =
    useContext(AudioContext);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites.some((fav) => fav.id === track.id));

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    return () => {
      rotateAnim.setValue(0);
    };
  }, [track]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <ImageBackground
      source={{ uri: track.cover }}
      style={globalStyles.container}
      blurRadius={10}
    >
      <LinearGradient
        colors={[
          "rgba(10,10,20,0.9)",
          "rgba(30,20,40,0.7)",
          "rgba(10,10,20,0.9)",
        ]}
        style={globalStyles.container}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, globalStyles.glassmorphism]}
        >
          <Ionicons name="chevron-down" size={28} color="white" />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.coverContainer,
            { transform: [{ rotate: rotation }] },
            globalStyles.floating,
          ]}
        >
          <Image source={{ uri: track.cover }} style={styles.coverArt} />
          <View style={styles.vinylRing} />
        </Animated.View>

        <View style={styles.trackInfo}>
          <Text style={[styles.songTitle, globalStyles.text3D]}>
            {track.title}
          </Text>
          <Text style={styles.artist}>{track.artist}</Text>
        </View>

        <MusicPlayer track={track} />

        <TouchableOpacity
          onPress={() => {
            toggleFavorite(track);
            setIsFavorite(!isFavorite);
          }}
          style={[styles.favoriteButton, globalStyles.neumorphism]}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={28}
            color={isFavorite ? "#FF6B6B" : "white"}
          />
        </TouchableOpacity>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  coverContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    alignSelf: "center",
    marginTop: height * 0.1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  coverArt: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
  },
  vinylRing: {
    position: "absolute",
    width: width * 0.65,
    height: width * 0.65,
    borderRadius: width * 0.325,
    borderWidth: 10,
    borderColor: "rgba(255,255,255,0.1)",
  },
  trackInfo: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  songTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  artist: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    textAlign: "center",
  },
  favoriteButton: {
    position: "absolute",
    bottom: 180,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(40,40,40,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});