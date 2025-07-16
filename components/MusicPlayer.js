import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProgressBar from "./ProgressBar";
import WaveAnimation from "./WaveAnimation";
import { AudioContext } from "../context/AudioContext";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const MusicPlayer = ({ track }) => {
  const {
    isPlaying,
    playSound,
    pauseSound,
    resumeSound,
    duration,
    position,
    seekToPosition,
    currentTrack,
  } = React.useContext(AudioContext);
  const [isLocalPlaying, setIsLocalPlaying] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [containerWidth, setContainerWidth] = useState(300);
  const [isSeeking, setIsSeeking] = useState(false);
  const [displayPosition, setDisplayPosition] = useState(0);

  useEffect(() => {
    if (currentTrack?.id === track.id) {
      setIsLocalPlaying(isPlaying);

      // Update display position when not seeking
      if (!isSeeking) {
        setDisplayPosition(position);
      }
    } else {
      setIsLocalPlaying(false);
      setDisplayPosition(0);
    }
  }, [isPlaying, currentTrack, position]);

  const handlePlayPause = async () => {
    try {
      if (currentTrack?.id === track.id) {
        if (isPlaying) {
          await pauseSound();
        } else {
          await resumeSound();
        }
      } else {
        await playSound(track);
      }

      // Button press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error("Error handling play/pause:", error);
    }
  };

  const formatTime = (ms) => {
    if (!ms) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const onGestureEvent = (event) => {
    if (currentTrack?.id === track.id && containerWidth > 0) {
      const locationX = event.nativeEvent.x;
      const newPosition = Math.max(
        0,
        Math.min(duration, (locationX / containerWidth) * duration)
      );

      setIsSeeking(true);
      setDisplayPosition(newPosition);
    }
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (currentTrack?.id === track.id) {
        seekToPosition(displayPosition);
      }
      setIsSeeking(false);
    }
  };

  // Calculate progress percentage for display
  const progress = duration > 0 ? (displayPosition / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <View
          style={styles.progressContainer}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setContainerWidth(width);
          }}
        >
          <ProgressBar progress={progress} />

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(displayPosition)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>
      </PanGestureHandler>

      <View style={styles.controlsContainer}>
        <TouchableOpacity>
          <Ionicons name="play-skip-back" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlayPause}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            {isLocalPlaying ? (
              <Ionicons name="pause" size={50} color="white" />
            ) : (
              <Ionicons name="play" size={50} color="white" />
            )}
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="play-skip-forward" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {isLocalPlaying && <WaveAnimation />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  progressContainer: {
    width: "100%",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  timeText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
});

export default MusicPlayer;
