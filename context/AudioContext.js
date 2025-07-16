import React, { createContext, useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const positionUpdateRef = useRef(null);

  useEffect(() => {
    loadFavorites();

    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (positionUpdateRef.current) {
        clearInterval(positionUpdateRef.current);
      }
    };
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const toggleFavorite = async (track) => {
    const isFavorite = favorites.some((fav) => fav.id === track.id);
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((fav) => fav.id !== track.id);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      newFavorites = [...favorites, track];
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  const playSound = async (track) => {
    try {
      // Stop any existing position updates
      if (positionUpdateRef.current) {
        clearInterval(positionUpdateRef.current);
      }

      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
      }

      // Create new sound instance
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.audio },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setDuration(status.durationMillis);
            if (status.isPlaying) {
              setIsPlaying(true);
            }
          }
        }
      );

      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
      setPosition(0);

      // Set up position update interval
      positionUpdateRef.current = setInterval(async () => {
        try {
          if (newSound) {
            const status = await newSound.getStatusAsync();
            if (status.isLoaded) {
              setPosition(status.positionMillis);
            }
          }
        } catch (error) {
          console.error("Error getting position:", error);
        }
      }, 500); // Update every 500ms

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          if (status.didJustFinish) {
            setIsPlaying(false);
            setPosition(0);
          }
        }
      });
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeSound = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const seekToPosition = async (position) => {
    if (sound) {
      await sound.setPositionAsync(position);
      setPosition(position);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        sound,
        isPlaying,
        currentTrack,
        duration,
        position,
        favorites,
        playSound,
        pauseSound,
        resumeSound,
        seekToPosition,
        toggleFavorite,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};