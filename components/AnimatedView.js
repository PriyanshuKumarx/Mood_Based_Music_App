import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

const AnimatedView = ({
  children,
  style,
  delay = 0,
  duration = 500,
  from = "fade",
  easing = "easeOut",
  ...props
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const easings = {
    linear: Easing.linear,
    easeIn: Easing.in(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeInOut: Easing.inOut(Easing.ease),
    bounce: Easing.bounce,
    elastic: Easing.elastic(1),
  };

  const getInitialStyle = () => {
    switch (from) {
      case "fade":
        return { opacity: 0 };
      case "left":
        return { opacity: 0, transform: [{ translateX: -50 }] };
      case "right":
        return { opacity: 0, transform: [{ translateX: 50 }] };
      case "top":
        return { opacity: 0, transform: [{ translateY: -50 }] };
      case "bottom":
        return { opacity: 0, transform: [{ translateY: 50 }] };
      case "scale":
        return { opacity: 0, transform: [{ scale: 0.8 }] };
      default:
        return { opacity: 0 };
    }
  };

  const getAnimatedStyle = () => {
    switch (from) {
      case "fade":
        return {
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        };
      case "left":
        return {
          opacity: animatedValue,
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        };
      case "right":
        return {
          opacity: animatedValue,
          transform: [
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };
      case "top":
        return {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        };
      case "bottom":
        return {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };
      case "scale":
        return {
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        };
      default:
        return {
          opacity: animatedValue,
        };
    }
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      delay,
      easing: easings[easing] || easings.easeOut,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[styles.container, getInitialStyle(), getAnimatedStyle(), style]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};


export default AnimatedView;
