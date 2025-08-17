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
- Engagement: 3+ daily breathing exercises; 60% post-meal reflection completion; 40% meditation acceptance; 2+ gratitude entries/day
- Wellness: +20% meal satisfaction; -30% cooking stress; 50% mindful eating adoption; positive energy trend
- Retention: 70% 7‑day, 50% 30‑day; 80% feature discovery in week 1
- Technical: 60fps animations; <3s startup; crash‑free mindfulness flows; high notification delivery rate

---

## End-to-End Roadmap (Unified by Weeks)

### Week 1 — Foundations (FE/BE in parallel)
- Repo hygiene & CI (from `TODO.md` Phase 0/1/2)
  - CI gates (typecheck, lint, unit), CONTRIBUTING.md, minimal ADRs
  - Backend: Auth essentials, core CRUD (households, pantry, meal plans), zod validation, health endpoints, seeds
  - Performance baseline and Swagger UI (dev only)
- Mobile core setup (from `TODO-2.md` Days 1–7)
  - Install deps: navigation, React Query, axios, date-fns, Paper, Reanimated, Lottie, haptics, AsyncStorage, gradients, charts, calendars
  - Verify iOS/Android builds; minimal i18n (20–50 keys)
  - React Query provider; axios client; basic hooks: `useAuth`, `usePantryItems`, `useMealPlans`
  - Navigation: Onboarding → Household Setup → Main (Pantry, Meal Planner, Shopping)
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
  - Post‑Meal Reflections: schedule local notifications 30 min post‑meal; component for mood (energized/satisfied/heavy/still‑hungry), energy (1–5), gratitude text; optional photo
- Gratitude Micro‑Moments (initial)
  - Long‑press meal card → quick gratitude overlay; haptic + save celebration

Acceptance for Week 2
- Pantry breather logic live; at least one cooking or loading breathing flow merged
- Notifications request flow; a complete post‑meal reflection saved locally
- Quick gratitude works on meal cards

### Week 3 — Smart Integration & Micro‑Wellness
- Stress Detection & Smart Triggers (from `TODO-3` + `UI-UX` Phase 3)
  - Instrument navigation speed, time‑on‑screen, rushed scrolling, decision‑fatigue (10+ min)
  - Trigger micro‑meditations: afternoon energy dip, pre‑meal, post‑lunch digestion, evening reflection
- Visual Gratitude Journal
  - Timeline with meal photos, moods, energy; weekly highlights summary
  - Shareable gratitude cards (basic)
- Micro‑Wellness & Celebrations
  - Ingredient gratitude toasts; seasonal celebration overlays
  - MicroCelebration component (first milestones: 10 items organized, first meal planned, streak)

Acceptance for Week 3
- At least two smart meditation triggers live and controllable (enable/disable)
- Gratitude timeline renders and persists data
- Celebration moments visible for 2+ milestones

### Week 4 — Adaptive Experience, Accessibility, Performance
- Adaptive UI System (from `Frontend-dev-enhancement-plan.md` Week 3/4)
  - AdaptiveTheme provider: mood → colors; stressed → softer palette; grateful → warm tones; low energy → energizing colors
  - Dynamic suggestions: subtle copy nudges, slow‑down reminders
- Animation System & Assets (from `UI-UX` Phase 4/Polish)
  - Lottie sources: breathing-circle, gratitude-heart, celebration-particles, gentle-waves, mindful-transitions
  - Transition animations; mindful error recovery with gentle waves; reduced motion paths
- Accessibility Audit
  - VoiceOver labels for mindful components; touch targets ≥44px; high contrast; text size adaptation; haptic alternatives
- Performance
  - Native driver for breathing; list virtualization; lazy‑load heavy components; cache haptic patterns

Acceptance for Week 4
- AdaptiveTheme switches at runtime with at least two mood states
- All loaders use mindful breathing animations; error boundaries are mindful
- 60fps maintained on key screens; reduced motion respected

### Week 5 — Security, QA, Launch Prep
- Security & Privacy
  - Secure token storage; privacy policy for wellness data; mindful copy review
- Error Handling & Recovery
  - Mindful error boundaries; 3‑breath recovery; offline queue for reflections
- Testing & QA
  - E2E flows: onboarding → first meal plan; pantry add → meal generation; cooking → post‑meal reflection
  - Notification scheduling verified; cross‑device; offline cases
- Store & Release
  - Icon, splash with breathing cue; screenshots; description emphasizing contextual mindfulness
  - EAS production build; submit to stores; beta announcement

Acceptance for Week 5
- Green E2E on core flows; crash‑free mindfulness flows in test cohort
- Production builds submitted with store assets

---

## Cross‑Cutting Requirements (Always On)
- Skippable: Every mindful prompt can be dismissed without penalty
- Language: Encouraging, non‑judgmental; celebrates small wins
- Privacy: Local‑first for reflections/moods; opt‑in sharing only
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
- Reflections, moods, energy: stored locally by default; export on demand
- Insights: on‑device calculations; avoid external transmission for MVP

---

## Acceptance Criteria per Core Feature
- MindfulLoader: Replaces all core loading states with breathing rhythm; respects reduced motion
- Pantry Breather Button: Appears after 5 minutes organizing; animated pulse; “skip for now”; no guilt
- Post‑Meal Reflection: 30‑minute local notification; mood, energy, gratitude; optional photo; local persistence
- Cooking Breathing Timer: Circular progress synced to cook time; inhale/exhale cues; background timer support; gentle chime
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