# MindfulMeals — Master Implementation Plan

This master plan consolidates and reconciles the following definitive sources:
- Frontend development roadmap: `Frontend-dev-enhancement-plan.md`
- Design/UX and animations: `UI-UX-ENHANCEMENT-PLAN.md`
- Mindfulness features: `TODO-3-CONTEXTUAL-MINDFULNESS.md`
- Implementation details and technical approach: `TODO-2.md`
- Strategic overview and phases: `TODO.md`

---

## Core Philosophy
Mindfulness is woven into the natural flow of meal planning — never a separate wellness app. Every mindful moment is contextual, skippable, and free of judgment, emphasizing celebration over correction.

## MVP Definition (Unified)
- Must Have (Weeks 1–2)
  1) Contextual breathing (pantry, cooking, loading)
  2) Post-meal reflection + 30-minute notification
  3) Basic gratitude input (quick prompt + local storage)
  4) Mindful loading states (breathing rhythm replacing generic spinners)
- Should Have (Weeks 3–4)
  1) Stress detection + smart meditation triggers
  2) Visual gratitude journal (timeline + weekly highlights)
  3) Micro-wellness celebration moments
  4) Adaptive UI basics (mood/energy-informed)
- Nice to Have (Post-launch)
  - Voice gratitude, advanced insights, social sharing, meditation library

## Architectural & Experience Guardrails
- Mobile: React Native (TypeScript), Expo/EAS Build
- Navigation: React Navigation stack-first (tabs optional later), deep links post-MVP
- State: React Query for server data, AsyncStorage for local wellness data
- Animations: Reanimated 3 + Lottie, haptics cached for instant feedback
- Design system: React Native Paper + minimal custom atoms
- Accessibility: VoiceOver/TalkBack, >44px targets, reduced motion, high contrast
- Privacy: Local-first for moods/reflections; sensitive data opt-in; no guilt in copy

## Success Metrics (Aggregated)
- Engagement: 3+ daily breathing exercises; 60% post-meal reflection completion; 40% meditation acceptance; 2+ gratitude entries/day; 70% daily wellness check‑ins by week 2
- Wellness: +20% meal satisfaction; -30% cooking stress; 50% mindful eating adoption; positive energy trend
- Retention: 70% 7‑day, 50% 30‑day; 80% feature discovery in week 1
- Technical: 60fps animations; <3s startup; crash‑free mindfulness flows; high notification delivery rate; offline functionality usage

---

## End-to-End Roadmap (Unified by Weeks)

### Week 1 — Foundations (FE/BE in parallel)
- Repo hygiene & CI (from `TODO.md` Phase 0/1/2)
  - CI gates (typecheck, lint, unit), CONTRIBUTING.md, minimal ADRs
  - Backend: Auth essentials (login/logout, token refresh), core CRUD (households, pantry, meal plans), zod validation, health endpoints, seeds (1 test household, 10 recipes), simple rate limiting (express-rate-limit), basic OpenAPI docs (Swagger UI for dev)
  - Environment secrets: use .env now; plan migration to secrets manager (Doppler/Vault); typed env loader per service using zod
  - Performance baseline target: <500ms typical API latency for core endpoints
- Mobile core setup (from `TODO-2.md` Days 1–7)
  - Install deps: navigation, React Query, axios, date-fns, Paper, Reanimated, Lottie, haptics, AsyncStorage, gradients, charts, calendars
  - Platform setup: iOS `cd ios && pod install` + Lottie config; Android enable Hermes + Reanimated + vector icons
  - Verify iOS/Android builds; minimal i18n (20–50 keys)
  - React Query provider; axios client; sane defaults (5 min cache, 3 retries)
  - Basic hooks: `useAuth`, `usePantryItems`, `useMealPlans`
  - Navigation: Onboarding → Household Setup → Main (Pantry, Meal Planner, Shopping)
  - Mindful onboarding: short education, breathing guide preview, wellness goal selection (encouraging language)
  - UI components: Refactor `HouseholdSetup` to use Paper components directly; create essential atoms only (`PantryItem`, `EmptyState`, `Toast` helper); avoid wrapper proliferation; skip complex animated surfaces and FABs for MVP
  - API integration approach: React Query with MSW mocks first; connect to real API when ready
  - Auth guard: redirect unauthenticated users to login
  - First working flow: login → add pantry item → view meal suggestions
- UX seeds (from `UI-UX-ENHANCEMENT-PLAN.md` Phase 1)
  - Mindful Moments system scaffolding (types, registry, trigger surface)
  - Replace generic loaders with MindfulLoader v0 (breathing dots/circle)

Acceptance for Week 1
- App builds on both platforms; onboarding → pantry → meal suggestions works
- Backend core endpoints available; basic E2E happy path passes
- MindfulLoader replaces at least one critical loading state

### Week 2 — Contextual Mindfulness Foundation
- Pantry + Contextual Breathing (from `Frontend-dev-enhancement-plan.md` Week 2)
  - Pantry list with search/filter and category transitions
  - FloatingBreatherButton: appears after 5 minutes organizing; pulse animation; skip without guilt
  - Pull‑to‑refresh with mindful message; add/remove item animations
- Core Mindfulness Components
  - MindfulLoader v1 (4‑4‑4 rhythm; calming transitions)
  - Post‑Meal Reflections: schedule local notifications 30 min post‑meal; component for mood (energized/satisfied/heavy/still‑hungry), energy (1–5), gratitude text; optional photo or voice note
  - Notification handler service: local notification setup and foreground/background handling (iOS/Android)
  - Breathing exercise modal: launched by FloatingBreatherButton; smooth fade‑in; optional progress tracking
- Gratitude Micro‑Moments (initial)
  - Long‑press meal card → quick gratitude overlay; haptic + save celebration
  - Contextual gratitude prompts: Morning, Pre‑meal, Post‑meal, Evening
  - Local gratitude storage: persist entries locally by default
- Cooking Integration
  - `CookingBreathingTimer`: circular progress, inhale/exhale cues, background timer support, gentle completion chime
  - Integrate with recipe/meal screens; add cooking mode UI adaptations

Acceptance for Week 2
- Pantry breather logic live; at least one cooking or loading breathing flow merged
- Notifications request flow; a complete post‑meal reflection saved locally
- Quick gratitude works on meal cards

### Week 3 — Smart Integration & Micro‑Wellness
- Mindful Meal Planning Enhancements
  - Pre‑meal intention setting (“How do you want to feel after this meal?”)
  - Mindful eating pace suggestions; gentle portion awareness guidance
  - Smart recipe suggestions based on pantry + mood/energy goals
  - Progress tracking: mood/energy patterns; favorite mindful meals
- Stress Detection & Smart Triggers (from `TODO-3` + `UI-UX` Phase 3)
  - Instrument navigation speed, time‑on‑screen, rushed scrolling, decision‑fatigue (10+ min)
  - Trigger micro‑meditations: afternoon energy dip, pre‑meal, post‑lunch digestion, evening reflection
  - Notifications are gentle and skipped if the user is actively using the app
- Visual Gratitude Journal
  - Timeline with meal photos, moods, energy; weekly highlights summary
  - Smooth scrolling with dates; shareable gratitude cards (basic)
- Micro‑Wellness & Celebrations
  - Ingredient gratitude toasts; seasonal celebration overlays
  - “Where did this come from?” ingredient provenance prompts
  - MicroCelebration component (first milestones: 10 items organized, first meal planned, streak)
- Contextual Insights & Weekly Wellness Report
  - On‑device insights engine (e.g., “You feel best after Mediterranean meals”, “Energy dips at 3 PM”)
  - Weekly wellness report with mood/energy charts and mindful practice summary
- Wellness Widgets (Inline Indicators)
  - Mood indicator in navigation; energy meter in meal planner; gratitude count in profile; breathing streak in pantry; mindfulness score in settings
- Micro‑Interactions (Breathing Patterns)
  - Button press expand/contract; page transition inhale/exhale; scroll resistance at pause points; card selection haptic patterns
  - Breathing‑synchronized haptic patterns for key interactions
- Habit Formation
  - Streak tracking (non‑pressuring), gentle nudges at optimal times
- Daily Wellness Check‑ins
  - Mood before/after meals, energy, digestion comfort; simple visualizations of patterns

Acceptance for Week 3
- At least two smart meditation triggers live and controllable (enable/disable)
- Gratitude timeline renders and persists data
- Celebration moments visible for 2+ milestones
- Insights engine generates at least two contextual tips; weekly report view exists

### Week 4 — Adaptive Experience, Accessibility, Performance
- Shopping Integration (from `Frontend-dev-enhancement-plan.md` Week 4)
  - Shopping list generation from meal plans
  - Mindful shopping features: pre‑shopping centering breath, ingredient appreciation prompts, seasonal highlights
  - External app links (Blinkit/Zepto/Swiggy); shareable shopping list format
- Adaptive UI System (from `Frontend-dev-enhancement-plan.md` Week 3/4)
  - AdaptiveTheme provider: mood → colors; stressed → softer palette; grateful → warm tones; low energy → energizing colors
  - Dynamic suggestions: subtle copy nudges, slow‑down reminders
- Animation System & Assets (from `UI-UX` Phase 4/Polish)
  - Lottie sources: breathing-circle, gratitude-heart, celebration-particles, gentle-waves, mindful-transitions
  - Transition animations; mindful error recovery with gentle waves; reduced motion paths
  - Celebration particles for positive moods
- Accessibility Audit
  - VoiceOver labels for mindful components; touch targets ≥44px; high contrast; text size adaptation; haptic alternatives
- Performance
  - Native driver for breathing; list virtualization; lazy‑load heavy components; cache haptic patterns
  - Reduce bundle size
- Quality
  - Essential unit tests for critical hooks and utilities; TypeScript coverage report (aim for >90%)

Acceptance for Week 4
- AdaptiveTheme switches at runtime with at least two mood states
- All loading states replaced with MindfulLoader breathing animations; error boundaries are mindful
- 60fps maintained on key screens; reduced motion respected

### Week 5 — Security, QA, Launch Prep
- Security & Privacy
  - Secure token storage; privacy policy for wellness data; mindful copy review
  - Remove all console statements
- Error Handling & Recovery
  - Mindful error boundaries; 3‑breath recovery; offline queue for reflections
- Testing & QA
  - E2E flows: onboarding → first meal plan; pantry add → meal generation; cooking → post‑meal reflection
  - Notification scheduling verified; cross‑device; offline cases
  - Crash reporting: Crashlytics set up with privacy‑conscious configuration
  - Essential analytics: 5 key events (signup, add item, create plan, reflection, meditation)
- Store, Deploy & Release
  - Icon, splash with breathing cue; screenshots; description emphasizing contextual mindfulness and “natural, contextual mindfulness”
  - Backend deployment: Docker + Railway/Render (simple CI/CD)
  - EAS production build; submit to stores; beta test with 10–20 users; launch announcement

Acceptance for Week 5
- Green E2E on core flows; crash‑free mindfulness flows in test cohort
- Production builds submitted with store assets; beta cohort onboarded
- Verify skip/dismiss options across all mindful prompts and flows; copy adheres to “no guilt” principle
- Verify celebration moments trigger correctly

---

## Cross‑Cutting Requirements (Always On)
- Skippable: Every mindful prompt can be dismissed without penalty
- Language: Encouraging, non‑judgmental; celebrates small wins
- Privacy: Local‑first for reflections/moods; opt‑in sharing only
- Notifications: Gentle, adaptive timing; skipped when user is active
- Observability: Minimal privacy‑respecting analytics for feature usage

## Dependencies & Assets (Consolidated)
- Packages (mobile):
  - Navigation, React Query, axios, date-fns, react-native-paper
  - Animations: react-native-reanimated, lottie-react-native, react-native-haptic-feedback
  - Storage/visuals: @react-native-async-storage/async-storage, react-native-linear-gradient, react-native-chart-kit, react-native-calendars
  - Notifications/timers/media (as needed): react-native-push-notification, react-native-background-timer, react-native-voice, react-native-share, react-native-blur
- Animation assets: breathing-circle.json, gratitude-heart.json, celebration-particles.json, gentle-waves.json, mindful-transitions.json
- Optional sounds: gentle-chime.wav, breathing-guide.mp3, celebration.wav, meditation-bell.mp3

## Data & Privacy
- Reflections, moods, energy, and gratitude entries: stored locally by default; export on demand
- Insights: on‑device calculations; avoid external transmission for MVP

---

## Acceptance Criteria per Core Feature
- MindfulLoader: Replaces all core loading states with breathing rhythm; respects reduced motion; selects short/medium/long content by duration thresholds (<3s, 3–10s, >10s)
- Pantry Breather Button: Appears after 5 minutes organizing; animated pulse; “skip for now”; no guilt
- Post‑Meal Reflection: 30‑minute local notification; mood, energy, gratitude; optional photo/voice note; local persistence
- Cooking Breathing Timer: Circular progress synced to cook time; inhale/exhale cues; background timer support; gentle chime; visible breath counter
- Stress Detection & Smart Triggers: Detect rushed patterns and time‑based dips; triggers are gentle; always skippable
- Gratitude Journal: Timeline with photos/moods/energy; weekly highlights; shareable card
- AdaptiveTheme: Color palettes adapt to mood/stress; dynamic copy nudges
- Mindful Error Boundaries: “Let’s pause together” copy; 3‑breath recovery; retry option

---

## Risks & Mitigations
- Animation performance on low‑end devices → Prefer native driver, reduce Lottie complexity, lazy‑load heavy assets
- Notification fatigue → Adaptive, gentle reminders; easy snooze/disable
- Privacy concerns → Local‑first data; transparent policy; no default cloud sync
- Scope creep in UI polish → Time‑box polish; lean on Paper; prioritize mindful impact

---

## Technical Debt & Future Enhancements
- Immediate Technical Debt
  - Refactor navigation to support deep linking
  - Comprehensive structured logging system (privacy‑conscious)
  - Design system documentation; component library setup (Storybook)
- Future Enhancements (Post‑Launch)
  - Voice‑guided meditations; meditation library
  - Apple Health / Google Fit integration; export to health apps
  - Social sharing of gratitude moments; community gratitude wall
  - Personalized mindfulness recommendations; advanced mood pattern analysis
  - Meal photo AI analysis for portion awareness
  - Nutritionist consultation integration

---

## Prioritized Task Sequence (with Dependencies & Weekly Targets)

P0 — Repo/Platform Foundations (Week 1)
- CI, lint, typecheck; CONTRIBUTING.md, ADRs
- Mobile deps + build verification; Backend health endpoints, seeds
- Replace at least one loader with MindfulLoader v0

Dependencies: none

P1 — Core Mindfulness Footing (Week 2)
- Pantry breather button + pantry list refinements
- MindfulLoader v1 across key flows; post‑meal notification + reflection component
- Quick gratitude (long‑press meal card)

Dependencies: P0 (navigation, hooks, basic screens, notifications permission)

P2 — Smart Integration & Journal (Week 3)
- Stress detection instrumentation + two smart triggers
- Gratitude timeline + weekly highlights; shareable card (basic)
- Celebration moments (≥2 milestones)

Dependencies: P1 (mindful components and data capture); backend CRUD in place

P3 — Adaptive Experience & Resilience (Week 4)
- AdaptiveTheme provider; mindful error boundaries with breathing recovery
- Animation system + assets; accessibility audit; performance tuning (60fps)

Dependencies: P2 (mood/energy data present); Lottie assets available

P4 — Security, QA, and Launch Prep (Week 5)
- Secure token storage; privacy policy; copy review
- E2E tests on core flows; notification QA; offline queue for reflections
- Store assets; EAS production builds; submissions

Dependencies: P3 (stable features), green CI

Stretch (Post‑Launch)
- Voice gratitude; advanced insights; community sharing; meditation library; Apple Health/Google Fit

Weekly Targets Snapshot
- Week 1: Foundations complete; first mindful loader live
- Week 2: Pantry breathing, post‑meal reflections, quick gratitude live
- Week 3: Smart triggers + gratitude journal + celebrations live
- Week 4: Adaptive UI + mindful errors + perf/accessibility complete
- Week 5: Security/QA finalized; store assets; production builds submitted

---

## Deliberately Excluded from MVP
- Voice input/commands
- Barcode/QR scanning
- Community features
- Calorie scanning
- Advanced AI features
- Deep linking (until post‑MVP)
- Offline synchronization (beyond local persistence for wellness data)

---

## Post‑Launch Iteration
- Beta cohort feedback loop focusing on mindfulness flows
- Weekly iteration cadence informed by mindful metrics (breathing completion, reflection rate, gratitude entries)
- Progressive enhancement of animations and micro‑interactions without regressions in performance/accessibility