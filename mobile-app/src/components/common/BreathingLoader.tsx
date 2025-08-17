import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withDelay,
} from 'react-native-reanimated';
import { colors, spacing, durations } from '../../design-system';
import { MindfulText } from '../../design-system/atoms/MindfulText';

interface BreathingLoaderProps {
  size?: number;
  color?: string;
  text?: string;
  showText?: boolean;
  style?: ViewStyle;
}

export const BreathingLoader: React.FC<BreathingLoaderProps> = ({
  size = 80,
  color = colors.sage,
  text = 'Breathe...',
  showText = true,
  style,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  React.useEffect(() => {
    // Breathing animation: inhale (4s) - hold (2s) - exhale (4s) - hold (2s)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: durations.breathIn }), // Inhale
        withDelay(durations.breathHold, withTiming(1.3, { duration: 0 })), // Hold
        withTiming(1, { duration: durations.breathOut }), // Exhale
        withDelay(durations.breathHold, withTiming(1, { duration: 0 })), // Hold
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: durations.breathIn }),
        withDelay(durations.breathHold, withTiming(1, { duration: 0 })),
        withTiming(0.4, { duration: durations.breathOut }),
        withDelay(durations.breathHold, withTiming(0.4, { duration: 0 })),
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const innerCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 0.8 }],
    opacity: opacity.value * 0.6,
  }));

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.circleContainer, { width: size, height: size }]}>
        <Animated.View
          style={[
            styles.outerCircle,
            {
              width: size,
              height: size,
              backgroundColor: color,
            },
            animatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.innerCircle,
            {
              width: size * 0.6,
              height: size * 0.6,
              backgroundColor: color,
            },
            innerCircleStyle,
          ]}
        />
      </View>
      {showText && (
        <MindfulText
          variant="caption"
          color={colors.textTertiary}
          style={styles.text}
        >
          {text}
        </MindfulText>
      )}
    </View>
  );
};

// Skeleton loader variant with breathing rhythm
export const BreathingSkeleton: React.FC<{
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}> = ({ width = '100%', height = 20, borderRadius = 8, style }) => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: durations.breathIn }),
        withTiming(0.3, { duration: durations.breathOut }),
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.warmBeige,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

// List skeleton with staggered breathing animation
export const BreathingListSkeleton: React.FC<{
  count?: number;
  itemHeight?: number;
  spacing?: number;
}> = ({ count = 3, itemHeight = 80, spacing: itemSpacing = spacing.md }) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={{ marginBottom: itemSpacing }}>
          <BreathingSkeleton
            height={itemHeight}
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.3,
  },
  innerCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.5,
  },
  text: {
    marginTop: spacing.lg,
  },
});

export default BreathingLoader;