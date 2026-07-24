import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoadingIndicator = ({ theme }) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: -6,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createAnimation(dot1, 0);
    const anim2 = createAnimation(dot2, 150);
    const anim3 = createAnimation(dot3, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
        <Ionicons name="sparkles" size={14} color="#FFFFFF" />
      </View>

      <View style={[styles.bubble, { backgroundColor: theme.aiBubble, borderColor: theme.border }]}>
        <Text style={[styles.thinkingText, { color: theme.textSecondary }]}>AI is thinking</Text>
        <View style={styles.dotsRow}>
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: theme.primary, transform: [{ translateY: dot1 }] },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: theme.primary, transform: [{ translateY: dot2 }] },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              { backgroundColor: theme.primary, transform: [{ translateY: dot3 }] },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  thinkingText: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 8,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default LoadingIndicator;
