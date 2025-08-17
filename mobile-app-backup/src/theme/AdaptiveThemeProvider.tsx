import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  MD3LightTheme,
  MD3DarkTheme,
  configureFonts,
  Provider as PaperProvider,
} from 'react-native-paper';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StressDetectionService from '../services/StressDetectionService';
import WellnessService from '../services/WellnessService';

type MoodState = 'default' | 'stressed' | 'grateful' | 'energized' | 'calm';

interface AdaptiveThemeContextType {
  mood: MoodState;
  setMood: (mood: MoodState) => void;
  isDark: boolean;
  toggleTheme: () => void;
  currentTheme: any;
}

const AdaptiveThemeContext = createContext<AdaptiveThemeContextType | undefined>(undefined);

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Nunito-Regular',
      fontWeight: 'normal' as const,
    },
    medium: {
      fontFamily: 'Nunito-Medium',
      fontWeight: 'normal' as const,
    },
    light: {
      fontFamily: 'Nunito-Light',
      fontWeight: 'normal' as const,
    },
    thin: {
      fontFamily: 'Nunito-Light',
      fontWeight: 'normal' as const,
    },
  },
  ios: {
    regular: {
      fontFamily: 'Nunito-Regular',
      fontWeight: 'normal' as const,
    },
    medium: {
      fontFamily: 'Nunito-Medium',
      fontWeight: 'normal' as const,
    },
    light: {
      fontFamily: 'Nunito-Light',
      fontWeight: 'normal' as const,
    },
    thin: {
      fontFamily: 'Nunito-Light',
      fontWeight: 'normal' as const,
    },
  },
  android: {
    regular: {
      fontFamily: 'Nunito-Regular',
      fontWeight: 'normal' as const,
    },
    medium: {
      fontFamily: 'Nunito-Medium',
      fontWeight: 'normal' as const,
    },
    light: {
      fontFamily: 'Nunito-Light',
      fontWeight: 'normal' as const,
    },
    thin: {
      fontFamily: 'Nunito-Light',
      fontWeight: 'normal' as const,
    },
  },
};

// Mood-based color palettes
const moodPalettes = {
  default: {
    light: {
      primary: '#4CAF50',
      secondary: '#81C784',
      tertiary: '#A5D6A7',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      surfaceVariant: '#E8F5E9',
      error: '#F44336',
      onPrimary: '#FFFFFF',
      onSecondary: '#000000',
      onBackground: '#000000',
      onSurface: '#000000',
      onError: '#FFFFFF',
    },
    dark: {
      primary: '#66BB6A',
      secondary: '#81C784',
      tertiary: '#A5D6A7',
      background: '#121212',
      surface: '#1E1E1E',
      surfaceVariant: '#2E7D32',
      error: '#CF6679',
      onPrimary: '#000000',
      onSecondary: '#000000',
      onBackground: '#FFFFFF',
      onSurface: '#FFFFFF',
      onError: '#000000',
    },
  },
  stressed: {
    light: {
      primary: '#64B5F6',
      secondary: '#90CAF9',
      tertiary: '#BBDEFB',
      background: '#F5F5F5',
      surface: '#FFFFFF',
      surfaceVariant: '#E3F2FD',
      error: '#FF9800',
      onPrimary: '#FFFFFF',
      onSecondary: '#000000',
      onBackground: '#000000',
      onSurface: '#000000',
      onError: '#FFFFFF',
    },
    dark: {
      primary: '#42A5F5',
      secondary: '#64B5F6',
      tertiary: '#90CAF9',
      background: '#0D1117',
      surface: '#161B22',
      surfaceVariant: '#1565C0',
      error: '#FFB74D',
      onPrimary: '#000000',
      onSecondary: '#000000',
      onBackground: '#FFFFFF',
      onSurface: '#FFFFFF',
      onError: '#000000',
    },
  },
  grateful: {
    light: {
      primary: '#F06292',
      secondary: '#F48FB1',
      tertiary: '#F8BBD0',
      background: '#FFF0F5',
      surface: '#FFFFFF',
      surfaceVariant: '#FCE4EC',
      error: '#D32F2F',
      onPrimary: '#FFFFFF',
      onSecondary: '#000000',
      onBackground: '#000000',
      onSurface: '#000000',
      onError: '#FFFFFF',
    },
    dark: {
      primary: '#EC407A',
      secondary: '#F06292',
      tertiary: '#F48FB1',
      background: '#1A0E14',
      surface: '#2D1B24',
      surfaceVariant: '#C2185B',
      error: '#F44336',
      onPrimary: '#000000',
      onSecondary: '#000000',
      onBackground: '#FFFFFF',
      onSurface: '#FFFFFF',
      onError: '#000000',
    },
  },
  energized: {
    light: {
      primary: '#FFB300',
      secondary: '#FFCA28',
      tertiary: '#FFE082',
      background: '#FFFEF7',
      surface: '#FFFFFF',
      surfaceVariant: '#FFF8E1',
      error: '#D32F2F',
      onPrimary: '#000000',
      onSecondary: '#000000',
      onBackground: '#000000',
      onSurface: '#000000',
      onError: '#FFFFFF',
    },
    dark: {
      primary: '#FFA000',
      secondary: '#FFB300',
      tertiary: '#FFCA28',
      background: '#1A1500',
      surface: '#2D2600',
      surfaceVariant: '#F57C00',
      error: '#F44336',
      onPrimary: '#000000',
      onSecondary: '#000000',
      onBackground: '#FFFFFF',
      onSurface: '#FFFFFF',
      onError: '#000000',
    },
  },
  calm: {
    light: {
      primary: '#4DD0E1',
      secondary: '#80DEEA',
      tertiary: '#B2EBF2',
      background: '#F0FFFE',
      surface: '#FFFFFF',
      surfaceVariant: '#E0F7FA',
      error: '#E57373',
      onPrimary: '#000000',
      onSecondary: '#000000',
      onBackground: '#000000',
      onSurface: '#000000',
      onError: '#FFFFFF',
    },
    dark: {
      primary: '#26C6DA',
      secondary: '#4DD0E1',
      tertiary: '#80DEEA',
      background: '#001A1C',
      surface: '#00282D',
      surfaceVariant: '#00838F',
      error: '#EF5350',
      onPrimary: '#000000',
      onSecondary: '#000000',
      onBackground: '#FFFFFF',
      onSurface: '#FFFFFF',
      onError: '#000000',
    },
  },
};

interface AdaptiveThemeProviderProps {
  children: ReactNode;
}

export const AdaptiveThemeProvider: React.FC<AdaptiveThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [mood, setMood] = useState<MoodState>('default');
  const [stressLevel, setStressLevel] = useState(0);

  useEffect(() => {
    loadThemePreferences();
    const unsubscribeStress = subscribeToStressChanges();
    
    // Sync with wellness mood initially and periodically
    syncWithWellnessMood();
    const moodSyncInterval = setInterval(() => {
      syncWithWellnessMood();
    }, 60000); // Check every minute
    
    return () => {
      unsubscribeStress();
      clearInterval(moodSyncInterval);
    };
  }, []);

  useEffect(() => {
    // Auto-adjust mood based on stress level
    if (stressLevel > 0.7) {
      setMood('stressed');
    } else if (stressLevel < 0.3) {
      const hour = new Date().getHours();
      if (hour >= 20 || hour < 6) {
        setMood('calm');
      } else if (hour >= 6 && hour < 10) {
        setMood('energized');
      }
    }
  }, [stressLevel]);

  const loadThemePreferences = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme_preference');
      const savedMood = await AsyncStorage.getItem('@mood_preference');
      
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
      if (savedMood) {
        setMood(savedMood as MoodState);
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    }
  };

  const subscribeToStressChanges = () => {
    // Subscribe to stress level changes
    const checkStress = setInterval(() => {
      const currentStress = StressDetectionService.getCurrentStressLevel();
      setStressLevel(currentStress);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkStress);
  };

  const syncWithWellnessMood = () => {
    // Sync with wellness service mood data
    const recentMood = WellnessService.getInstance().getRecentMood();
    if (recentMood && recentMood !== 'neutral') {
      setMood(recentMood as MoodState);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await AsyncStorage.setItem('@theme_preference', newTheme ? 'dark' : 'light');
  };

  const updateMood = async (newMood: MoodState) => {
    setMood(newMood);
    await AsyncStorage.setItem('@mood_preference', newMood);
  };

  const getTheme = () => {
    const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
    const moodColors = moodPalettes[mood][isDark ? 'dark' : 'light'];

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        ...moodColors,
        // Additional semantic colors
        success: '#4CAF50',
        warning: '#FF9800',
        info: '#2196F3',
        // Mindfulness-specific colors
        mindful: mood === 'calm' ? '#4DD0E1' : '#81C784',
        breath: '#87CEEB',
        gratitude: '#F06292',
        energy: '#FFB300',
      },
      fonts: configureFonts({ config: fontConfig }),
      // Custom properties
      roundness: mood === 'stressed' ? 12 : 8,
      animation: {
        scale: mood === 'stressed' ? 0.98 : 1.0,
        duration: mood === 'calm' ? 400 : 300,
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
      },
      typography: {
        ...baseTheme.fonts,
        mindful: {
          fontFamily: 'Nunito-Light',
          fontSize: 16,
          lineHeight: 24,
          letterSpacing: 0.5,
        },
      },
    };
  };

  const currentTheme = getTheme();

  return (
    <AdaptiveThemeContext.Provider
      value={{
        mood,
        setMood: updateMood,
        isDark,
        toggleTheme,
        currentTheme,
      }}
    >
      <PaperProvider theme={currentTheme}>
        {children}
      </PaperProvider>
    </AdaptiveThemeContext.Provider>
  );
};

export const useAdaptiveTheme = () => {
  const context = useContext(AdaptiveThemeContext);
  if (!context) {
    throw new Error('useAdaptiveTheme must be used within AdaptiveThemeProvider');
  }
  return context;
};

// Utility hook for mood-based styling
export const useMoodStyles = () => {
  const { mood, currentTheme } = useAdaptiveTheme();

  return {
    getMoodGradient: () => {
      switch (mood) {
        case 'stressed':
          return ['#E3F2FD', '#BBDEFB'];
        case 'grateful':
          return ['#FCE4EC', '#F8BBD0'];
        case 'energized':
          return ['#FFF8E1', '#FFE082'];
        case 'calm':
          return ['#E0F7FA', '#B2EBF2'];
        default:
          return ['#E8F5E9', '#C8E6C9'];
      }
    },
    getMoodEmoji: () => {
      switch (mood) {
        case 'stressed':
          return '😰';
        case 'grateful':
          return '🙏';
        case 'energized':
          return '⚡';
        case 'calm':
          return '😌';
        default:
          return '🌱';
      }
    },
    getBreathingDuration: () => {
      return mood === 'stressed' ? 5000 : mood === 'calm' ? 6000 : 4000;
    },
    getHapticPattern: () => {
      switch (mood) {
        case 'stressed':
          return 'impactLight';
        case 'grateful':
          return 'notificationSuccess';
        case 'energized':
          return 'impactMedium';
        case 'calm':
          return 'selection';
        default:
          return 'impactLight';
      }
    },
  };
};