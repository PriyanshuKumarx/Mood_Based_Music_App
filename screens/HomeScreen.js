import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MoodSelector from "../components/MoodSelector";
import { moods } from "../constants/moods";
import { globalStyles } from "../styles/globalStyles";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [key, setKey] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  useFocusEffect(
    React.useCallback(() => {
      setKey((prevKey) => prevKey + 1);


      fadeAnim.setValue(0);
      slideUpAnim.setValue(30);


      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]).start();

      return () => {};
    }, [])
  );

  const handleMoodSelect = (mood) => {
    navigation.navigate("Playlist", { mood });
  };

  return (
    <ImageBackground
      source={require("../assets/images/bg-home.jpg")}
      style={globalStyles.container}
      blurRadius={4}
    >
      <LinearGradient
        colors={[
          "rgba(10,5,20,0.95)",
          "rgba(30,20,50,0.7)",
          "rgba(10,5,20,0.95)",
        ]}
        style={globalStyles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>
            <Text style={styles.title}>How are you feeling today?</Text>
            <Text style={styles.subtitle}>
              Select your mood to discover perfect music for your vibe
            </Text>
          </Animated.View>

          <View style={styles.moodContainer}>
            <MoodSelector key={key} moods={moods} onSelect={handleMoodSelect} />
          </View>

          <Animated.View
            style={[
              styles.bottomSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.favoritesButton, globalStyles.neumorphism]}
              onPress={() => navigation.navigate("Favorites")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["rgba(255,107,107,0.9)", "rgba(255,140,107,0.9)"]}
                style={[StyleSheet.absoluteFillObject, { borderRadius: 16 }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.buttonContent}>
                <Ionicons name="heart" size={24} color="white" />
                <Text style={styles.favoritesButtonText}>Your Favorites</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.recentContainer}>
              <Text style={styles.sectionTitle}>Recently Played</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentScroll}
              >
                {[1, 2, 3, 4].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.recentItem}
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={require("../assets/images/album-cover.jpg")}
                      style={styles.recentImage}
                      imageStyle={{ borderRadius: 12 }}
                    >
                      <LinearGradient
                        colors={["rgba(0,0,0,0.5)", "transparent"]}
                        style={styles.recentOverlay}
                      />
                      <View style={styles.playIcon}>
                        <Ionicons name="play" size={20} color="white" />
                      </View>
                    </ImageBackground>
                    <Text style={styles.recentTitle} numberOfLines={1}>
                      Song Title {item}
                    </Text>
                    <Text style={styles.recentArtist} numberOfLines={1}>
                      Artist Name
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: height * 0.1,
    paddingBottom: 30,
  },
  greeting: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    marginBottom: 12,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 24,
  },
  moodContainer: {
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  bottomSection: {
    paddingHorizontal: 24,
  },
  favoritesButton: {
    height: 60,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 30,
  },
  buttonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  favoritesButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  recentContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  recentScroll: {
    paddingRight: 24,
  },
  recentItem: {
    width: 150,
    marginRight: 15,
  },
  recentImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    justifyContent: "flex-end",
    padding: 10,
  },
  recentOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  playIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  recentTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  recentArtist: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
});