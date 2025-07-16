import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

const WaveAnimation = () => {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(anim1, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim1, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(100),
          Animated.timing(anim2, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim2, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(anim3, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim3, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  const scaleY1 = anim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });

  const scaleY2 = anim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1.2],
  });

  const scaleY3 = anim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.8],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bar,
          {
            transform: [{ scaleY: scaleY1 }],
            height: 20,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.bar,
          {
            transform: [{ scaleY: scaleY2 }],
            height: 25,
            marginHorizontal: 5,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.bar,
          {
            transform: [{ scaleY: scaleY3 }],
            height: 15,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    height: 30,
    marginTop: 20,
  },
  bar: {
    width: 4,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 2,
  },
});

export default WaveAnimation;
