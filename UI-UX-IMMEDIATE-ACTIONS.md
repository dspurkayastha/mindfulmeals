# UI/UX Immediate Actions & Missing Components 🚀

## Missing Dependencies to Install

```bash
cd mobile-app

# Core mindfulness dependencies
npm i react-native-haptic-feedback  # For haptic patterns
npm i @tanstack/react-query         # For API state management
npm i react-native-toast-message    # For mindful notifications
npm i react-native-chart-kit        # For wellness tracking charts
npm i react-native-calendars        # For meal planning calendar
npm i react-native-skeleton-placeholder # For breathing rhythm loaders

# Additional UI enhancements
npm i react-native-phosphor         # Icon library (better than Material)
npm i react-native-shimmer-placeholder # For loading states
npm i react-native-snap-carousel    # For onboarding and tips
npm i react-native-progress         # For progress indicators
```

## Critical UI Components to Create

### 1. Design System Structure (Priority: HIGH)
```
mobile-app/src/design-system/
├── tokens/
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   ├── animations.ts
│   └── haptics.ts
├── atoms/
│   ├── MindfulText.tsx
│   ├── MindfulIcon.tsx
│   ├── MindfulInput.tsx
│   ├── MindfulChip.tsx
│   └── MindfulAvatar.tsx
├── molecules/
│   ├── MindfulCard.tsx (enhance existing)
│   ├── MindfulForm.tsx
│   ├── MindfulList.tsx
│   ├── MindfulModal.tsx
│   └── MindfulToast.tsx
└── organisms/
    ├── WellnessWidget.tsx
    ├── GratitudeEntry.tsx
    ├── MoodTracker.tsx
    └── BreathingGuide.tsx
```

### 2. Missing Screens & Features (Priority: HIGH)

#### Onboarding Screens
- `WelcomeScreen.tsx` - Mascot introduction
- `MindfulnessEducation.tsx` - Benefits carousel
- `PersonalizationScreen.tsx` - Goals and preferences
- `FirstGratitudeScreen.tsx` - Guided first entry

#### Wellness Features
- `GratitudeJournalScreen.tsx` - Full journal with search
- `MeditationTimerScreen.tsx` - Guided sessions
- `BreathingExerciseScreen.tsx` - Visual breathing guide
- `MoodEnergyTracker.tsx` - Daily check-ins
- `WellnessInsightsScreen.tsx` - Weekly reports

#### Enhanced Core Screens
- `MindfulPantryScreen.tsx` - With gratitude moments
- `MindfulMealPlanScreen.tsx` - With intentions
- `PostMealReflection.tsx` - Reflection modal

### 3. Animation Assets Needed (Priority: HIGH)

Create or source these Lottie animations:
1. **meditation-breathing.json** - Expanding/contracting circle
2. **gratitude-heart.json** - Heart with particle burst
3. **mindful-eating.json** - Slow eating pace guide
4. **daily-streak.json** - Celebration for streaks
5. **food-blessing.json** - Hands over food animation
6. **wellness-check.json** - Mood selection animation
7. **loading-breath.json** - Breathing rhythm loader
8. **sage-mascot-idle.json** - Mascot idle animation
9. **sage-mascot-happy.json** - Mascot celebration
10. **sage-mascot-meditate.json** - Mascot meditation

### 4. Immediate Code Implementations

#### 4.1 Haptic Feedback Utility
```typescript
// mobile-app/src/utils/haptics.ts
import HapticFeedback from 'react-native-haptic-feedback';

export const haptic = {
  impact: (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    HapticFeedback.impact(HapticFeedback.ImpactFeedbackStyle[type]);
  },
  
  notification: (type: 'success' | 'warning' | 'error') => {
    HapticFeedback.notification(HapticFeedback.NotificationFeedbackType[type]);
  },
  
  selection: () => {
    HapticFeedback.selection();
  },
  
  mindful: {
    breathIn: () => {
      // Custom pattern for breath in
      HapticFeedback.impact(HapticFeedback.ImpactFeedbackStyle.light);
      setTimeout(() => HapticFeedback.impact(HapticFeedback.ImpactFeedbackStyle.medium), 100);
    },
    
    gratitude: () => {
      // Celebration pattern
      HapticFeedback.notification(HapticFeedback.NotificationFeedbackType.success);
    }
  }
};
```

#### 4.2 Enhanced Theme with Gradients
```typescript
// mobile-app/src/utils/theme.ts (additions)
export const mindfulGradients = {
  sunrise: ['#FFB6C1', '#FF8C00', '#D2691E'],
  sunset: ['#E9967A', '#FF8C00', '#FFB6C1'],
  sage: ['#9CAF88', '#6B8E23', '#9CAF88'],
  earth: ['#F5DEB3', '#D2B48C', '#8B4513'],
  calm: ['#F5F5DC', '#FFF8DC', '#F5DEB3'],
};

export const animations = {
  spring: {
    type: 'spring',
    damping: 15,
    stiffness: 100,
  },
  timing: {
    fast: 200,
    medium: 300,
    slow: 600,
  },
  easing: {
    in: 'ease-in',
    out: 'ease-out',
    inOut: 'ease-in-out',
  },
};
```

#### 4.3 Skeleton Loader with Breathing
```typescript
// mobile-app/src/components/common/BreathingLoader.tsx
import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  useSharedValue 
} from 'react-native-reanimated';

export const BreathingLoader = () => {
  const breathAnimation = useSharedValue(1);
  
  React.useEffect(() => {
    breathAnimation.value = withRepeat(
      withTiming(1.1, { duration: 4000 }), // 4s breathing cycle
      -1,
      true
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathAnimation.value }],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      <SkeletonPlaceholder>
        {/* Skeleton content */}
      </SkeletonPlaceholder>
    </Animated.View>
  );
};
```

## UI/UX Tasks Not in Current TODOs

### Missing Critical Features:
1. **Gratitude Journal UI** - No implementation exists
2. **Breathing Exercise Interface** - Not built
3. **Mood/Energy Tracking Charts** - No visual implementation
4. **Mindful Eating Timer** - Not implemented
5. **Wellness Insights Dashboard** - Missing entirely
6. **Error Boundaries with Recovery** - No custom error handling
7. **Offline Mode UI** - No offline indicators
8. **Accessibility Labels** - Not implemented
9. **Custom Tab Bar with Animations** - Using default
10. **Onboarding Progress Indicator** - Missing

### Missing Polish Features:
1. **Pull to Refresh Animations** - Default only
2. **Swipe Actions** - Not implemented
3. **Long Press Menus** - Missing
4. **Image Lazy Loading** - Not optimized
5. **Custom Keyboard Avoiding View** - Using default
6. **Toast Notifications** - No implementation
7. **Empty States** - Basic or missing
8. **Search with Filters** - Very basic
9. **Date/Time Pickers** - No custom styling
10. **Progress Indicators** - Missing

## Week 1 Sprint Plan

### Day 1-2: Foundation
- [ ] Install all missing dependencies
- [ ] Set up design system structure
- [ ] Create haptic feedback utility
- [ ] Enhanced theme with gradients

### Day 3-4: Core Components
- [ ] Build atomic components (Text, Icon, Input, Chip)
- [ ] Create BreathingLoader component
- [ ] Implement MindfulToast system
- [ ] Build WellnessWidget organism

### Day 5-7: Screen Enhancements
- [ ] Redesign onboarding flow
- [ ] Add gratitude moments to pantry
- [ ] Create basic wellness dashboard
- [ ] Implement first animations

## Resources & References

### Lottie Animation Sources:
- LottieFiles.com (free animations)
- IconScout (premium animations)
- Create custom with After Effects + Bodymovin

### Design Inspiration:
- Headspace (meditation UI)
- Calm (wellness features)
- Duolingo (gamification)
- Fabulous (habit tracking)

### Accessibility Testing:
- React Native Accessibility Inspector
- Accessibility Scanner (Android)
- VoiceOver (iOS) testing
- axe DevTools