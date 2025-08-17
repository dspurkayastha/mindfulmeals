### MindfulMeals - Elegant Implementation Plan

**Core Philosophy**: Build the minimum viable delightful experience. Every feature must earn its place.

### 🎯 MVP Feature Scope (Keep Simple)
**✅ Include**: Household setup, pantry tracking, meal planning, shopping integration  
**❌ Defer**: Voice input, barcode scanning, community features, wellness tracking, calorie scanning  
**🔄 Progressive**: Add advanced features based on user feedback post-launch

### 1) 🚀 MVP Dependencies & Setup (Day 1)
**Essential only - no feature creep**
```bash
cd mobile-app
npm i @react-navigation/native-stack @tanstack/react-query axios date-fns react-native-toast-message react-native-paper
# Skip for MVP: voice, camera, sharing - add later if users want them
```
- Add `mobile-app/tsconfig.json` extending `@tsconfig/react-native`
- Basic Lottie success animation (small, optimized)
- iOS: `cd ios && pod install`
- Android: verify Hermes enabled, basic setup
- Test: app builds and runs on both platforms

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

### 6) 📦 Core Pantry Feature (Week 2)
**Focus on essentials - manual entry first**
- **Essential screens**: List, Add, Edit (simple forms)
- **Basic features**: item name, quantity, expiry date, category
- **Simple search/filter**: text search, category filter
- **Manual entry only** (skip barcode scanning for MVP)
- **Visual indicators**: expiring soon, low stock (simple styling)

### 7) 🍽️ Simple Meal Planning (Week 2-3)
**Basic weekly planner - no AI complexity yet**
- **Simple meal picker**: select from predefined recipes
- **Weekly view**: 7 days, 3 meals per day
- **Basic actions**: replace meal, mark as cooked
- **Recipe suggestions**: based on available pantry items (simple matching)
- **Defer**: AI generation, complex optimization, sharing

### 8) 🛒 Quick Commerce Integration (Week 3)
**Simple external links - no complex integrations**
- **Shopping list**: generate from meal plan and pantry
- **External links**: open Blinkit/Zepto/Swiggy in browser/app
- **Simple sharing**: share shopping list as text
- **No cart integration** (too complex for MVP)

### 9) 🎨 Polish & Launch Prep (Week 4)
**Make it feel polished, not complex**
- **Theme**: Paper default theme with brand colors (warm, mindful palette)
- **Icons**: Material Icons (already included, consistent)
- **Accessibility**: basic labels, 44px touch targets, test with VoiceOver
- **Performance**: list virtualization, image optimization
- **Error boundaries**: basic crash protection

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
