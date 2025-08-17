import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import { HouseholdSetupScreen } from '../screens/onboarding/HouseholdSetup';
import LoginScreen from '../screens/auth/LoginScreen';
import MainTabs from './MainTabs';
import { STORAGE_KEYS } from '@/config/constants';
import { useAuthStatus } from '@/hooks/api/useAuth';

// Import wellness screens
import BreathingExerciseScreen from '../screens/wellness/BreathingExerciseScreen';
import PostMealReflectionScreen from '../screens/wellness/PostMealReflectionScreen';
import GratitudeJournalScreen from '../screens/wellness/GratitudeJournalScreen';
import WeeklyReportScreen from '../screens/wellness/WeeklyReportScreen';

// Import services and components
import StressDetectionService from '../services/StressDetectionService';
import { MindfulLoader } from '../components/mindfulness';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const theme = useTheme();
  const { isAuthenticated, isLoading, user } = useAuthStatus();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  // Check onboarding status
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const complete = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
        setIsOnboardingComplete(complete === 'true');
      } catch (error) {
        setIsOnboardingComplete(false);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  // Show loading while checking auth and onboarding status
  if (isLoading || isCheckingOnboarding) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.colors.background 
      }}>
        <MindfulLoader duration="medium" message="Preparing your mindful experience..." />
      </View>
    );
  }

  return (
    <NavigationContainer
      onStateChange={(state) => {
        // Track navigation state for stress detection
        if (state) {
          StressDetectionService.getInstance().trackNavigation(state);
        }
      }}
    >
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'fade',
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            {!isOnboardingComplete && (
              <Stack.Screen 
                name="Onboarding" 
                component={OnboardingScreen}
                options={{ animation: 'slide_from_right' }}
              />
            )}
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
          </>
        ) : (
          // Authenticated Stack
          <>
            {!user?.householdId ? (
              // If user doesn't have a household, show setup
              <Stack.Screen 
                name="HouseholdSetup" 
                component={HouseholdSetupScreen}
                options={{ 
                  animation: 'slide_from_right',
                  gestureEnabled: false, // Prevent going back
                }}
              />
            ) : (
              // Main app
              <>
                <Stack.Screen 
                  name="Main" 
                  component={MainTabs}
                  options={{ 
                    animation: 'fade',
                    gestureEnabled: false, // Prevent swipe back to auth
                  }}
                />
                
                {/* Wellness Screens */}
                <Stack.Screen 
                  name="BreathingExercise" 
                  component={BreathingExerciseScreen}
                  options={{ 
                    animation: 'slide_from_bottom',
                    presentation: 'modal',
                  }}
                />
                
                <Stack.Screen 
                  name="PostMealReflection" 
                  component={PostMealReflectionScreen}
                  options={{ 
                    animation: 'slide_from_bottom',
                    presentation: 'modal',
                  }}
                />
                
                <Stack.Screen 
                  name="GratitudeJournal" 
                  component={GratitudeJournalScreen}
                  options={{ 
                    animation: 'slide_from_right',
                  }}
                />
                
                <Stack.Screen 
                  name="WeeklyReport" 
                  component={WeeklyReportScreen}
                  options={{ 
                    animation: 'slide_from_right',
                  }}
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;