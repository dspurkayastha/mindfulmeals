import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../../hooks/useTranslation';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MilestoneService from '../../services/MilestoneService';

interface MoodWidgetProps {
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
}

export const MoodWidget: React.FC<MoodWidgetProps> = ({ 
  size = 'medium', 
  onPress 
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [lastMealTime, setLastMealTime] = useState<string>('');

  useEffect(() => {
    loadLatestMood();
  }, []);

  const loadLatestMood = async () => {
    try {
      const reflections = await AsyncStorage.getItem('@meal_reflections');
      if (reflections) {
        const parsed = JSON.parse(reflections);
        if (parsed.length > 0) {
          const latest = parsed[parsed.length - 1];
          setCurrentMood(latest.mood);
          const date = new Date(latest.timestamp);
          const hours = date.getHours();
          const minutes = date.getMinutes();
          setLastMealTime(`${hours}:${minutes.toString().padStart(2, '0')}`);
        }
      }
    } catch (error) {
      console.error('Error loading mood:', error);
    }
  };

  const getMoodEmoji = () => {
    switch (currentMood) {
      case 'energized': return '⚡';
      case 'satisfied': return '😊';
      case 'heavy': return '😴';
      case 'still_hungry': return '🍽️';
      default: return '💭';
    }
  };

  const getMoodColor = () => {
    switch (currentMood) {
      case 'energized': return ['#FFC107', '#FFD54F'];
      case 'satisfied': return ['#4CAF50', '#66BB6A'];
      case 'heavy': return ['#9E9E9E', '#BDBDBD'];
      case 'still_hungry': return ['#FF5722', '#FF7043'];
      default: return ['#E0E0E0', '#F5F5F5'];
    }
  };

  const widgetSize = size === 'small' ? 60 : size === 'large' ? 100 : 80;

  return (
    <TouchableOpacity
      onPress={onPress || (() => navigation.navigate('PostMealReflection'))}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getMoodColor()}
        style={[
          styles.moodWidget,
          {
            width: widgetSize,
            height: widgetSize,
            borderRadius: widgetSize / 2,
          },
        ]}
      >
        <Text style={[styles.moodEmoji, { fontSize: widgetSize * 0.4 }]}>
          {getMoodEmoji()}
        </Text>
        {size !== 'small' && currentMood && (
          <Text style={styles.moodTime}>{lastMealTime}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

interface EnergyMeterProps {
  compact?: boolean;
  onPress?: () => void;
}

export const EnergyMeter: React.FC<EnergyMeterProps> = ({ 
  compact = false,
  onPress 
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [energyLevel, setEnergyLevel] = useState(0);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadAverageEnergy();
  }, []);

  const loadAverageEnergy = async () => {
    try {
      const reflections = await AsyncStorage.getItem('@meal_reflections');
      if (reflections) {
        const parsed = JSON.parse(reflections);
        const today = new Date().toDateString();
        const todayReflections = parsed.filter((r: any) => 
          new Date(r.timestamp).toDateString() === today
        );
        
        if (todayReflections.length > 0) {
          const avgEnergy = todayReflections.reduce((sum: number, r: any) => 
            sum + r.energyLevel, 0
          ) / todayReflections.length;
          
          setEnergyLevel(avgEnergy);
          
          Animated.timing(animatedValue, {
            toValue: avgEnergy / 5,
            duration: 1000,
            useNativeDriver: false,
          }).start();
        }
      }
    } catch (error) {
      console.error('Error loading energy:', error);
    }
  };

  const getEnergyColor = () => {
    if (energyLevel >= 4) return '#4CAF50';
    if (energyLevel >= 3) return '#FFC107';
    return '#FF5722';
  };

  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.energyCompact}>
        <IconButton
          icon="lightning-bolt"
          size={20}
          iconColor={getEnergyColor()}
        />
        <Text style={[styles.energyValue, { color: getEnergyColor() }]}>
          {energyLevel.toFixed(1)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.energyWidget}>
      <View style={styles.energyHeader}>
        <IconButton
          icon="lightning-bolt"
          size={24}
          iconColor={getEnergyColor()}
        />
        <Text style={styles.energyLabel}>{t('widgets.todayEnergy')}</Text>
      </View>
      
      <View style={styles.energyBarContainer}>
        <View style={styles.energyBarBackground}>
          <Animated.View
            style={[
              styles.energyBar,
              {
                backgroundColor: getEnergyColor(),
                width: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.energyText}>{energyLevel.toFixed(1)}/5</Text>
      </View>
    </TouchableOpacity>
  );
};

interface GratitudeCounterProps {
  variant?: 'circle' | 'card';
  onPress?: () => void;
}

export const GratitudeCounter: React.FC<GratitudeCounterProps> = ({
  variant = 'circle',
  onPress
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [count, setCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadGratitudeCount();
    
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const loadGratitudeCount = async () => {
    const counts = await MilestoneService.getCounts();
    setCount(counts.gratitudeEntries);
    setStreak(counts.gratitudeStreak);
  };

  if (variant === 'card') {
    return (
      <TouchableOpacity
        onPress={onPress || (() => navigation.navigate('GratitudeJournal'))}
        style={styles.gratitudeCard}
      >
        <LinearGradient
          colors={['#E91E63', '#F06292']}
          style={styles.gratitudeGradient}
        >
          <IconButton
            icon="heart"
            size={32}
            iconColor="white"
          />
          <View style={styles.gratitudeContent}>
            <Text style={styles.gratitudeCount}>{count}</Text>
            <Text style={styles.gratitudeLabel}>{t('widgets.gratitudes')}</Text>
            {streak > 0 && (
              <Text style={styles.gratitudeStreak}>
                {t('widgets.streak', { days: streak })}
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress || (() => navigation.navigate('GratitudeJournal'))}
    >
      <Animated.View
        style={[
          styles.gratitudeCircle,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#E91E63', '#F06292']}
          style={styles.gratitudeCircleGradient}
        >
          <Text style={styles.gratitudeCircleCount}>{count}</Text>
          <IconButton
            icon="heart"
            size={16}
            iconColor="white"
            style={styles.gratitudeCircleIcon}
          />
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

interface BreathingStreakProps {
  mini?: boolean;
  onPress?: () => void;
}

export const BreathingStreak: React.FC<BreathingStreakProps> = ({
  mini = false,
  onPress
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [streak, setStreak] = useState(0);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    loadBreathingData();
  }, []);

  const loadBreathingData = async () => {
    const counts = await MilestoneService.getCounts();
    setStreak(counts.breathingStreak);
    setSessions(counts.breathingSessions);
  };

  if (mini) {
    return (
      <TouchableOpacity
        onPress={onPress || (() => navigation.navigate('BreathingExercise'))}
        style={styles.breathingMini}
      >
        <Text style={styles.breathingMiniIcon}>🧘</Text>
        <Text style={styles.breathingMiniText}>{streak}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress || (() => navigation.navigate('BreathingExercise'))}
      style={styles.breathingWidget}
    >
      <LinearGradient
        colors={['#00BCD4', '#4DD0E1']}
        style={styles.breathingGradient}
      >
        <View style={styles.breathingHeader}>
          <Text style={styles.breathingIcon}>🧘</Text>
          <Text style={styles.breathingTitle}>{t('widgets.breathing')}</Text>
        </View>
        <View style={styles.breathingStats}>
          <View style={styles.breathingStat}>
            <Text style={styles.breathingValue}>{streak}</Text>
            <Text style={styles.breathingLabel}>{t('widgets.dayStreak')}</Text>
          </View>
          <View style={styles.breathingDivider} />
          <View style={styles.breathingStat}>
            <Text style={styles.breathingValue}>{sessions}</Text>
            <Text style={styles.breathingLabel}>{t('widgets.sessions')}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Mood Widget
  moodWidget: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  moodEmoji: {
    marginBottom: 4,
  },
  moodTime: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },

  // Energy Meter
  energyWidget: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  energyCompact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  energyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  energyLabel: {
    fontSize: 14,
    marginLeft: -8,
  },
  energyValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  energyBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  energyBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  energyBar: {
    height: '100%',
    borderRadius: 4,
  },
  energyText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Gratitude Counter
  gratitudeCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  gratitudeGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gratitudeContent: {
    marginLeft: 12,
  },
  gratitudeCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  gratitudeLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  gratitudeStreak: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  gratitudeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 3,
  },
  gratitudeCircleGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gratitudeCircleCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  gratitudeCircleIcon: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    margin: 0,
  },

  // Breathing Streak
  breathingWidget: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  breathingGradient: {
    padding: 16,
  },
  breathingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  breathingIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  breathingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  breathingStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breathingStat: {
    flex: 1,
    alignItems: 'center',
  },
  breathingValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  breathingLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  breathingDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  breathingMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  breathingMiniIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  breathingMiniText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00ACC1',
  },
});

export default {
  MoodWidget,
  EnergyMeter,
  GratitudeCounter,
  BreathingStreak,
};