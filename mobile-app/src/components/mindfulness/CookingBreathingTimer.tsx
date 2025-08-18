import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Vibration,
  AppState,
} from 'react-native';
import {
  Text,
  IconButton,
  Button,
  useTheme,
} from 'react-native-paper';
import { useTranslation } from '../../hooks/useTranslation';
import Svg, { Circle } from 'react-native-svg';
// Removed react-native-background-timer; using foreground setInterval. For background cadence use expo-background-fetch tasks.
import { showToast } from '../../utils/toast';
import TimerService from '../../services/TimerService';
// Optional: use expo-av for sound playback if needed
// import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;
const STROKE_WIDTH = 12;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface CookingBreathingTimerProps {
  cookingTime: number; // in minutes
  recipeName: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

const CookingBreathingTimer: React.FC<CookingBreathingTimerProps> = ({
  cookingTime,
  recipeName,
  onComplete,
  onCancel,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [timeRemaining, setTimeRemaining] = useState(cookingTime * 60); // Convert to seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const breathingOpacity = useRef(new Animated.Value(0.6)).current;
  
  const completionSound = useRef<any>(null);

  useEffect(() => {
    // Optional: load sound via expo-av

    return () => {
      // Optional: unload via expo-av
    };
  }, []);

  useEffect(() => {
    // Handle app state changes for background timer
    const subscription = AppState.addEventListener('change', () => {});

    return () => {
      subscription.remove();
    };
  }, [isActive, isPaused]);

  useEffect(() => {
    let interval: any;
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isPaused, timeRemaining]);

  useEffect(() => {
    if (isActive && !isPaused) {
      startBreathingAnimation();
    }
  }, [isActive, isPaused, currentPhase]);

  const startBreathingAnimation = () => {
    // Breathing animation that continues throughout cooking
    const inhale = () => {
      setCurrentPhase('inhale');
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breathingOpacity, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isActive && !isPaused) {
          hold();
        }
      });
    };

    const hold = () => {
      setCurrentPhase('hold');
      setTimeout(() => {
        if (isActive && !isPaused) {
          exhale();
        }
      }, 4000);
    };

    const exhale = () => {
      setCurrentPhase('exhale');
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breathingOpacity, {
          toValue: 0.6,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (isActive && !isPaused) {
          setBreathCount((prev) => prev + 1);
          inhale();
        }
      });
    };

    // Start the cycle based on current phase
    switch (currentPhase) {
      case 'inhale':
        inhale();
        break;
      case 'hold':
        hold();
        break;
      case 'exhale':
        exhale();
        break;
    }
  };

  const handleStart = async () => {
    setIsActive(true);
    setIsPaused(false);
    Vibration.vibrate(100);
    const durationMs = cookingTime * 60 * 1000;
    const timer = await TimerService.startTimer({ id: `cook_${recipeName}`, type: 'cooking', durationMs, metadata: { recipeName } });
    const fireAt = timer.startedAt + durationMs;
    await TimerService.cancelScheduledNotifications(timer.id);
    await TimerService.scheduleCompletionNotification(timer.id, fireAt, {
      title: '⏲️ Cooking timer finished',
      body: `${recipeName} is ready!`,
      data: { recipeName },
    });
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    Vibration.vibrate(100);
  };

  const handleComplete = useCallback(async () => {
    setIsActive(false);
    // Optional: play via expo-av
    Vibration.vibrate([0, 200, 100, 200]);
    
    showToast({
      message: t('cooking.timerComplete', { recipe: recipeName }),
      preset: 'success',
    });

    onComplete?.();
    await TimerService.stopTimer(`cook_${recipeName}`);
  }, [recipeName, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = cookingTime * 60;
    const elapsed = totalSeconds - timeRemaining;
    return elapsed / totalSeconds;
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return t('cooking.breatheIn');
      case 'hold':
        return t('cooking.holdBreath');
      case 'exhale':
        return t('cooking.breatheOut');
    }
  };

  const progressStrokeDashoffset = CIRCUMFERENCE * (1 - getProgress());

  return (
    <View style={styles.container}>
      <Text style={styles.recipeName}>{recipeName}</Text>

      <View style={styles.timerContainer}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svg}>
          {/* Background circle */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke="#E0E0E0"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            stroke={colors.primary}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={progressStrokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
          />
        </Svg>

        <Animated.View
          style={[
            styles.innerCircle,
            {
              transform: [{ scale: scaleAnim }],
              opacity: breathingOpacity,
            },
          ]}
        >
          <Text style={styles.timeText}>{formatTime(timeRemaining)}</Text>
          {isActive && (
            <>
              <Text style={styles.phaseText}>{getPhaseText()}</Text>
              <Text style={styles.breathCount}>
                {t('cooking.breathCount', { count: breathCount })}
              </Text>
            </>
          )}
        </Animated.View>
      </View>

      <View style={styles.controls}>
        {!isActive ? (
          <Button
            mode="contained"
            onPress={handleStart}
            style={styles.startButton}
            icon="play"
          >
            {t('cooking.startTimer')}
          </Button>
        ) : (
          <View style={styles.activeControls}>
            <IconButton
              icon={isPaused ? 'play' : 'pause'}
              size={32}
              onPress={handlePause}
              style={styles.controlButton}
            />
            <IconButton
              icon="stop"
              size={32}
              onPress={() => {
                setIsActive(false);
                onCancel?.();
              }}
              style={styles.controlButton}
            />
          </View>
        )}
      </View>

      <View style={styles.tips}>
        <Text style={styles.tipTitle}>{t('cooking.mindfulTip')}</Text>
        <Text style={styles.tipText}>{t('cooking.tipMessage')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  timerContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  svg: {
    position: 'absolute',
  },
  innerCircle: {
    width: CIRCLE_SIZE - STROKE_WIDTH * 4,
    height: CIRCLE_SIZE - STROKE_WIDTH * 4,
    borderRadius: (CIRCLE_SIZE - STROKE_WIDTH * 4) / 2,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  phaseText: {
    fontSize: 20,
    color: '#388E3C',
    marginTop: 8,
  },
  breathCount: {
    fontSize: 16,
    color: '#66BB6A',
    marginTop: 4,
  },
  controls: {
    marginBottom: 30,
  },
  startButton: {
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  activeControls: {
    flexDirection: 'row',
    gap: 20,
  },
  controlButton: {
    backgroundColor: '#F5F5F5',
  },
  tips: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E65100',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#BF360C',
  },
});

export default CookingBreathingTimer;