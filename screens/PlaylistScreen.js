import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "../styles/globalStyles";
import PlaylistItem from "../components/PlaylistItem";
import { playlists } from "../constants/playlists";
import { moods } from "../constants/moods";
import { Image } from "react-native"; 

export default function PlaylistScreen({ route, navigation }) {
  const { mood } = route.params;
  const [tracks, setTracks] = useState([]);
  const [moodData, setMoodData] = useState({});

  useEffect(() => {
    const selectedMood = moods.find((m) => m.id === mood.id);
    setMoodData(selectedMood);

    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const moodKey = mood.name.toLowerCase();
      setTracks(playlists[moodKey] || []);
    }, 800);

    return () => clearTimeout(timer);
  }, [mood]);

  const handleTrackPress = (track) => {
    navigation.navigate("Player", { track });
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg-playlist.jpg")}
      style={globalStyles.container}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "transparent", "rgba(0,0,0,0.8)"]}
        style={globalStyles.container}
      >
        <View style={styles.header}>
          <View style={styles.moodHeader}>
            <Image
              source={{ uri: moodData.cover || "https://picsum.photos/200" }}
              style={styles.moodImage}
            />
            <View>
              <Text style={styles.moodTitle}>{moodData.name} Mood</Text>
              <Text style={styles.moodDescription}>{moodData.description}</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlaylistItem track={item} onPress={() => handleTrackPress(item)} />
          )}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        />
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 40,
  },
  moodHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  moodImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  moodTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  moodDescription: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
  },
  listContent: {
    paddingBottom: 100,
  },
});