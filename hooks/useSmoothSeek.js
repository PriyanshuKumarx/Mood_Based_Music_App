import { useState, useRef, useEffect } from "react";
import { Animated } from "react-native";

export default function useSmoothSeek(initialPosition, duration) {
  const [seekPosition, setSeekPosition] = useState({
    value: initialPosition,
    isSeeking: false,
  });
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Initialize progress animation
  useEffect(() => {
    progressAnim.setValue(initialPosition);
  }, []);

  // Update position when track changes
  useEffect(() => {
    if (!seekPosition.isSeeking) {
      progressAnim.setValue(initialPosition);
      setSeekPosition({
        value: initialPosition,
        isSeeking: false,
      });
    }
  }, [initialPosition]);

  const handleSeek = (position, isSeeking) => {
    // Update immediately for smooth UI response
    setSeekPosition({
      value: position,
      isSeeking,
    });

    // Animate to the new position
    Animated.timing(progressAnim, {
      toValue: position,
      duration: isSeeking ? 0 : 200, // Instant during drag, smooth on release
      useNativeDriver: false,
    }).start();
  };

  return {
    seekPosition,
    progressAnim,
    handleSeek,
  };
}
