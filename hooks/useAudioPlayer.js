import { useState, useEffect } from "react";
import { Audio } from "expo-av";

export default function useAudioPlayer() {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const playSound = async (audioUri) => {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUri },
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
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      }
    });
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
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return {
    sound,
    isPlaying,
    duration,
    position,
    playSound,
    pauseSound,
    resumeSound,
    seekToPosition,
  };
}
