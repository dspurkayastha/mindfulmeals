import { useEffect, useRef, useCallback } from 'react';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { ScrollView, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import StressDetectionService from '../services/StressDetectionService';

interface UseStressDetectionOptions {
  screen: string;
  enableScrollTracking?: boolean;
  enableTapTracking?: boolean;
}

export const useStressDetection = (options: UseStressDetectionOptions) => {
  const navigation = useNavigation();
  const navigationState = useNavigationState((state) => state);
  const lastScrollPosition = useRef(0);
  const scrollStartTime = useRef(Date.now());

  useEffect(() => {
    // Start monitoring when component mounts
    StressDetectionService.startMonitoring();

    // Track navigation changes
    const unsubscribe = navigation.addListener('state', (e) => {
      if (e.data.state) {
        StressDetectionService.trackNavigation(e.data.state);
      }
    });

    // Track initial navigation state
    if (navigationState) {
      StressDetectionService.trackNavigation(navigationState);
    }

    return () => {
      unsubscribe();
    };
  }, [navigation, navigationState]);

  // Scroll tracking handler
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!options.enableScrollTracking) return;

      const currentPosition = event.nativeEvent.contentOffset.y;
      const currentTime = Date.now();
      const timeDelta = currentTime - scrollStartTime.current;
      
      if (timeDelta > 0) {
        const velocity = Math.abs(currentPosition - lastScrollPosition.current) / (timeDelta / 1000);
        StressDetectionService.trackScroll(velocity, options.screen);
      }

      lastScrollPosition.current = currentPosition;
      scrollStartTime.current = currentTime;
    },
    [options.screen, options.enableScrollTracking]
  );

  // Tap tracking handler
  const trackTap = useCallback(() => {
    if (options.enableTapTracking) {
      StressDetectionService.trackTap(options.screen);
    }
  }, [options.screen, options.enableTapTracking]);

  // Enhanced ScrollView with stress tracking
  const StressAwareScrollView = useCallback(
    ({ children, onScroll, ...props }: any) => (
      <ScrollView
        {...props}
        onScroll={(e) => {
          handleScroll(e);
          onScroll?.(e);
        }}
        scrollEventThrottle={100}
      >
        {children}
      </ScrollView>
    ),
    [handleScroll]
  );

  // Enhanced FlatList with stress tracking
  const StressAwareFlatList = useCallback(
    ({ onScroll, ...props }: any) => (
      <FlatList
        {...props}
        onScroll={(e) => {
          handleScroll(e);
          onScroll?.(e);
        }}
        scrollEventThrottle={100}
      />
    ),
    [handleScroll]
  );

  return {
    trackTap,
    handleScroll,
    StressAwareScrollView,
    StressAwareFlatList,
  };
};

// Hook to get stress insights
export const useStressInsights = () => {
  const getInsights = useCallback(async () => {
    return await StressDetectionService.getStressInsights();
  }, []);

  const updateMeditationSettings = useCallback(async (settings: any) => {
    await StressDetectionService.updateMeditationSettings(settings);
  }, []);

  return {
    getInsights,
    updateMeditationSettings,
  };
};