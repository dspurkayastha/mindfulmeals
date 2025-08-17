import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useTranslation } from '../../hooks/useTranslation';

const { width } = Dimensions.get('window');

interface MindfulLoaderProps {
  duration?: 'short' | 'medium' | 'long'; // <3s, 3-10s, >10s
  message?: string;
  showBreathingGuide?: boolean;
  style?: any;
}

const BREATH_PHASES = {
  inhale: 4000,
  hold: 4000,
  exhale: 4000,
};

const TOTAL_CYCLE = Object.values(BREATH_PHASES).reduce((a, b) => a + b, 0);

const MindfulLoader: React.FC<MindfulLoaderProps> = ({
  duration = 'medium',
  message,
  showBreathingGuide = true,
  style,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [reducedMotion, setReducedMotion] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check for reduced motion preference
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      // Simple spinner for reduced motion
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
      return;
    }

    // Breathing animation sequence
    const breathingAnimation = () => {
      // Inhale phase
      setCurrentPhase('inhale');
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: BREATH_PHASES.inhale,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: BREATH_PHASES.inhale,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hold phase
        setCurrentPhase('hold');
        setTimeout(() => {
          // Exhale phase
          setCurrentPhase('exhale');
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: BREATH_PHASES.exhale,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.8,
              duration: BREATH_PHASES.exhale,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Restart cycle
            breathingAnimation();
          });
        }, BREATH_PHASES.hold);
      });
    };

    breathingAnimation();

    return () => {
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [reducedMotion]);

  const getLoadingMessage = () => {
    if (message) return message;
    
    switch (duration) {
      case 'short':
        return t('loading.mindfulMoment');
      case 'medium':
        return t('loading.breatheWhileWaiting');
      case 'long':
        return t('loading.practicePatience');
      default:
        return t('loading.breatheWhileWaiting');
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return t('breathing.inhale');
      case 'hold':
        return t('breathing.hold');
      case 'exhale':
        return t('breathing.exhale');
    }
  };

  const renderBreathingCircle = () => {
    if (reducedMotion) {
      const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });

      return (
        <Animated.View
          style={[
            styles.circle,
            {
              backgroundColor: colors.primary,
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <View style={[styles.innerCircle, { backgroundColor: colors.background }]} />
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: colors.primary,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={styles.breathingDots}>
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: colors.surface,
                  transform: [
                    {
                      rotate: `${index * 90}deg`,
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderBreathingCircle()}
      
      <Text style={[styles.message, { color: colors.onSurface }]}>
        {getLoadingMessage()}
      </Text>
      
      {showBreathingGuide && !reducedMotion && (
        <Text style={[styles.phaseText, { color: colors.primary }]}>
          {getPhaseText()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  innerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  breathingDots: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: -50,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  phaseText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MindfulLoader;