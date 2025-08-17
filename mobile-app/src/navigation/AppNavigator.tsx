import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import { HouseholdSetupScreen } from '../screens/onboarding/HouseholdSetup';
import LoginScreen from '../screens/auth/LoginScreen';
import MainTabs from './MainTabs';
import { STORAGE_KEYS } from '@/config/constants';
import { useAuthStatus } from '@/hooks/api/useAuth';

const Stack = createNativeStackNavigator();

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
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
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
              <Stack.Screen 
                name="Main" 
                component={MainTabs}
                options={{ 
                  animation: 'fade',
                  gestureEnabled: false, // Prevent swipe back to auth
                }}
              />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;