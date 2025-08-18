import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Surface,
  IconButton,
  useTheme,
  Chip,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTranslation } from '../../hooks/useTranslation';
import StressDetectionService from '../../services/StressDetectionService';
import { useAdaptiveTheme, useMoodStyles } from '../../theme/AdaptiveThemeProvider';
import * as Haptics from 'expo-haptics';

interface Suggestion {
  id: string;
  type: 'breathe' | 'slowdown' | 'appreciate' | 'hydrate' | 'stretch' | 'rest';
  message: string;
  icon: string;
  action?: () => void;
  duration?: number;
}

interface DynamicSuggestionsProps {
  context?: 'pantry' | 'meal-planning' | 'cooking' | 'shopping' | 'general';
  position?: 'top' | 'bottom' | 'floating';
  onDismiss?: () => void;
}

const contextualSuggestions: Record<string, Suggestion[]> = {
  pantry: [
    {
      id: 'pantry-breathe',
      type: 'breathe',
      message: 'Take a breath while organizing',
      icon: '🌬️',
    },
    {
      id: 'pantry-appreciate',
      type: 'appreciate',
      message: 'Notice the abundance in your pantry',
      icon: '🙏',
    },
  ],
  'meal-planning': [
    {
      id: 'meal-slowdown',
      type: 'slowdown',
      message: 'No rush. Plan mindfully',
      icon: '🐌',
    },
    {
      id: 'meal-hydrate',
      type: 'hydrate',
      message: 'Sip some water while planning',
      icon: '💧',
    },
  ],
  cooking: [
    {
      id: 'cook-breathe',
      type: 'breathe',
      message: 'Sync your breath with stirring',
      icon: '🥄',
    },
    {
      id: 'cook-appreciate',
      type: 'appreciate',
      message: 'Smell the aromas mindfully',
      icon: '👃',
    },
  ],
  shopping: [
    {
      id: 'shop-slowdown',
      type: 'slowdown',
      message: 'Shop slowly, choose wisely',
      icon: '🛒',
    },
    {
      id: 'shop-stretch',
      type: 'stretch',
      message: 'Stretch between aisles',
      icon: '🙆',
    },
  ],
  general: [
    {
      id: 'general-rest',
      type: 'rest',
      message: 'Your eyes need a break',
      icon: '👁️',
    },
    {
      id: 'general-hydrate',
      type: 'hydrate',
      message: 'Time for a mindful water break',
      icon: '🥤',
    },
  ],
};

const stressBasedSuggestions: Suggestion[] = [
  {
    id: 'stress-breathe-1',
    type: 'breathe',
    message: 'You seem rushed. Let\'s breathe together',
    icon: '😮‍💨',
  },
  {
    id: 'stress-slowdown-1',
    type: 'slowdown',
    message: 'Slow down, friend. There\'s no hurry',
    icon: '🤗',
  },
  {
    id: 'stress-rest-1',
    type: 'rest',
    message: 'Your body is asking for a pause',
    icon: '✋',
  },
];

const timeBasedSuggestions: Record<string, Suggestion[]> = {
  morning: [
    {
      id: 'morning-hydrate',
      type: 'hydrate',
      message: 'Start your day with water',
      icon: '🌅',
    },
  ],
  afternoon: [
    {
      id: 'afternoon-stretch',
      type: 'stretch',
      message: 'Afternoon stretch time',
      icon: '🌞',
    },
  ],
  evening: [
    {
      id: 'evening-slowdown',
      type: 'slowdown',
      message: 'Wind down for the evening',
      icon: '🌙',
    },
  ],
};

export const DynamicSuggestions: React.FC<DynamicSuggestionsProps> = ({
  context = 'general',
  position = 'top',
  onDismiss,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { mood } = useAdaptiveTheme();
  const moodStyles = useMoodStyles();
  
  const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      selectSuggestion();
    }, 3000); // Show after 3 seconds
    
    return () => clearTimeout(timer);
  }, [context]);
  
  useEffect(() => {
    if (currentSuggestion && !hasInteracted) {
      showSuggestion();
      
      // Auto-hide after duration
      const hideTimer = setTimeout(() => {
        hideSuggestion();
      }, currentSuggestion.duration || 8000);
      
      return () => clearTimeout(hideTimer);
    }
  }, [currentSuggestion]);
  
  const selectSuggestion = () => {
    const stressLevel = StressDetectionService.getCurrentStressLevel();
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    
    let suggestions: Suggestion[] = [];
    
    // Priority 1: Stress-based suggestions
    if (stressLevel > 0.6) {
      suggestions = stressBasedSuggestions;
    } 
    // Priority 2: Context-based suggestions
    else if (contextualSuggestions[context]) {
      suggestions = contextualSuggestions[context];
    }
    // Priority 3: Time-based suggestions
    else if (timeBasedSuggestions[timeOfDay]) {
      suggestions = timeBasedSuggestions[timeOfDay];
    }
    
    // Add mood-based modifications
    if (mood === 'stressed' && suggestions.length > 0) {
      suggestions = suggestions.map(s => ({
        ...s,
        message: s.message + ' 💙',
      }));
    }
    
    if (suggestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * suggestions.length);
      setCurrentSuggestion(suggestions[randomIndex]);
    }
  };
  
  const showSuggestion = () => {
    setIsVisible(true);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
    
    HapticFeedback.trigger('impactLight');
  };
  
  const hideSuggestion = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? -50 : 50,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      onDismiss?.();
    });
  };
  
  const handleInteraction = () => {
    setHasInteracted(true);
    HapticFeedback.trigger(moodStyles.getHapticPattern());
    
    if (currentSuggestion?.action) {
      currentSuggestion.action();
    }
    
    // Show appreciation
    setTimeout(() => {
      hideSuggestion();
    }, 1000);
  };
  
  const handleDismiss = () => {
    setHasInteracted(true);
    hideSuggestion();
  };
  
  if (!isVisible || !currentSuggestion) {
    return null;
  }
  
  const gradient = moodStyles.getMoodGradient();
  
  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' && styles.containerTop,
        position === 'bottom' && styles.containerBottom,
        position === 'floating' && styles.containerFloating,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleInteraction}
        style={styles.touchable}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <Text style={styles.icon}>{currentSuggestion.icon}</Text>
            
            <View style={styles.textContainer}>
              <Text style={styles.message}>{currentSuggestion.message}</Text>
              
              <View style={styles.chips}>
                <Chip
                  compact
                  mode="flat"
                  style={[styles.typeChip, { backgroundColor: colors.surface }]}
                >
                  {currentSuggestion.type}
                </Chip>
                {mood !== 'default' && (
                  <Chip
                    compact
                    mode="flat"
                    style={[styles.moodChip, { backgroundColor: colors.surface }]}
                  >
                    {moodStyles.getMoodEmoji()}
                  </Chip>
                )}
              </View>
            </View>
            
            <IconButton
              icon="close"
              size={20}
              onPress={handleDismiss}
              style={styles.closeButton}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Floating button variant for persistent suggestions
export const FloatingSuggestionButton: React.FC<{
  onPress?: () => void;
}> = ({ onPress }) => {
  const { colors } = useTheme();
  const moodStyles = useMoodStyles();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Continuous pulse animation
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
  
  const handlePress = () => {
    setIsAnimating(true);
    
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsAnimating(false);
      rotateAnim.setValue(0);
    });
    
    HapticFeedback.trigger('impactLight');
    onPress?.();
  };
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.floatingButton}
    >
      <Animated.View
        style={[
          styles.floatingButtonInner,
          {
            transform: [
              { scale: pulseAnim },
              { rotate: spin },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={moodStyles.getMoodGradient()}
          style={styles.floatingGradient}
        >
          <Text style={styles.floatingIcon}>
            {moodStyles.getMoodEmoji()}
          </Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  containerTop: {
    top: 100,
  },
  containerBottom: {
    bottom: 100,
  },
  containerFloating: {
    top: '40%',
  },
  touchable: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  gradient: {
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 6,
  },
  chips: {
    flexDirection: 'row',
    gap: 6,
  },
  typeChip: {
    height: 22,
  },
  moodChip: {
    height: 22,
  },
  closeButton: {
    margin: -8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 999,
  },
  floatingButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  floatingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingIcon: {
    fontSize: 24,
  },
});

export default DynamicSuggestions;