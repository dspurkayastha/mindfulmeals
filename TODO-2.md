### MindfulMeals - Elegant Implementation Plan

**Core Philosophy**: Build the minimum viable delightful experience. Every feature must earn its place.

### 🎯 MVP Feature Scope (Mindful-First Approach)
**🧘 Contextual Mindfulness Features (Woven Throughout)**:
- Post-meal reflections (30 min notification: mood, energy, gratitude)
- Breathing during activities (pantry organizing, cooking, loading)
- Smart meditation prompts (stress detection, energy dips, meal times)
- Micro-gratitude moments (ingredient appreciation, meal completion)
- Adaptive UI based on emotional state (colors, animations, suggestions)

**✨ Essential Experience Features**:
- Delightful animations (Lottie success states, smooth transitions)
- Microinteractions (button feedback, loading states, swipe gestures)
- Haptic feedback for key actions
- Beautiful onboarding with mindfulness education

**✅ Core Functionality**: Household setup, pantry tracking, meal planning, shopping integration  
**❌ Defer for V2**: Voice input, barcode scanning, community features, calorie scanning  
**📱 Experience**: Premium feel with animations, smooth UX, mindful design patterns

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

### 9) 🌟 Wellness Tracking & Insights (Week 3-4) 
**The key differentiator - mindful eating insights**
- **Daily check-ins**: Mood before/after meals, energy levels, digestion comfort
- **Visual tracking**: Simple charts showing mood/energy patterns over time
- **Gentle insights**: "You seem happier after home-cooked meals" (no judgment, just observation)
- **Mindful moments**: 
  - Daily gratitude for food journal
  - Simple breathing exercises (3-5 minutes)
  - Mindful eating reminders and tips
- **Progress celebration**: Streak tracking for mindful practices with Lottie rewards
- **Health guidance**: Gentle suggestions based on patterns (not medical advice)

### 10) 🎨 Delightful Experience Polish (Week 4)
**Animations and microinteractions - essential for customer attraction**
- **Mindful theme**: Calming gradients, warm colors, soft shadows
- **Key animations**: 
  - Onboarding flow with mindful education
  - Success moments (completed meals, gratitude entries, breathing exercises)
  - Gentle transitions between screens
  - Loading states with breathing rhythm
- **Microinteractions**: Button press feedback, swipe gestures, tab transitions
- **Haptic patterns**: Different vibrations for different accomplishments
- **Accessibility**: VoiceOver support, sufficient contrast, 44px targets

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
- Wellness tracking
- Calorie scanning
- Complex animations
- Advanced AI features
- Offline synchronization

**Rationale**: Focus on core value proposition first. Add delighters after validating core usage.
