import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import {
  Text,
  IconButton,
  useTheme,
  ProgressBar,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../../utils/toast';
import { useWellnessService } from '../../hooks/useWellnessData';
import { hapticFeedback } from '../../utils/haptic';

const { width, height } = Dimensions.get('window');

const BREATH_PHASES = {
  inhale: 4000,
  hold: 4000,
  exhale: 4000,
};

const DEFAULT_CYCLES = 5; // Default number of breath cycles

const BreathingExerciseScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { recordBreathingSession } = useWellnessService();
  
  const { context = 'general', returnScreen, duration } = route.params || {};
  
  // Calculate total cycles based on duration (each cycle is 12 seconds)
  const totalCycles = duration ? Math.round((duration * 60) / 12) : DEFAULT_CYCLES;
  
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      startBreathingCycle();
    } else {
      // Reset animations
      scaleAnim.setValue(0.4);
      opacityAnim.setValue(0.6);
      progressAnim.setValue(0);
    }
  }, [isActive]);

  const startBreathingCycle = () => {
    // Inhale phase
    setCurrentPhase('inhale');
    hapticFeedback.breathingPhaseChange();
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: BREATH_PHASES.inhale,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: BREATH_PHASES.inhale,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 0.33,
        duration: BREATH_PHASES.inhale,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Hold phase
      setCurrentPhase('hold');
      hapticFeedback.breathingPhaseChange();
      
      Animated.timing(progressAnim, {
        toValue: 0.66,
        duration: BREATH_PHASES.hold,
        useNativeDriver: false,
      }).start(() => {
        // Exhale phase
        setCurrentPhase('exhale');
        hapticFeedback.breathingPhaseChange();
        
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.4,
            duration: BREATH_PHASES.exhale,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.6,
            duration: BREATH_PHASES.exhale,
            useNativeDriver: true,
          }),
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: BREATH_PHASES.exhale,
            useNativeDriver: false,
          }),
        ]).start(() => {
          // Cycle complete
          if (currentCycle < totalCycles && isActive) {
            setCurrentCycle(currentCycle + 1);
            progressAnim.setValue(0);
            startBreathingCycle();
          } else {
            completeExercise();
          }
        });
      });
    });
  };

  const completeExercise = async () => {
    setIsActive(false);
    
    // Calculate session duration (each cycle is 12 seconds)
    const duration = currentCycle * 12; // seconds
    
    // Save session to wellness service
    try {
      await recordBreathingSession(duration, context as any, true);
      
      hapticFeedback.breathingComplete();
      showToast({
        message: t('breathing.sessionComplete'),
        preset: 'success',
      });
    } catch (error) {
      console.error('Error saving breathing session:', error);
    }
    
    // Small delay before navigating back
    setTimeout(() => {
      if (returnScreen) {
        navigation.navigate(returnScreen as any);
      } else {
        navigation.goBack();
      }
    }, 1500);
  };

  const handleStart = () => {
    hapticFeedback.breathingStart();
    setIsActive(true);
    setCurrentCycle(1);
  };

  const handleStop = () => {
    setIsActive(false);
    navigation.goBack();
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return t('breathing.inhaleInstruction');
      case 'hold':
        return t('breathing.holdInstruction');
      case 'exhale':
        return t('breathing.exhaleInstruction');
    }
  };

  const getContextMessage = () => {
    switch (context) {
      case 'pantry':
        return "Let's take a mindful moment before planning your meals";
      case 'meal':
        return "Prepare your mind and body for mindful eating";
      case 'shopping':
        return "Center yourself before making mindful food choices";
      case 'cooking':
        return "Find your calm before creating nourishing meals";
      case 'wellness':
        return "Take a moment for your wellbeing";
      case 'stress':
        return "Let's manage this stress together with some deep breathing";
      case 'pantry_organizing':
        return t('breathing.contexts.pantryOrganizing');
      case 'pre_meal':
        return t('breathing.contexts.preMeal');
      default:
        return "Take a moment to breathe and center yourself";
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Slowly rotating background animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <IconButton
            icon="close"
            size={28}
            onPress={handleStop}
            style={styles.closeButton}
          />
          <Text style={styles.cycleText}>
            {isActive ? `${currentCycle} / ${totalCycles}` : ''}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.contextMessage}>{getContextMessage()}</Text>

          <View style={styles.breathingContainer}>
            <Animated.View
              style={[
                styles.backgroundCircle,
                {
                  transform: [{ rotate: spin }],
                },
              ]}
            />
            
            <Animated.View
              style={[
                styles.breathingCircle,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                },
              ]}
            >
              <LinearGradient
                colors={['#81C784', '#66BB6A', '#4CAF50']}
                style={styles.gradientCircle}
              />
            </Animated.View>

            <View style={styles.centerContent}>
              {isActive ? (
                <>
                  <Text style={styles.phaseText}>{getPhaseText()}</Text>
                  <Text style={styles.breathCount}>4-4-4</Text>
                </>
              ) : (
                <>
                  <IconButton
                    icon="play"
                    size={48}
                    iconColor="#2E7D32"
                    onPress={handleStart}
                  />
                  <Text style={styles.startText}>{t('breathing.tapToStart')}</Text>
                </>
              )}
            </View>
          </View>

          {isActive && (
            <View style={styles.progressContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          )}

          <Text style={styles.tipText}>{t('breathing.tip')}</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  cycleText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contextMessage: {
    fontSize: 18,
    textAlign: 'center',
    color: '#1B5E20',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  breathingContainer: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  backgroundCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: width * 0.4,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
    borderStyle: 'dashed',
  },
  breathingCircle: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.4,
    overflow: 'hidden',
  },
  gradientCircle: {
    width: '100%',
    height: '100%',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  phaseText: {
    fontSize: 28,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  breathCount: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  startText: {
    fontSize: 16,
    color: '#2E7D32',
    marginTop: 8,
  },
  progressContainer: {
    width: width * 0.8,
    height: 4,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  tipText: {
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 40,
  },
});

export default BreathingExerciseScreen;