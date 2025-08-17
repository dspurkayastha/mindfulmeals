# Contextual Mindfulness Implementation Guide 🧘‍♀️

## Overview
This guide details how to implement mindfulness features contextually throughout the MindfulMeals app, ensuring they feel natural and integrated rather than separate wellness features.

## 1. Breathing Exercise Integration

### 1.1 Pantry Organization - "Take a Breather"
```typescript
// components/pantry/PantryBreather.tsx
interface PantryBreatherProps {
  triggerAfterMinutes: number; // Default: 5
  itemsOrganized: number;
}

const PantryBreather: React.FC = () => {
  const [showBreather, setShowBreather] = useState(false);
  const organizingTime = useRef(Date.now());
  
  // Show after 5 minutes of organizing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBreather(true);
      haptic.impact('light');
    }, 5 * 60 * 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return showBreather ? (
    <FloatingBreatherButton
      message="You've been organizing for a while"
      subtext="Take 3 breaths with me?"
      onAccept={() => navigateToBreathingOverlay()}
      onDismiss={() => setShowBreather(false)}
    />
  ) : null;
};
```

### 1.2 Cooking Timer - Synchronized Breathing
```typescript
// components/cooking/CookingBreathingTimer.tsx
const CookingBreathingTimer: React.FC<{cookTime: number}> = ({ cookTime }) => {
  const breathCycles = Math.floor(cookTime / 12); // 12s per breath cycle
  
  return (
    <View style={styles.container}>
      <CircularProgress 
        duration={cookTime}
        overlay={
          <BreathingGuide
            cycles={breathCycles}
            message="Breathe while your food cooks"
            pattern="4-4-4" // 4s in, 4s hold, 4s out
          />
        }
      />
      <Text style={styles.tip}>
        {breathCycles} breathing cycles until ready
      </Text>
    </View>
  );
};
```

### 1.3 Loading States - Breathing Opportunities
```typescript
// components/common/MindfulLoader.tsx
const MindfulLoader: React.FC<{estimatedDuration?: number}> = ({ estimatedDuration }) => {
  const getLoaderType = () => {
    if (!estimatedDuration || estimatedDuration < 3000) {
      return <BreathingDot size="small" />;
    } else if (estimatedDuration < 10000) {
      return <BreathingCircle message="Finding nourishing recipes..." />;
    } else {
      return <GuidedBreathingExercise duration={estimatedDuration} />;
    }
  };
  
  return (
    <View style={styles.loaderContainer}>
      {getLoaderType()}
      {estimatedDuration > 5000 && (
        <MindfulTip category="nutrition" />
      )}
    </View>
  );
};
```

## 2. Meal-Based Gratitude System

### 2.1 Post-Meal Reflection Notification
```typescript
// services/MealReflectionService.ts
class MealReflectionService {
  scheduleMealReflection(mealId: string, mealTime: Date) {
    const reflectionTime = new Date(mealTime.getTime() + 30 * 60 * 1000); // 30 min later
    
    scheduleNotification({
      id: `meal-reflection-${mealId}`,
      title: "How was your meal?",
      body: "Take a moment to reflect on how you're feeling",
      data: { mealId, type: 'meal-reflection' },
      trigger: { date: reflectionTime },
      android: {
        channelId: 'meal-reflections',
        color: colors.sage,
        vibrate: [100, 50, 100], // Gentle pattern
      },
      ios: {
        sound: 'gentle-chime.wav',
        badge: false,
      }
    });
  }
}
```

### 2.2 Inline Gratitude Prompts
```typescript
// components/meals/MealCard.tsx
const MealCard: React.FC<{meal: Meal}> = ({ meal }) => {
  const [showGratitude, setShowGratitude] = useState(false);
  
  const getContextualPrompt = () => {
    const hour = new Date().getHours();
    if (hour < 10) return "What are you grateful for in this breakfast?";
    if (hour < 14) return "Notice the colors and textures in your lunch";
    if (hour < 18) return "How did this meal nourish you today?";
    return "End your day with gratitude for this meal";
  };
  
  return (
    <Card onLongPress={() => setShowGratitude(true)}>
      <MealInfo {...meal} />
      {showGratitude && (
        <GratitudeQuickEntry
          prompt={getContextualPrompt()}
          onSave={(gratitude) => saveMealGratitude(meal.id, gratitude)}
          onSkip={() => setShowGratitude(false)}
        />
      )}
    </Card>
  );
};
```

### 2.3 Visual Gratitude Timeline
```typescript
// screens/GratitudeTimelineScreen.tsx
const GratitudeTimelineScreen = () => {
  const gratitudes = useGratitudeHistory();
  
  return (
    <ScrollView>
      <Header title="Your Nourishment Journey" />
      <MoodChart data={gratitudes.map(g => g.mood)} />
      
      {gratitudes.map((entry, index) => (
        <TimelineItem key={entry.id}>
          <TimelineDot mood={entry.mood} />
          <TimelineContent>
            <MealPhoto source={entry.photo} />
            <GratitudeText>{entry.gratitude}</GratitudeText>
            <MoodBadge mood={entry.postMealMood} />
            {entry.energyBoost && <EnergyIndicator level={entry.energyLevel} />}
          </TimelineContent>
        </TimelineItem>
      ))}
      
      <WeeklyInsight>
        You felt most energized after Mediterranean meals this week 🌟
      </WeeklyInsight>
    </ScrollView>
  );
};
```

## 3. Intelligent Meditation Integration

### 3.1 Context-Aware Triggers
```typescript
// services/MeditationIntelligence.ts
class MeditationIntelligence {
  async suggestMeditation(context: AppContext) {
    const triggers = await this.analyzeTriggers(context);
    
    if (triggers.isStressed) {
      return this.promptMeditation({
        type: 'stress-relief',
        duration: 3,
        message: 'Feeling overwhelmed? Let\'s take a mindful pause',
        animation: 'calming-waves',
      });
    }
    
    if (triggers.isPreMeal && context.lastMeditationHours > 4) {
      return this.promptMeditation({
        type: 'pre-meal-gratitude',
        duration: 1,
        message: 'Center yourself before eating',
        animation: 'gentle-breath',
      });
    }
    
    if (triggers.isPostLunch && context.energyLevel < 3) {
      return this.promptMeditation({
        type: 'energy-boost',
        duration: 5,
        message: 'Recharge with a digestive meditation',
        animation: 'energizing-sun',
      });
    }
  }
  
  private analyzeTriggers(context: AppContext) {
    return {
      isStressed: context.mealPlanningDuration > 10 && context.backNavigations > 3,
      isPreMeal: context.currentScreen === 'MealDetails' && context.mealTimeProximity < 30,
      isPostLunch: context.currentHour >= 14 && context.currentHour <= 15,
      energyDip: context.scrollVelocity < 0.5 && context.screenTime > 300,
    };
  }
}
```

### 3.2 Micro-Meditation Overlays
```typescript
// components/meditation/MicroMeditationOverlay.tsx
const MicroMeditationOverlay: React.FC<{type: MeditationType}> = ({ type }) => {
  const meditation = getMeditationConfig(type);
  
  return (
    <BlurredOverlay>
      <View style={styles.container}>
        <LottieView
          source={meditation.animation}
          autoPlay
          loop
          style={styles.animation}
        />
        
        <Heading2>{meditation.title}</Heading2>
        <Body>{meditation.instruction}</Body>
        
        <BreathingGuide
          pattern={meditation.breathPattern}
          duration={meditation.duration}
          onComplete={() => {
            haptic.success();
            showCompletionToast('Well done! 🌟');
          }}
        />
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => dismissOverlay()}
        >
          <Caption>Skip for now</Caption>
        </TouchableOpacity>
      </View>
    </BlurredOverlay>
  );
};
```

### 3.3 Adaptive Notification Timing
```typescript
// services/AdaptiveNotificationService.ts
class AdaptiveNotificationService {
  async scheduleSmartMeditation(userId: string) {
    const userPatterns = await analyzeUserPatterns(userId);
    const optimalTimes = this.calculateOptimalTimes(userPatterns);
    
    optimalTimes.forEach(time => {
      scheduleNotification({
        id: `meditation-${time.type}`,
        title: time.title,
        body: time.message,
        trigger: { 
          hour: time.hour,
          minute: time.minute,
          repeats: true 
        },
        data: {
          type: 'meditation',
          duration: time.duration,
          skipIfActive: true, // Don't show if user is actively using app
        }
      });
    });
  }
  
  private calculateOptimalTimes(patterns: UserPatterns) {
    return [
      {
        type: 'morning',
        hour: patterns.avgWakeTime + 1,
        minute: 0,
        title: 'Morning Mindfulness',
        message: 'Start your day with intention',
        duration: 5,
      },
      {
        type: 'pre-lunch',
        hour: patterns.avgLunchTime - 0.5,
        minute: 30,
        title: 'Pre-Meal Pause',
        message: 'Prepare your body for nourishment',
        duration: 3,
      },
      {
        type: 'afternoon',
        hour: 15,
        minute: 0,
        title: 'Afternoon Reset',
        message: patterns.hasAfternoonDip 
          ? 'Recharge your energy' 
          : 'Maintain your flow',
        duration: 5,
      },
      {
        type: 'evening',
        hour: patterns.avgDinnerTime + 1,
        minute: 30,
        title: 'Evening Gratitude',
        message: 'Reflect on today\'s nourishment',
        duration: 10,
      }
    ];
  }
}
```

## 4. Micro-Wellness Moments

### 4.1 Ingredient Gratitude
```typescript
// components/pantry/IngredientGratitude.tsx
const IngredientGratitude: React.FC<{ingredient: Ingredient}> = ({ ingredient }) => {
  const [showGratitude, setShowGratitude] = useState(false);
  
  const handleAdd = () => {
    haptic.impact('medium');
    addIngredient(ingredient);
    
    // Show gratitude for fresh, seasonal, or local ingredients
    if (ingredient.isFresh || ingredient.isSeasonal || ingredient.isLocal) {
      setShowGratitude(true);
      setTimeout(() => setShowGratitude(false), 3000);
    }
  };
  
  return (
    <>
      <TouchableOpacity onPress={handleAdd}>
        <IngredientCard {...ingredient} />
      </TouchableOpacity>
      
      {showGratitude && (
        <GratitudeToast
          message={`Grateful for ${ingredient.isLocal ? 'local' : 'fresh'} ${ingredient.name}`}
          icon="🙏"
          color={colors.sage}
        />
      )}
    </>
  );
};
```

### 4.2 Mindful Error Recovery
```typescript
// components/common/MindfulErrorBoundary.tsx
const MindfulErrorBoundary: React.FC = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  
  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <LottieView
          source={require('../assets/lottie/gentle-waves.json')}
          autoPlay
          loop
          style={styles.background}
        />
        
        <Heading2>Let's pause together</Heading2>
        <Body>Sometimes things don't go as planned, and that's okay</Body>
        
        {!isBreathing ? (
          <MindfulButton
            title="Take 3 breaths with me"
            onPress={() => setIsBreathing(true)}
          />
        ) : (
          <BreathingGuide
            cycles={3}
            onComplete={() => {
              setHasError(false);
              haptic.success();
            }}
          />
        )}
        
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => setHasError(false)}
        >
          <Caption>Try again</Caption>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ErrorBoundary fallback={() => setHasError(true)}>
      {children}
    </ErrorBoundary>
  );
};
```

### 4.3 Celebration Moments
```typescript
// hooks/useMindfulCelebrations.ts
const useMindfulCelebrations = () => {
  const celebrate = useCallback((achievement: Achievement) => {
    const celebration = getCelebrationConfig(achievement);
    
    // Haptic celebration sequence
    haptic.sequence(celebration.hapticPattern);
    
    // Visual celebration
    showCelebrationOverlay({
      animation: celebration.animation,
      message: celebration.message,
      duration: 2000,
      particles: celebration.includeParticles,
    });
    
    // Sound (optional)
    if (celebration.sound) {
      playSound(celebration.sound);
    }
    
    // Log for insights
    trackAchievement(achievement);
  }, []);
  
  return { celebrate };
};

// Usage
const PantryScreen = () => {
  const { celebrate } = useMindfulCelebrations();
  
  useEffect(() => {
    if (itemsOrganized === 10) {
      celebrate({
        type: 'pantry-organization',
        message: 'Beautiful! Your pantry is mindfully organized 🌿',
      });
    }
  }, [itemsOrganized]);
};
```

## 5. Implementation Priorities

### Phase 1: Foundation (Week 1)
1. **Breathing Integration**
   - Pantry "take a breather" button
   - Cooking timer breathing sync
   - Loading state breathing dots

2. **Basic Gratitude**
   - Post-meal notification (30 min)
   - Simple gratitude input
   - Meal mood tracking

### Phase 2: Intelligence (Week 2)
1. **Smart Triggers**
   - Stress detection algorithm
   - Optimal meditation timing
   - Context-aware prompts

2. **Micro-Moments**
   - Ingredient gratitude toasts
   - Celebration animations
   - Mindful error states

### Phase 3: Polish (Week 3)
1. **Advanced Features**
   - Gratitude timeline view
   - Wellness insights
   - Habit streaks

2. **Optimization**
   - Performance tuning
   - A/B testing variants
   - User feedback integration

## Testing Strategy

### User Testing Scenarios
1. **New User Journey**: First week experience
2. **Stress Test**: Rushed meal planning
3. **Habit Formation**: 21-day usage
4. **Skip Behavior**: How often users skip prompts
5. **Engagement Metrics**: Which features stick

### Success Metrics
- Breathing exercises: 3+ daily average
- Gratitude entries: 60% meal completion rate  
- Meditation engagement: 40% acceptance rate
- User retention: 70% at day 7
- Mood improvement: Measurable positive trend

## Conclusion

By weaving mindfulness naturally into the meal planning journey, we create an app that doesn't just plan meals but nourishes the whole person. Every interaction becomes an opportunity for presence, gratitude, and well-being.