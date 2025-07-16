// components/PlaylistItem.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../styles/globalStyles";

const PlaylistItem = ({ track, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.container, globalStyles.glassmorphism]}>
        <Image source={{ uri: track.cover }} style={styles.coverImage} />

        <View style={styles.infoContainer}>
          <Text style={[styles.title, globalStyles.text3D]} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {track.artist}
          </Text>
        </View>

        <View style={styles.durationContainer}>
          <LinearGradient
            colors={["#FF6B6B", "#FF8E53"]}
            style={[styles.playButton, globalStyles.neumorphism]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="play" size={20} color="white" />
          </LinearGradient>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(30,30,30,0.5)",
  },
  coverImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  artist: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "500",
  },
  durationContainer: {
    paddingLeft: 10,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlaylistItem;
