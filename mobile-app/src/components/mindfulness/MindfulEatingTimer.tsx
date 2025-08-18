import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Vibration,
  AppState,
  AppStateStatus,
} from 'react-native';
import {
  Text,
  IconButton,
  Button,
  useTheme,
  ProgressBar,
  Card,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '../../hooks/useTranslation';
import * as Haptics from 'expo-haptics';
// Optional: use expo-av for sound playback if needed
// import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface MindfulEatingTimerProps {
  mealName: string;
  mealId: string;
  intention?: {
    desiredFeeling: string;
    mindfulEating: boolean;
    portionAwareness: boolean;
  };
  onComplete?: (data: any) => void;
  onCancel?: () => void;
}

const EATING_PHASES = {
  PREPARATION: { duration: 30, name: 'preparation' },
  FIRST_THIRD: { duration: 600, name: 'firstThird' }, // 10 minutes
  CHECK_IN_1: { duration: 60, name: 'checkIn1' },
  SECOND_THIRD: { duration: 600, name: 'secondThird' }, // 10 minutes
  CHECK_IN_2: { duration: 60, name: 'checkIn2' },
  FINAL_THIRD: { duration: 600, name: 'finalThird' }, // 10 minutes
  REFLECTION: { duration: 60, name: 'reflection' },
};

const MINDFUL_TIPS = [
  'eating.tips.lookAtFood',
  'eating.tips.smellAroma',
  'eating.tips.firstBite',
  'eating.tips.chewSlowly',
  'eating.tips.putDownFork',
  'eating.tips.breatheBetween',
  'eating.tips.noticeTexture',
  'eating.tips.appreciateFlavors',
];

const MindfulEatingTimer: React.FC<MindfulEatingTimerProps> = ({
  mealName,
  mealId,
  intention,
  onComplete,
  onCancel,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('PREPARATION');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [fullnessLevel, setFullnessLevel] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [biteCount, setBiteCount] = useState(0);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const tipOpacity = useRef(new Animated.Value(1)).current;
  
  const appState = useRef(AppState.currentState);
  const intervalRef = useRef<number | null>(null);
  const gentleChime = useRef<any>(null);

  useEffect(() => {
    // Optional: load sound via expo-av

    // App state listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      if (intervalRef.current) {
        BackgroundTimer.clearInterval(intervalRef.current);
      }
      // Optional: unload via expo-av
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    appState.current = nextAppState;
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      // Start timer (foreground only). Background cadence handled via BackgroundFetch elsewhere if needed.
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1;
          checkPhaseTransition(newTime);
          return newTime;
        });
      }, 1000) as unknown as number;

      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused]);

  useEffect(() => {
    // Rotate tips every 2 minutes
    const tipInterval = setInterval(() => {
      if (isActive && !isPaused) {
        Animated.sequence([
          Animated.timing(tipOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(tipOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
        
        setCurrentTip(prev => (prev + 1) % MINDFUL_TIPS.length);
      }
    }, 120000); // 2 minutes

    return () => clearInterval(tipInterval);
  }, [isActive, isPaused]);

  const checkPhaseTransition = (time: number) => {
    let totalTime = 0;
    let nextPhase = null;

    for (const [phase, config] of Object.entries(EATING_PHASES)) {
      totalTime += config.duration;
      if (time === totalTime) {
        nextPhase = phase;
        break;
      }
    }

    if (nextPhase) {
      transitionToPhase(nextPhase);
    }
  };

  const transitionToPhase = (phase: string) => {
    setCurrentPhase(phase);
    
    // Play gentle chime
    // Optional: play via expo-av
    
    // Haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Special handling for check-ins
    if (phase.includes('CHECK_IN')) {
      setIsPaused(true);
      Vibration.vibrate([0, 200, 100, 200]);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setElapsedTime(0);
    setCurrentPhase('PREPARATION');
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleBite = () => {
    setBiteCount(prev => prev + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Pulse animation
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleFullnessCheck = async (level: number) => {
    setFullnessLevel(level);
    
    if (currentPhase.includes('CHECK_IN')) {
      // Resume after check-in
      setIsPaused(false);
      
      // Move to next phase
      const phases = Object.keys(EATING_PHASES);
      const currentIndex = phases.indexOf(currentPhase);
      if (currentIndex < phases.length - 1) {
        setCurrentPhase(phases[currentIndex + 1]);
      }
    }

    // Save fullness data
    try {
      const stored = await AsyncStorage.getItem('@eating_sessions');
      const sessions = stored ? JSON.parse(stored) : [];
      const currentSession = sessions.find((s: any) => s.mealId === mealId) || {
        mealId,
        mealName,
        fullnessChecks: [],
      };
      
      currentSession.fullnessChecks.push({
        phase: currentPhase,
        level,
        timestamp: new Date().toISOString(),
      });

      if (!stored) {
        sessions.push(currentSession);
      }
      
      await AsyncStorage.setItem('@eating_sessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving fullness data:', error);
    }
  };

  const handleComplete = async () => {
    const sessionData = {
      mealId,
      mealName,
      duration: elapsedTime,
      biteCount,
      finalFullness: fullnessLevel,
      completedAt: new Date().toISOString(),
    };

    try {
      const stored = await AsyncStorage.getItem('@eating_sessions');
      const sessions = stored ? JSON.parse(stored) : [];
      const sessionIndex = sessions.findIndex((s: any) => s.mealId === mealId);
      
      if (sessionIndex >= 0) {
        sessions[sessionIndex] = { ...sessions[sessionIndex], ...sessionData };
      } else {
        sessions.push(sessionData);
      }
      
      await AsyncStorage.setItem('@eating_sessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
    }

    setIsActive(false);
    onComplete?.(sessionData);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseProgress = () => {
    let phaseStart = 0;
    let phaseEnd = 0;
    
    for (const [phase, config] of Object.entries(EATING_PHASES)) {
      phaseEnd = phaseStart + config.duration;
      if (phase === currentPhase) {
        const phaseElapsed = elapsedTime - phaseStart;
        return Math.min(phaseElapsed / config.duration, 1);
      }
      phaseStart = phaseEnd;
      if (elapsedTime < phaseEnd) break;
    }
    
    return 0;
  };

  const renderPhaseContent = () => {
    const phase = EATING_PHASES[currentPhase as keyof typeof EATING_PHASES];
    
    if (currentPhase === 'PREPARATION') {
      return (
        <View style={styles.phaseContent}>
          <Text style={styles.phaseTitle}>{t('eating.preparation.title')}</Text>
          <Text style={styles.phaseText}>{t('eating.preparation.steps')}</Text>
          <View style={styles.preparationList}>
            <Text style={styles.preparationItem}>• {t('eating.preparation.gratitude')}</Text>
            <Text style={styles.preparationItem}>• {t('eating.preparation.observe')}</Text>
            <Text style={styles.preparationItem}>• {t('eating.preparation.breathe')}</Text>
          </View>
        </View>
      );
    }

    if (currentPhase.includes('CHECK_IN')) {
      return (
        <View style={styles.phaseContent}>
          <Text style={styles.phaseTitle}>{t('eating.checkIn.title')}</Text>
          <Text style={styles.phaseText}>{t('eating.checkIn.howFull')}</Text>
          <View style={styles.fullnessScale}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => handleFullnessCheck(level)}
                style={[
                  styles.fullnessOption,
                  fullnessLevel === level && styles.fullnessSelected,
                ]}
              >
                <Text style={styles.fullnessNumber}>{level}</Text>
                <Text style={styles.fullnessLabel}>
                  {t(`eating.fullness.level${level}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.phaseContent}>
        <Animated.Text style={[styles.tipText, { opacity: tipOpacity }]}>
          {t(MINDFUL_TIPS[currentTip])}
        </Animated.Text>
        
        <TouchableOpacity
          onPress={handleBite}
          style={styles.biteButton}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.biteButtonInner,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Text style={styles.biteIcon}>🍴</Text>
            <Text style={styles.biteText}>{t('eating.recordBite')}</Text>
          </Animated.View>
        </TouchableOpacity>
        
        <Text style={styles.biteCount}>
          {t('eating.bites', { count: biteCount })}
        </Text>
      </View>
    );
  };

  if (!isActive) {
    return (
      <Card style={styles.startCard}>
        <LinearGradient
          colors={['#4CAF50', '#66BB6A']}
          style={styles.startGradient}
        >
          <Text style={styles.mealName}>{mealName}</Text>
          {intention?.mindfulEating && (
            <View style={styles.intentionBadge}>
              <IconButton
                icon="meditation"
                size={20}
                iconColor="white"
              />
              <Text style={styles.intentionText}>
                {t('eating.mindfulMode')}
              </Text>
            </View>
          )}
          <Button
            mode="contained"
            onPress={handleStart}
            style={styles.startButton}
            labelStyle={styles.startButtonLabel}
          >
            {t('eating.startMindfulMeal')}
          </Button>
        </LinearGradient>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mealTitle}>{mealName}</Text>
        <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
      </View>

      <ProgressBar
        progress={getPhaseProgress()}
        color={colors.primary}
        style={styles.progressBar}
      />

      <View style={styles.phaseIndicator}>
        <Text style={styles.phaseName}>
          {t(`eating.phases.${phase?.name || 'eating'}`)}
        </Text>
      </View>

      {renderPhaseContent()}

      <View style={styles.controls}>
        {!currentPhase.includes('CHECK_IN') && (
          <IconButton
            icon={isPaused ? 'play' : 'pause'}
            size={32}
            onPress={handlePause}
            style={styles.controlButton}
          />
        )}
        <IconButton
          icon="stop"
          size={32}
          onPress={() => {
            setIsActive(false);
            onCancel?.();
          }}
          style={styles.controlButton}
        />
        {currentPhase === 'REFLECTION' && (
          <Button
            mode="contained"
            onPress={handleComplete}
            style={styles.completeButton}
          >
            {t('eating.complete')}
          </Button>
        )}
      </View>

      {intention?.portionAwareness && fullnessLevel >= 3 && (
        <View style={styles.portionAlert}>
          <IconButton
            icon="information"
            size={20}
            iconColor="#FF9800"
          />
          <Text style={styles.portionText}>
            {t('eating.portionReminder')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  startCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  startGradient: {
    padding: 32,
    alignItems: 'center',
  },
  mealName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  intentionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  intentionText: {
    color: 'white',
    marginLeft: -8,
  },
  startButton: {
    backgroundColor: 'white',
    paddingHorizontal: 32,
  },
  startButtonLabel: {
    color: '#4CAF50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  phaseIndicator: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 32,
  },
  phaseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  phaseContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  phaseText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  preparationList: {
    alignItems: 'flex-start',
  },
  preparationItem: {
    fontSize: 16,
    marginVertical: 8,
    color: '#555',
  },
  tipText: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 48,
    fontStyle: 'italic',
    color: '#555',
  },
  biteButton: {
    marginBottom: 24,
  },
  biteButtonInner: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 24,
    paddingHorizontal: 48,
    borderRadius: 100,
    alignItems: 'center',
  },
  biteIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  biteText: {
    fontSize: 16,
    color: '#E65100',
  },
  biteCount: {
    fontSize: 14,
    color: '#666',
  },
  fullnessScale: {
    flexDirection: 'row',
    gap: 12,
  },
  fullnessOption: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    minWidth: 60,
  },
  fullnessSelected: {
    backgroundColor: '#C8E6C9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  fullnessNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fullnessLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 32,
  },
  controlButton: {
    backgroundColor: '#F5F5F5',
  },
  completeButton: {
    paddingHorizontal: 24,
  },
  portionAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  portionText: {
    flex: 1,
    fontSize: 14,
    color: '#E65100',
    marginLeft: -8,
  },
});

export default MindfulEatingTimer;