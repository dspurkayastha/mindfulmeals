# MindfulMeals Integration & Wiring TODO 🧩

## 📋 **AUDIT SUMMARY**

**Current State**: The codebase has **sophisticated mindfulness components** but many are **not properly integrated** or **missing critical wiring**.

**Key Finding**: You're **WAY ahead** of the master plan - Week 2-3 features are built but need integration work.

---

## 🚨 **CRITICAL INTEGRATION ISSUES (Fix First)**

### **1. Missing Provider Integration**
- [ ] **AdaptiveThemeProvider** not wired in App.tsx
- [ ] **StressDetectionService** not initialized globally
- [ ] **NotificationService** not configured on app start
- [ ] **MindfulLoader** not replacing generic loading states

### **2. Navigation & Screen Wiring**
- [ ] **BreathingExercise screen** referenced but navigation not set up
- [ ] **Wellness screens** exist but not accessible from main navigation
- [ ] **Post-meal reflection flow** not triggered by meal completion
- [ ] **Mindful cooking timer** not integrated with recipe screens

### **3. Service Initialization**
- [ ] **StressDetectionService.startMonitoring()** never called
- [ ] **NotificationService.configure()** not initialized
- [ ] **Local notification permissions** not requested
- [ ] **Background timer setup** not configured

---

## 🔧 **HIGH PRIORITY INTEGRATION TASKS**

### **Week 1: Core Provider & Service Setup**

#### **Day 1: Provider Integration**
- [ ] **Wire AdaptiveThemeProvider** in App.tsx
  ```tsx
  // App.tsx - Add AdaptiveThemeProvider
  <AdaptiveThemeProvider>
    <AppProviders>
      <AppNavigator />
    </AppProviders>
  </AdaptiveThemeProvider>
  ```
- [ ] **Initialize StressDetectionService** globally
  ```tsx
  // App.tsx - Start stress monitoring
  useEffect(() => {
    StressDetectionService.getInstance().startMonitoring();
  }, []);
  ```
- [ ] **Configure NotificationService** on app start
  ```tsx
  // App.tsx - Setup notifications
  useEffect(() => {
    NotificationService.getInstance().configure();
    NotificationService.getInstance().requestPermissions();
  }, []);
  ```

#### **Day 2: Navigation Wiring**
- [ ] **Add wellness screens** to main navigation
  ```tsx
  // MainTabs.tsx - Add wellness tab
  <Tab.Screen name="Wellness" component={WellnessScreen} />
  ```
- [ ] **Setup breathing exercise navigation**
  ```tsx
  // AppNavigator.tsx - Add breathing screen
  <Stack.Screen name="BreathingExercise" component={BreathingExerciseScreen} />
  ```
- [ ] **Wire post-meal reflection navigation**
  ```tsx
  // After meal completion - navigate to reflection
  navigation.navigate('PostMealReflection', { mealId, mealData });
  ```

#### **Day 3: Service Integration**
- [ ] **Replace generic loaders** with MindfulLoader
  ```tsx
  // All screens - Replace ActivityIndicator with MindfulLoader
  <MindfulLoader duration="medium" message="Loading mindfully..." />
  ```
- [ ] **Wire stress detection** to navigation
  ```tsx
  // AppNavigator.tsx - Track navigation state
  onStateChange={(state) => StressDetectionService.getInstance().trackNavigation(state)}
  ```
- [ ] **Setup notification scheduling** for post-meal reflections
  ```tsx
  // After meal logging - schedule 30-min reflection
  NotificationService.getInstance().schedulePostMealReflection(mealId, 30);
  ```

### **Week 2: User Experience Integration**

#### **Day 4: Mindfulness Flow Integration**
- [ ] **Connect FloatingBreatherButton** to actual breathing exercises
  ```tsx
  // PantryScreen.tsx - Wire breathing button to navigation
  onPress={() => navigation.navigate('BreathingExercise', { context: 'pantry' })}
  ```
- [ ] **Integrate gratitude overlays** with meal completion
  ```tsx
  // After meal planning - show gratitude prompt
  <GratitudeOverlay visible={showGratitude} onClose={handleGratitudeClose} />
  ```
- [ ] **Wire mindful eating timer** to meal screens
  ```tsx
  // RecipeScreen.tsx - Add mindful eating timer
  <MindfulEatingTimer onComplete={handleMealComplete} />
  ```

#### **Day 5: Wellness Tracking Integration**
- [ ] **Connect wellness widgets** to actual data
  ```tsx
  // WellnessScreen.tsx - Wire to real wellness data
  const { wellnessData } = useWellnessData();
  ```
- [ ] **Integrate mood tracking** with meal experiences
  ```tsx
  // PostMealReflectionScreen.tsx - Save mood to wellness service
  const { saveMoodEntry } = useWellnessService();
  ```
- [ ] **Wire adaptive theme** to user's actual mood
  ```tsx
  // AdaptiveThemeProvider.tsx - Connect to wellness state
  const { currentMood } = useWellnessState();
  ```

---

## 🎯 **MEDIUM PRIORITY INTEGRATION TASKS**

### **Week 3: Advanced Feature Integration**

#### **Day 6-7: Smart Features**
- [ ] **Connect stress detection** to meditation triggers
  ```tsx
  // StressDetectionService.tsx - Trigger meditation on stress
  if (stressLevel > threshold) {
    NotificationService.getInstance().triggerMeditation(stressLevel);
  }
  ```
- [ ] **Wire insights engine** to user data
  ```tsx
  // InsightsEngine.tsx - Generate insights from wellness data
  const insights = generateInsights(wellnessData, mealData);
  ```
- [ ] **Integrate milestone service** with achievements
  ```tsx
  // MilestoneService.tsx - Track and celebrate achievements
  checkAndCelebrateMilestones(userActions);
  ```

#### **Day 8-9: Performance & Polish**
- [ ] **Optimize animation performance** (60fps target)
  ```tsx
  // All animations - Use native driver
  useNativeDriver: true
  ```
- [ ] **Implement list virtualization** for large lists
  ```tsx
  // PantryScreen.tsx - Use FlatList with virtualization
  <FlatList
    removeClippedSubviews={true}
    maxToRenderPerBatch={10}
    windowSize={10}
  />
  ```
- [ ] **Add haptic feedback** to key interactions
  ```tsx
  // Key interactions - Add haptic feedback
  import { trigger } from 'react-native-haptic-feedback';
  trigger('impactMedium');
  ```

---

## 🔍 **LOW PRIORITY INTEGRATION TASKS**

### **Week 4: Enhancement & Polish**

#### **Day 10-12: User Experience Polish**
- [ ] **Add skip/dismiss options** to all mindful prompts
  ```tsx
  // All mindful components - Add skip option
  <TouchableOpacity onPress={onSkip}>
    <Text>Skip for now</Text>
  </TouchableOpacity>
  ```
- [ ] **Implement accessibility features**
  ```tsx
  // All components - Add accessibility props
  accessible={true}
  accessibilityLabel="Mindful breathing button"
  accessibilityHint="Double tap to start breathing exercise"
  ```
- [ ] **Add error boundaries** with mindful recovery
  ```tsx
  // Error boundaries - Mindful error handling
  <MindfulErrorBoundary onRecovery={handleMindfulRecovery} />
  ```

#### **Day 13-14: Testing & Validation**
- [ ] **Test end-to-end flows** for all mindfulness features
- [ ] **Verify notification delivery** on both platforms
- [ ] **Test offline functionality** for wellness data
- [ ] **Validate accessibility** with VoiceOver/TalkBack

---

## 🚫 **KNOWN INTEGRATION GAPS**

### **Missing Screen Connections**
- [ ] **BreathingExerciseScreen** - Not accessible from main navigation
- [ ] **PostMealReflectionScreen** - Not triggered by meal completion
- [ ] **GratitudeJournalScreen** - Not integrated with main app flow
- [ ] **WeeklyReportScreen** - Not accessible from wellness dashboard

### **Service Dependencies**
- [ ] **StressDetectionService** - No global initialization
- [ ] **NotificationService** - No permission handling
- [ ] **InsightsEngine** - No data source connection
- [ ] **MilestoneService** - No achievement tracking

### **Data Flow Issues**
- [ ] **Wellness data** - Not persisted between app sessions
- [ ] **Mood tracking** - Not connected to meal experiences
- [ ] **Gratitude entries** - Not linked to actual meals
- [ ] **Breathing sessions** - Not tracked for progress

---

## 🎯 **SUCCESS CRITERIA FOR INTEGRATION**

### **Week 1 Success (Core Integration)**
- [ ] App starts with all providers initialized
- [ ] Navigation includes wellness and breathing screens
- [ ] MindfulLoader replaces generic loading states
- [ ] Basic notification permissions granted

### **Week 2 Success (User Flows)**
- [ ] User can complete full mindfulness flow: pantry → breathing → gratitude
- [ ] Post-meal reflections are scheduled and triggered
- [ ] Wellness data is tracked and persisted
- [ ] Adaptive theme responds to user mood

### **Week 3 Success (Smart Features)**
- [ ] Stress detection triggers meditation prompts
- [ ] Insights engine generates contextual wellness tips
- [ ] Milestones are tracked and celebrated
- [ ] Performance targets met (60fps animations)

### **Week 4 Success (Polish & Launch)**
- [ ] All mindfulness features are skippable
- [ ] Accessibility compliance verified
- [ ] End-to-end testing passes
- [ ] App ready for beta testing

---

## 🔧 **TECHNICAL INTEGRATION NOTES**

### **Provider Hierarchy (Correct Order)**
```tsx
<AdaptiveThemeProvider>
  <QueryClientProvider>
    <I18nextProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </I18nextProvider>
  </QueryClientProvider>
</AdaptiveThemeProvider>
```

### **Service Initialization Pattern**
```tsx
// App.tsx - Initialize all services
useEffect(() => {
  // Initialize services in order
  NotificationService.getInstance().configure();
  StressDetectionService.getInstance().startMonitoring();
  AdaptiveThemeProvider.initialize();
}, []);
```

### **Navigation Integration Pattern**
```tsx
// Add wellness screens to main navigation
<Tab.Screen 
  name="Wellness" 
  component={WellnessScreen}
  options={{
    tabBarIcon: ({ color }) => <Icon name="heart" color={color} />,
    tabBarLabel: 'Wellness'
  }}
/>
```

---

## 📊 **INTEGRATION PROGRESS TRACKING**

### **Week 1 Progress**
- [ ] Provider Integration: 0/3 tasks
- [ ] Navigation Wiring: 0/3 tasks  
- [ ] Service Integration: 0/3 tasks
- **Overall**: 0% Complete

### **Week 2 Progress**
- [ ] Mindfulness Flow: 0/3 tasks
- [ ] Wellness Tracking: 0/3 tasks
- **Overall**: 0% Complete

### **Week 3 Progress**
- [ ] Smart Features: 0/3 tasks
- [ ] Performance: 0/3 tasks
- **Overall**: 0% Complete

### **Week 4 Progress**
- [ ] User Experience: 0/3 tasks
- [ ] Testing: 0/3 tasks
- **Overall**: 0% Complete

---

## 🚀 **NEXT IMMEDIATE ACTIONS**

### **Today (Day 1)**
1. **Fix provider integration** in App.tsx
2. **Initialize core services** on app start
3. **Test app startup** with all providers

### **Tomorrow (Day 2)**
1. **Add wellness navigation** to main tabs
2. **Wire breathing exercise** navigation
3. **Test navigation flow** between screens

### **This Week**
1. **Complete Week 1 integration tasks**
2. **Verify all services are initialized**
3. **Test basic mindfulness flows**

---

**🎯 Goal**: Transform the existing sophisticated mindfulness components into a **seamlessly integrated, delightful user experience** that feels natural and cohesive.

**⏰ Timeline**: 4 weeks to complete integration and launch readiness.

**💡 Key Insight**: The hard development work is done - now it's about **making everything work together** beautifully.
