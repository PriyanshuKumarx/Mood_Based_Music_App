import React from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { globalStyles } from "../styles/globalStyles";
import PlaylistItem from "../components/PlaylistItem";
import { AudioContext } from "../context/AudioContext";

export default function FavoritesScreen({ navigation }) {
  const { favorites } = React.useContext(AudioContext);

  const handleTrackPress = (track) => {
    navigation.navigate("Player", { track });
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg-favorites.jpg")}
      style={globalStyles.container}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.8)", "transparent", "rgba(0,0,0,0.8)"]}
        style={globalStyles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Favorites</Text>
          <Text style={styles.subtitle}>{favorites.length} saved tracks</Text>
        </View>

        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PlaylistItem
                track={item}
                onPress={() => handleTrackPress(item)}
              />
            )}
            contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the heart icon to save tracks
            </Text>    
          </View>
        )};
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  emptySubtext: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 14,
  },
});
