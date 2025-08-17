# Week 2 Technical Implementation Guide 🛠️

## Day 4: Mindfulness Flow Integration - Detailed Steps

### Task 1: Connect FloatingBreatherButton to Breathing Exercises

#### Step 1: Check Current PantryScreen Implementation
First, let's examine the current implementation of PantryScreen and FloatingBreatherButton.

```tsx
// mobile-app/src/screens/pantry/PantryScreen.tsx
// Current state likely has:
<FloatingBreatherButton onPress={() => console.log('Pressed')} />
```

#### Step 2: Update Navigation Types
```tsx
// mobile-app/src/navigation/types.ts
export type RootStackParamList = {
  // ... existing screens
  BreathingExercise: {
    context: 'pantry' | 'meal' | 'shopping' | 'cooking';
    returnScreen: string;
    duration?: number;
  };
};
```

#### Step 3: Implement Navigation in PantryScreen
```tsx
// mobile-app/src/screens/pantry/PantryScreen.tsx
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FloatingBreatherButton } from '@/components/mindfulness';
import { RootStackParamList } from '@/navigation/types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Pantry'>;

export const PantryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  const handleBreathingPress = () => {
    // Navigate with context
    navigation.navigate('BreathingExercise', {
      context: 'pantry',
      returnScreen: 'Pantry',
      duration: 3 // Default 3 minutes for pantry context
    });
  };
  
  return (
    <View style={styles.container}>
      {/* ... existing pantry content ... */}
      
      <FloatingBreatherButton 
        onPress={handleBreathingPress}
        testID="pantry-breather-button"
      />
    </View>
  );
};
```

#### Step 4: Ensure BreathingExerciseScreen Handles Context
```tsx
// mobile-app/src/screens/wellness/BreathingExerciseScreen.tsx
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/types';

type BreathingRouteProp = RouteProp<RootStackParamList, 'BreathingExercise'>;

export const BreathingExerciseScreen: React.FC = () => {
  const route = useRoute<BreathingRouteProp>();
  const navigation = useNavigation();
  const { context, returnScreen, duration = 5 } = route.params;
  
  // Customize breathing exercise based on context
  const getContextualMessage = () => {
    switch (context) {
      case 'pantry':
        return "Let's take a mindful moment before planning your meals";
      case 'meal':
        return "Prepare your mind and body for mindful eating";
      case 'shopping':
        return "Center yourself before making mindful food choices";
      case 'cooking':
        return "Find your calm before creating nourishing meals";
      default:
        return "Take a moment to breathe and center yourself";
    }
  };
  
  const handleComplete = () => {
    // Navigate back to the return screen
    navigation.navigate(returnScreen as any);
  };
  
  return (
    <BreathingExercise
      duration={duration}
      message={getContextualMessage()}
      onComplete={handleComplete}
    />
  );
};
```

### Task 2: Integrate Gratitude Overlays with Meal Completion

#### Step 1: Update CookingScreen with Gratitude Flow
```tsx
// mobile-app/src/screens/recipes/CookingScreen.tsx
import React, { useState } from 'react';
import { GratitudeOverlay } from '@/components/mindfulness';
import { WellnessService } from '@/services/WellnessService';
import { useNavigation } from '@react-navigation/native';

export const CookingScreen: React.FC = () => {
  const [showGratitude, setShowGratitude] = useState(false);
  const [currentMealId, setCurrentMealId] = useState<string | null>(null);
  const navigation = useNavigation();
  
  const handleCookingComplete = async (mealData: MealData) => {
    try {
      // Save meal data first
      const mealId = await MealService.saveMeal(mealData);
      setCurrentMealId(mealId);
      
      // Show gratitude overlay
      setShowGratitude(true);
    } catch (error) {
      console.error('Error completing meal:', error);
    }
  };
  
  const handleGratitudeSave = async (gratitudeEntry: GratitudeEntry) => {
    try {
      // Save gratitude entry linked to meal
      await WellnessService.getInstance().saveGratitudeEntry({
        ...gratitudeEntry,
        mealId: currentMealId,
        context: 'post-cooking',
        timestamp: new Date().toISOString()
      });
      
      // Close overlay and navigate to reflection
      setShowGratitude(false);
      
      // Schedule post-meal reflection notification
      await NotificationService.getInstance().schedulePostMealReflection(
        currentMealId!,
        30 // 30 minutes later
      );
      
      // Navigate to post-meal reflection
      navigation.navigate('PostMealReflection', { 
        mealId: currentMealId!,
        fromScreen: 'Cooking'
      });
    } catch (error) {
      console.error('Error saving gratitude:', error);
    }
  };
  
  const handleGratitudeSkip = () => {
    setShowGratitude(false);
    // Still navigate to reflection but without gratitude
    navigation.navigate('PostMealReflection', { 
      mealId: currentMealId!,
      fromScreen: 'Cooking',
      skippedGratitude: true
    });
  };
  
  return (
    <View style={styles.container}>
      {/* ... existing cooking UI ... */}
      
      <GratitudeOverlay
        visible={showGratitude}
        onSave={handleGratitudeSave}
        onSkip={handleGratitudeSkip}
        onClose={() => setShowGratitude(false)}
        prompt="What are you grateful for in this cooking experience?"
        suggestions={[
          "The fresh ingredients",
          "Time to cook mindfully",
          "Nourishing my body",
          "Sharing with loved ones"
        ]}
      />
    </View>
  );
};
```

#### Step 2: Create GratitudeEntry Type
```tsx
// mobile-app/src/types/wellness.ts
export interface GratitudeEntry {
  id: string;
  text: string;
  mealId?: string;
  context: 'post-cooking' | 'post-meal' | 'daily' | 'spontaneous';
  timestamp: string;
  mood?: 'grateful' | 'peaceful' | 'joyful' | 'content';
  tags?: string[];
}
```

#### Step 3: Update WellnessService
```tsx
// mobile-app/src/services/WellnessService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GratitudeEntry } from '@/types/wellness';

export class WellnessService {
  private static instance: WellnessService;
  private readonly GRATITUDE_KEY = '@wellness_gratitude_entries';
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new WellnessService();
    }
    return this.instance;
  }
  
  async saveGratitudeEntry(entry: GratitudeEntry): Promise<void> {
    try {
      // Get existing entries
      const existingEntries = await this.getGratitudeEntries();
      
      // Add new entry with generated ID
      const newEntry = {
        ...entry,
        id: entry.id || `gratitude_${Date.now()}`
      };
      
      // Save updated entries
      const updatedEntries = [...existingEntries, newEntry];
      await AsyncStorage.setItem(
        this.GRATITUDE_KEY, 
        JSON.stringify(updatedEntries)
      );
      
      // Update wellness analytics
      await this.updateWellnessAnalytics('gratitude_entry', newEntry);
      
      // Check for milestones
      await MilestoneService.getInstance().checkGratitudeMilestone(
        updatedEntries.length
      );
    } catch (error) {
      console.error('Error saving gratitude entry:', error);
      throw error;
    }
  }
  
  async getGratitudeEntries(): Promise<GratitudeEntry[]> {
    try {
      const data = await AsyncStorage.getItem(this.GRATITUDE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting gratitude entries:', error);
      return [];
    }
  }
  
  async getGratitudeEntriesForMeal(mealId: string): Promise<GratitudeEntry[]> {
    const allEntries = await this.getGratitudeEntries();
    return allEntries.filter(entry => entry.mealId === mealId);
  }
}
```

### Task 3: Wire Mindful Eating Timer to Meal Screens

#### Step 1: Update RecipeDetailScreen
```tsx
// mobile-app/src/screens/recipes/RecipeDetailScreen.tsx
import React, { useState } from 'react';
import { MindfulEatingTimer } from '@/components/mindfulness';
import { HapticFeedback } from '@/utils/haptic';

export const RecipeDetailScreen: React.FC = () => {
  const [showEatingTimer, setShowEatingTimer] = useState(false);
  const [mealStartTime, setMealStartTime] = useState<Date | null>(null);
  
  const handleStartEating = () => {
    setMealStartTime(new Date());
    setShowEatingTimer(true);
    HapticFeedback.impact('medium');
  };
  
  const handleTimerMilestone = (milestone: number) => {
    // Haptic feedback for milestones (25%, 50%, 75%, 100%)
    HapticFeedback.impact('light');
    
    // Optional: Show encouraging message
    if (milestone === 50) {
      Toast.show({
        text: "Halfway through! How's the meal tasting?",
        type: 'info'
      });
    }
  };
  
  const handleTimerComplete = async (duration: number) => {
    HapticFeedback.notification('success');
    
    // Track mindful eating session
    await WellnessService.getInstance().trackMindfulEating({
      recipeId: recipe.id,
      duration,
      startTime: mealStartTime!,
      endTime: new Date(),
      completed: true
    });
    
    // Navigate to post-meal reflection
    navigation.navigate('PostMealReflection', {
      mealId: recipe.id,
      eatingDuration: duration,
      wasMindful: true
    });
  };
  
  const handleTimerSkip = async () => {
    // Track partial session
    if (mealStartTime) {
      const duration = Date.now() - mealStartTime.getTime();
      await WellnessService.getInstance().trackMindfulEating({
        recipeId: recipe.id,
        duration: duration / 1000, // Convert to seconds
        startTime: mealStartTime,
        endTime: new Date(),
        completed: false,
        skipped: true
      });
    }
    
    setShowEatingTimer(false);
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* ... recipe details ... */}
      
      <TouchableOpacity
        style={styles.startEatingButton}
        onPress={handleStartEating}
      >
        <Icon name="restaurant" size={24} color="#fff" />
        <Text style={styles.buttonText}>Start Mindful Eating</Text>
      </TouchableOpacity>
      
      {showEatingTimer && (
        <MindfulEatingTimer
          recipeName={recipe.name}
          suggestedDuration={recipe.mindfulEatingDuration || 20}
          onMilestone={handleTimerMilestone}
          onComplete={handleTimerComplete}
          onSkip={handleTimerSkip}
          showTips={true}
          tips={[
            "Take a moment to appreciate the colors and aromas",
            "Chew slowly and savor each bite",
            "Put your utensils down between bites",
            "Notice the textures and flavors"
          ]}
        />
      )}
    </ScrollView>
  );
};
```

#### Step 2: Create MindfulEatingTimer Component Updates
```tsx
// mobile-app/src/components/mindfulness/MindfulEatingTimer.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import { Button } from '@/design-system';

interface MindfulEatingTimerProps {
  recipeName: string;
  suggestedDuration: number; // in minutes
  onMilestone?: (percentage: number) => void;
  onComplete: (duration: number) => void;
  onSkip?: () => void;
  showTips?: boolean;
  tips?: string[];
}

export const MindfulEatingTimer: React.FC<MindfulEatingTimerProps> = ({
  recipeName,
  suggestedDuration,
  onMilestone,
  onComplete,
  onSkip,
  showTips = true,
  tips = []
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const totalSeconds = suggestedDuration * 60;
  const progress = (elapsed / totalSeconds) * 100;
  
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          
          // Check milestones
          const nextProgress = (next / totalSeconds) * 100;
          if (onMilestone && [25, 50, 75, 100].includes(Math.floor(nextProgress))) {
            onMilestone(Math.floor(nextProgress));
          }
          
          // Complete when reaching duration
          if (next >= totalSeconds) {
            clearInterval(interval);
            onComplete(next);
          }
          
          return next;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isPaused, totalSeconds, onMilestone, onComplete]);
  
  // Rotate tips
  useEffect(() => {
    if (showTips && tips.length > 0) {
      const tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % tips.length);
      }, 15000); // Change tip every 15 seconds
      
      return () => clearInterval(tipInterval);
    }
  }, [showTips, tips]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mindful Eating Timer</Text>
      <Text style={styles.recipeName}>{recipeName}</Text>
      
      <CircularProgress
        size={200}
        width={15}
        fill={progress}
        tintColor="#4CAF50"
        backgroundColor="#E0E0E0"
        rotation={0}
        lineCap="round"
      >
        {() => (
          <View style={styles.timerContent}>
            <Text style={styles.time}>{formatTime(elapsed)}</Text>
            <Text style={styles.remaining}>
              {formatTime(totalSeconds - elapsed)} remaining
            </Text>
          </View>
        )}
      </CircularProgress>
      
      {showTips && tips.length > 0 && (
        <Animated.View style={styles.tipContainer}>
          <Text style={styles.tipLabel}>Mindful Tip:</Text>
          <Text style={styles.tipText}>{tips[currentTip]}</Text>
        </Animated.View>
      )}
      
      <View style={styles.controls}>
        <Button
          mode="outlined"
          onPress={() => setIsPaused(!isPaused)}
          style={styles.button}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        
        {onSkip && (
          <Button
            mode="text"
            onPress={onSkip}
            style={styles.skipButton}
          >
            Skip Timer
          </Button>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  timerContent: {
    alignItems: 'center',
  },
  time: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  remaining: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tipContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  tipLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 12,
  },
  button: {
    minWidth: 100,
  },
  skipButton: {
    minWidth: 100,
  },
});
```

## Day 5: Wellness Tracking Integration - Detailed Steps

### Task 1: Connect Wellness Widgets to Actual Data

#### Step 1: Implement useWellnessData Hook
```tsx
// mobile-app/src/hooks/useWellnessData.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { WellnessService } from '@/services/WellnessService';
import { useAuth } from '@/hooks/useAuth';

export interface WellnessData {
  mood: {
    current: 'great' | 'good' | 'okay' | 'stressed' | 'anxious';
    history: Array<{
      mood: string;
      timestamp: string;
    }>;
  };
  mindfulness: {
    breathingSessions: number;
    meditationMinutes: number;
    gratitudeEntries: number;
    streak: number;
  };
  nutrition: {
    balancedMeals: number;
    mindfulEatingSessions: number;
    waterIntake: number;
  };
  insights: Array<{
    id: string;
    type: 'tip' | 'achievement' | 'recommendation';
    message: string;
    icon: string;
  }>;
}

export const useWellnessData = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['wellness', user?.id],
    queryFn: async () => {
      const wellnessService = WellnessService.getInstance();
      
      // Fetch all wellness data
      const [mood, mindfulness, nutrition, insights] = await Promise.all([
        wellnessService.getMoodData(),
        wellnessService.getMindfulnessStats(),
        wellnessService.getNutritionStats(),
        wellnessService.getInsights()
      ]);
      
      return {
        mood,
        mindfulness,
        nutrition,
        insights
      } as WellnessData;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
  
  const refetch = () => {
    queryClient.invalidateQueries(['wellness', user?.id]);
  };
  
  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch
  };
};
```

#### Step 2: Update WellnessScreen Implementation
```tsx
// mobile-app/src/screens/wellness/WellnessScreen.tsx
import React, { useEffect } from 'react';
import { 
  ScrollView, 
  RefreshControl, 
  View, 
  ActivityIndicator 
} from 'react-native';
import { useWellnessData } from '@/hooks/useWellnessData';
import { WellnessWidgets } from '@/components/wellness/WellnessWidgets';
import { MindfulLoader } from '@/components/mindfulness/MindfulLoader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useFocusEffect } from '@react-navigation/native';

export const WellnessScreen: React.FC = () => {
  const { data, isLoading, error, refetch } = useWellnessData();
  const [refreshing, setRefreshing] = useState(false);
  
  // Refetch data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  
  if (isLoading && !data) {
    return (
      <MindfulLoader 
        duration="medium" 
        message="Loading your wellness journey..."
      />
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Unable to load wellness data
        </Text>
        <Button onPress={refetch}>Try Again</Button>
      </View>
    );
  }
  
  return (
    <ErrorBoundary>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
      >
        <WellnessWidgets 
          data={data!}
          onMoodPress={() => navigation.navigate('MoodTracking')}
          onBreathingPress={() => navigation.navigate('BreathingExercise', {
            context: 'wellness',
            returnScreen: 'Wellness'
          })}
          onInsightPress={(insight) => handleInsightPress(insight)}
        />
      </ScrollView>
    </ErrorBoundary>
  );
};
```

### Task 2: Integrate Mood Tracking with Meal Experiences

#### Step 1: Update PostMealReflectionScreen
```tsx
// mobile-app/src/screens/wellness/PostMealReflectionScreen.tsx
import React, { useState } from 'react';
import { MoodSelector } from '@/components/wellness/MoodSelector';
import { WellnessService } from '@/services/WellnessService';
import { MealService } from '@/services/MealService';

interface PostMealReflectionProps {
  route: {
    params: {
      mealId: string;
      eatingDuration?: number;
      wasMindful?: boolean;
    };
  };
}

export const PostMealReflectionScreen: React.FC<PostMealReflectionProps> = ({ 
  route 
}) => {
  const { mealId, eatingDuration, wasMindful } = route.params;
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [satisfaction, setSatisfaction] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!selectedMood) {
      Alert.alert('Please select how you feel');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save mood data
      await WellnessService.getInstance().saveMoodEntry({
        mood: selectedMood,
        context: 'post-meal',
        mealId,
        satisfaction,
        notes,
        timestamp: new Date().toISOString(),
        metadata: {
          eatingDuration,
          wasMindful
        }
      });
      
      // Update meal record with reflection data
      await MealService.updateMealReflection(mealId, {
        mood: selectedMood,
        satisfaction,
        reflectionCompleted: true,
        reflectionTimestamp: new Date().toISOString()
      });
      
      // Check for milestones
      await MilestoneService.getInstance().checkReflectionMilestone();
      
      // Navigate to success screen or back to home
      navigation.navigate('ReflectionComplete', {
        mood: selectedMood,
        mealId
      });
    } catch (error) {
      console.error('Error saving reflection:', error);
      Alert.alert('Error', 'Failed to save your reflection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Post-Meal Reflection</Text>
        <Text style={styles.subtitle}>
          Take a moment to check in with yourself
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling?</Text>
        <MoodSelector
          selectedMood={selectedMood}
          onMoodSelect={setSelectedMood}
          moods={[
            { id: 'satisfied', label: 'Satisfied', emoji: '😊' },
            { id: 'energized', label: 'Energized', emoji: '⚡' },
            { id: 'calm', label: 'Calm', emoji: '😌' },
            { id: 'full', label: 'Comfortably Full', emoji: '🤗' },
            { id: 'grateful', label: 'Grateful', emoji: '🙏' }
          ]}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          How satisfied are you with your meal?
        </Text>
        <Slider
          value={satisfaction}
          onValueChange={setSatisfaction}
          minimumValue={1}
          maximumValue={10}
          step={1}
          minimumTrackTintColor="#4CAF50"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#4CAF50"
        />
        <Text style={styles.sliderValue}>{satisfaction}/10</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Any thoughts about your meal? (Optional)
        </Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          placeholder="Share your thoughts..."
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!selectedMood || isSubmitting}
          style={styles.submitButton}
        >
          Complete Reflection
        </Button>
        
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          Skip for now
        </Button>
      </View>
    </ScrollView>
  );
};
```

### Task 3: Wire Adaptive Theme to User's Mood

#### Step 1: Update AdaptiveThemeProvider
```tsx
// mobile-app/src/theme/AdaptiveThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWellnessData } from '@/hooks/useWellnessData';
import { Appearance } from 'react-native';
import { DefaultTheme, MD3Theme } from 'react-native-paper';

interface AdaptiveThemeContextType {
  theme: MD3Theme;
  isDark: boolean;
  adaptiveMode: 'mood' | 'system' | 'manual';
  setAdaptiveMode: (mode: 'mood' | 'system' | 'manual') => void;
}

const AdaptiveThemeContext = createContext<AdaptiveThemeContextType | null>(null);

export const AdaptiveThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { data: wellnessData } = useWellnessData();
  const [adaptiveMode, setAdaptiveMode] = useState<'mood' | 'system' | 'manual'>('mood');
  const [theme, setTheme] = useState(DefaultTheme);
  const systemColorScheme = Appearance.getColorScheme();
  
  // Define mood-based color palettes
  const moodPalettes = {
    great: {
      primary: '#4CAF50',
      secondary: '#81C784',
      tertiary: '#FFC107',
      surface: '#F1F8E9',
    },
    good: {
      primary: '#2196F3',
      secondary: '#64B5F6',
      tertiary: '#4CAF50',
      surface: '#E3F2FD',
    },
    okay: {
      primary: '#9C27B0',
      secondary: '#BA68C8',
      tertiary: '#FF9800',
      surface: '#F3E5F5',
    },
    stressed: {
      primary: '#FF5722',
      secondary: '#FF8A65',
      tertiary: '#FFB74D',
      surface: '#FFF3E0',
    },
    anxious: {
      primary: '#607D8B',
      secondary: '#90A4AE',
      tertiary: '#B0BEC5',
      surface: '#ECEFF1',
    },
  };
  
  useEffect(() => {
    if (adaptiveMode === 'mood' && wellnessData?.mood.current) {
      const currentMood = wellnessData.mood.current;
      const palette = moodPalettes[currentMood] || moodPalettes.okay;
      
      // Create adaptive theme based on mood
      const adaptiveTheme = {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          ...palette,
          // Add smooth color transitions
          primary: palette.primary,
          primaryContainer: palette.surface,
          secondary: palette.secondary,
          tertiary: palette.tertiary,
        },
      };
      
      setTheme(adaptiveTheme);
    } else if (adaptiveMode === 'system') {
      // Use system theme
      setTheme(systemColorScheme === 'dark' ? DarkTheme : DefaultTheme);
    }
  }, [wellnessData?.mood.current, adaptiveMode, systemColorScheme]);
  
  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (adaptiveMode === 'system') {
        setTheme(colorScheme === 'dark' ? DarkTheme : DefaultTheme);
      }
    });
    
    return () => subscription.remove();
  }, [adaptiveMode]);
  
  return (
    <AdaptiveThemeContext.Provider
      value={{
        theme,
        isDark: theme.dark,
        adaptiveMode,
        setAdaptiveMode,
      }}
    >
      <PaperProvider theme={theme}>
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
```

## Testing Checklist for Week 2 Implementation

### Day 4 Testing
- [ ] FloatingBreatherButton navigates to BreathingExerciseScreen
- [ ] Context is properly passed and displayed in breathing exercise
- [ ] Return navigation works correctly
- [ ] Gratitude overlay appears after meal completion
- [ ] Gratitude entries are saved to WellnessService
- [ ] Post-meal reflection navigation triggers correctly
- [ ] Mindful eating timer displays and tracks time
- [ ] Timer milestones trigger haptic feedback
- [ ] Timer completion navigates to reflection

### Day 5 Testing
- [ ] Wellness widgets display real data
- [ ] Pull-to-refresh updates wellness data
- [ ] Screen focus triggers data refresh
- [ ] Mood selection works in post-meal reflection
- [ ] Mood data is saved and linked to meals
- [ ] Satisfaction slider works correctly
- [ ] Adaptive theme changes with mood
- [ ] Theme transitions are smooth
- [ ] Theme preference settings work

## Common Issues and Solutions

### Navigation Type Errors
```tsx
// If you get navigation type errors, ensure:
// 1. Types are properly defined in navigation/types.ts
// 2. You're using the correct navigation prop type
// 3. Screen names match exactly in navigator and types
```

### AsyncStorage Errors
```tsx
// Handle AsyncStorage errors gracefully:
try {
  await AsyncStorage.setItem(key, value);
} catch (error) {
  console.error('Storage error:', error);
  // Fallback to in-memory storage or show user message
}
```

### Hook Dependencies
```tsx
// Ensure all hooks have proper dependencies:
useEffect(() => {
  // Effect logic
}, [dependency1, dependency2]); // Don't forget dependencies!
```

## Performance Optimization Tips

1. **Memoize expensive computations**:
```tsx
const expensiveData = useMemo(() => {
  return processWellnessData(rawData);
}, [rawData]);
```

2. **Use React.memo for pure components**:
```tsx
export const WellnessWidget = React.memo(({ data }) => {
  // Component implementation
});
```

3. **Optimize list rendering**:
```tsx
const renderItem = useCallback(({ item }) => (
  <ItemComponent item={item} />
), []);
```

## Next Steps

After completing Week 2 implementation:
1. Run comprehensive tests
2. Profile performance
3. Gather user feedback
4. Document any API changes
5. Prepare for Week 3 advanced features