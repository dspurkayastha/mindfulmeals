### MindfulMeals - Elegant Implementation Plan

**Core Philosophy**: Build the minimum viable delightful experience. Every feature must earn its place.

**📋 IMPORTANT**: This plan focuses on implementation details. For comprehensive UI/UX design, animations, and user experience flows, refer to `UI-UX-ENHANCEMENT-PLAN.md` as the definitive source.

### 🎯 MVP Feature Scope (Wellness-First Approach)
**🧘 Core Wellness Features (NOT optional)**:
- **Wellness tracking**: Mood before/after meals, energy levels, gratitude journaling
- **Contextual mindfulness**: Breathing during activities, meditation prompts, mindful moments
- **Post-meal reflections**: 30-min notifications with mood/energy tracking
- **Adaptive UI**: Colors and animations that respond to emotional state
- **Habit formation**: Streak tracking, gentle nudges, progress celebration

**✨ Essential Experience Features**:
- **Delightful animations**: Lottie success states, smooth transitions, breathing guides
- **Microinteractions**: Button feedback, loading states, swipe gestures
- **Haptic feedback**: Different patterns for different accomplishments
- **Beautiful onboarding**: Mindfulness education and wellness goal setting

**✅ Core Functionality**: Household setup, pantry tracking, meal planning, shopping integration  
**❌ Defer for V2**: Voice input, barcode scanning, community features, calorie scanning  
**📱 Experience**: Premium wellness app with animations, smooth UX, mindful design patterns

**🎯 Key Insight**: Wellness tracking IS the core value proposition, not an add-on feature

### 1) 🚀 Mindful Dependencies & Experience Setup (Day 1-2)
**Include mindfulness + animation essentials - these ARE the differentiators**
```bash
cd mobile-app
# Core functionality
npm i @react-navigation/native-stack @tanstack/react-query axios date-fns react-native-toast-message react-native-paper

# Mindfulness & Experience (ESSENTIAL for customer attraction)
npm i react-native-reanimated lottie-react-native react-native-haptic-feedback 
npm i @react-native-async-storage/async-storage react-native-linear-gradient
npm i react-native-chart-kit react-native-calendars
```
**🧘 Mindful Experience Setup**:
- Source 6-8 mindfulness Lottie animations (meditation, gratitude, success, breathing, meal completion)
- Set up Reanimated 3 for smooth microinteractions and delightful transitions
- Configure haptic feedback patterns for different actions
- Create mindful color palette with calming gradients
- iOS: `cd ios && pod install` + configure Lottie
- Android: Hermes + Reanimated + vector icons setup

### 2) 🌐 Simple Localization (Day 2)
**Start with English, add Hindi progressively**
- Basic i18n setup with 50 essential keys (onboarding, pantry, meals)
- Simple `useTranslation` hook returning `{ t, language: 'en' }`
- English-first approach, Hindi translation as enhancement

### 3) 🎨 UI Components (Day 3-4)
**Lean component architecture - direct Paper components preferred**
- **Strategy**: Use Paper components directly, avoid wrapper proliferation
- Refactor `HouseholdSetup` to use Paper `Button`, `TextInput`, `Card` directly
- Create only essential custom components:
  - `PantryItem` (styled list item with actions)
  - `EmptyState` (reusable empty state with icon + message)
  - `Toast` helper function (simple wrapper around toast library)
- **Skip for MVP**: Complex animated surfaces, floating action buttons

### 4) 🔌 Simple API Integration (Day 5-6)
**React Query + Mock-first approach**
- Basic axios client with simple error handling
- React Query setup with sane defaults (5min cache, 3 retries)
- **Essential hooks only**:
  - `useAuth` (login/logout)
  - `usePantryItems` (list/add/edit)
  - `useMealPlans` (generate/view)
- **Start with MSW mocks**, connect to real API when ready
- **Skip**: Complex state management (React Query handles most state)

### 5) 🧭 Minimal Navigation (Day 7)
**Simple stack navigation - defer complexity**
- **Core screens only**:
  - Onboarding → Household Setup
  - Main → Pantry List, Meal Planner, Shopping
  - Pantry → Add/Edit Item (modal or push)
- **Simple stack navigation** (no tabs, no deep linking yet)
- **Authentication guard**: redirect to login if not authenticated

### 6) 🧘 Mindful Pantry Feature (Week 2)
**Essential functionality + mindfulness integration**
- **Essential screens**: List, Add, Edit with mindful touches
- **Core features**: item name, quantity, expiry, category + gratitude notes
- **Mindful features**:
  - Gratitude moment when adding fresh ingredients with Lottie animation
  - Gentle expiry reminders with mindful language ("time to enjoy...")
  - Seasonal ingredient celebrations
  - Food waste awareness (gentle, not shameful)
  - Optional 30-second breathing exercise before grocery shopping
- **Simple search/filter**: text search, category filter with smooth transitions
- **Haptic feedback**: positive reinforcement for adding fresh items

### 7) 🍽️ Mindful Meal Planning (Week 2-3)
**Weekly planner with mindfulness integration**
- **Mindful meal picker**: recipes with mood/energy indicators
- **Weekly view**: 7 days, 3 meals + mindful check-ins
- **Mindful features**:
  - Pre-meal intention setting ("How do you want to feel after this meal?")
  - Post-meal reflection (energy level, satisfaction, gratitude)
  - Gentle portion awareness guidance
  - Mindful eating pace suggestions
  - Success celebrations with delightful animations
- **Smart suggestions**: recipes based on pantry + current mood/energy goals
- **Progress tracking**: mood/energy patterns, favorite mindful meals

### 8) 🛒 Quick Commerce Integration (Week 3)
**Simple external links - no complex integrations**
- **Shopping list**: generate from meal plan and pantry
- **External links**: open Blinkit/Zepto/Swiggy in browser/app
- **Simple sharing**: share shopping list as text
- **No cart integration** (too complex for MVP)

### 9) 🌟 Wellness Tracking & Insights (Week 3-4) ⭐ **CORE MVP FEATURE**
**This is NOT optional - it's what makes MindfulMeals unique**
- **Daily wellness check-ins**: Mood before/after meals, energy levels, digestion comfort
- **Visual wellness tracking**: Charts showing mood/energy patterns, gratitude streaks, meditation completion
- **Contextual insights**: "You feel best after Mediterranean meals", "Gratitude practice improved satisfaction"
- **Mindful moments integration**: 
  - Breathing exercises during natural pause points (loading, transitions, decision fatigue)
  - Meditation prompts based on stress detection and energy patterns
  - Gratitude journaling tied to actual meals and eating experiences
- **Progress celebration**: Streak tracking with Lottie rewards, achievement animations
- **Adaptive UI**: Colors and animations that respond to emotional state
- **Habit formation**: Gentle nudges, optimal timing, no guilt for skipping

**🎯 Success Metric**: 70% of users complete daily wellness check-ins by week 2

### 10) 🎨 Delightful Experience Polish (Week 4)
**Animations and microinteractions - essential for customer attraction**
**📋 Reference**: See `UI-UX-ENHANCEMENT-PLAN.md` for comprehensive animation and UX specifications

- **Mindful theme**: Calming gradients, warm colors, soft shadows (from design system tokens)
- **Key animations** (implement per UI-UX plan):
  - Onboarding flow with mindful education and breathing guides
  - Success moments with celebration animations and haptic feedback
  - Gentle transitions with breathing rhythm (inhale exit, exhale enter)
  - Loading states as mindfulness opportunities
- **Microinteractions**: Button breathing, scroll resistance, card selection patterns
- **Haptic patterns**: Different vibrations synchronized with breathing and accomplishments
- **Accessibility**: VoiceOver support, reduced motion respect, high contrast mode

### 10) 🧪 Essential Testing (Week 4)
**Focus on critical paths only**
- **E2E tests**: 3 core flows (onboarding, add pantry item, create meal plan)
- **Unit tests**: hooks and utility functions only
- **Manual testing**: 5 team members test core flows
- **Performance testing**: startup time, screen transitions

### 11) 🚀 Launch Setup (Week 5)
**Simple deployment strategy**
- **App store assets**: icon, splash screen, 3 screenshots
- **Simple analytics**: 5 key events (signup, add item, create plan, etc.)
- **Crash reporting**: Firebase Crashlytics (free tier)
- **Backend deployment**: Railway/Render + PostgreSQL
- **Beta testing**: 10-20 users, core features only

## 🎯 Priority Actions (This Week)
**Focus on getting the foundation solid**

### Day 1: Foundation
- [ ] Install missing deps (navigation, react-query, date-fns)
- [ ] Add `mobile-app/tsconfig.json`
- [ ] Verify builds on iOS/Android

### Day 2-3: Core Setup
- [ ] Basic i18n with 20 essential keys
- [ ] Simple API client + React Query setup
- [ ] Refactor `HouseholdSetup` to use Paper components directly

### Day 4-5: First Working Flow
- [ ] Wire authentication (login/logout with mock data)
- [ ] Basic pantry list screen with add/edit
- [ ] Simple navigation between screens

### End of Week Target
✅ **User can**: sign up → add pantry items → see meal suggestions
✅ **App**: builds cleanly, no crashes, basic functionality works

---

## 🚫 Deliberately Excluded from MVP
- Voice input/commands
- Barcode/QR scanning  
- Community features
- Calorie scanning
- Advanced AI features
- Offline synchronization

**Rationale**: Focus on core value proposition first. Add delighters after validating core usage.

## ✅ **WELLNESS TRACKING IS CORE MVP**
**Mindfulness features are NOT nice-to-have - they ARE the core differentiator**
- Wellness tracking (mood, energy, gratitude) = **ESSENTIAL**
- Contextual mindfulness (breathing, meditation) = **ESSENTIAL**  
- Beautiful animations and microinteractions = **ESSENTIAL**
- These features create the premium experience that justifies the app's existence

## 📋 **PLAN HIERARCHY & REFERENCES**
- **`UI-UX-ENHANCEMENT-PLAN.md`**: **DEFINITIVE** source for animations, UX flows, and user experience design
- **`TODO-3-CONTEXTUAL-MINDFULNESS.md`**: **DEFINITIVE** source for mindfulness feature specifications
- **`TODO-2.md`** (this file): Implementation details and technical approach
- **`TODO.md`**: High-level strategic roadmap and phases

**🎯 Implementation Rule**: Always check UI-UX plan first for design decisions, TODO-3 for mindfulness features
