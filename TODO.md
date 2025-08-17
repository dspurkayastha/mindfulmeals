# MindfulMeals Development Roadmap - Elegant & Focused

**Philosophy**: Build elegantly, ship fast, iterate wisely. Avoid overengineering.

Status key: [ ] pending, [~] in progress, [x] done, [🚀] next focus

## Phase 0 — Foundation & Hardening (0.5–1 week)
- [x] Enable TypeScript strict mode repo-wide (verify all packages)
- [x] Add ESLint, Prettier, root config, and fixers
- [x] Set up Husky + lint-staged + commitlint
- [x] Add .env.example and ignore real .env files
- [ ] Add CONTRIBUTING.md and basic ADR(s)
- [ ] Enforce CI quality gates (typecheck, lint, unit)

## Phase 1 — Backend Essentials (1 week) 🚀
- [x] Switch all services to TypeORM DataSource initialization
- [x] Wire repository injection (User, Meal Planning, Inventory)
- [x] Harden auth: remove JWT fallbacks, require env secrets
- [x] Add typed env loaders (zod) per service
- [🚀] Simple health endpoints: `/health` and `/ready` (basic DB ping)
- [🚀] Core migrations + minimal seed data (1 test household, 10 recipes)
- [ ] Environment secrets (start with .env, upgrade to Doppler/Vault later)

## Phase 2 — Core APIs (2 weeks)
- [🚀] Auth essentials: login/logout, token refresh (skip email verify for MVP)
- [🚀] Core CRUD: households, pantry items, meal plans (basic endpoints)
- [🚀] Input validation with zod schemas (reuse between FE/BE)
- [ ] Simple rate limiting (express-rate-limit, sensible defaults)
- [ ] Basic OpenAPI docs (Swagger UI for dev team)
- [ ] Performance baseline (aim for <500ms, optimize later)

## Phase 3 — Mobile Core (1.5 weeks)
- [🚀] Simple API client (axios + React Query, no interceptors yet)
- [🚀] Basic auth flow (AsyncStorage for MVP, Keychain later)
- [🚀] Connect 3 key screens: onboarding, pantry list, meal planner
- [🚀] Simple navigation (stack navigation, no deep links yet)
- [ ] Skeleton loading states (3-4 key screens)
- [ ] Optimistic updates for add/edit actions

## Phase 4 — Quality Essentials (1 week, parallel with development)
- [🚀] Essential tests: critical hooks and utils only
- [🚀] Basic E2E: login → add pantry item → generate meal plan
- [🚀] Accessibility basics: labels and touch targets (automated tools)
- [ ] Remove console.log statements
- [ ] Basic error boundaries and crash handling
- [ ] TypeScript coverage report (aim for >90%)

## Phase 5 — Security & Performance (1 week, before launch)
- [ ] Secure token storage (Keychain/Keystore)
- [ ] HTTPS enforcement and basic cert validation
- [ ] Basic privacy policy and data handling docs
- [ ] Performance optimization: Hermes, list virtualization
- [ ] Crash reporting (Crashlytics - free, simple)
- [ ] Basic analytics events (5-10 key events max)

## Phase 6 — Launch Preparation (1 week)
- [ ] Simple deployment: Docker + Railway/Render for backend
- [ ] Basic CI/CD: GitHub Actions (build/test/deploy)
- [ ] EAS Build setup for mobile (managed workflow)
- [ ] Store assets: app icon, splash screen, 3 screenshots
- [ ] Internal testing: 5 users, core flows
- [ ] Release planning: soft launch strategy

## Phase 7 — Launch & Iterate (ongoing)
- [ ] Beta launch: 50 users maximum
- [ ] Monitor key metrics: crash rate, core user journeys
- [ ] Weekly iterations based on user feedback
- [ ] Plan v1.1 features based on actual usage patterns

## 🎯 Success Criteria (Pre-Launch)
- [ ] TypeScript clean, zero linting errors
- [ ] Core user flow works end-to-end (tested by 5 people)
- [ ] App starts in <3s, core screens load in <1s
- [ ] Zero crashes in happy path testing
- [ ] Basic accessibility compliance (automated + manual spot checks)

## 🚀 Launch-First Mindset
**Ship early, learn fast, iterate wisely**
- Start with 80% feature completeness
- Focus on 3 core flows: onboarding, pantry, meal planning
- Defer nice-to-haves: voice input, barcode scanning, community features
- Use progressive enhancement: add advanced features post-launch

## 👥 Team Focus Areas
- **Frontend**: React Native app, user experience, mobile interactions
- **Backend**: API design, data persistence, authentication
- **Full-Stack**: End-to-end integration, deployment, monitoring
- **UX**: User testing, design iteration, accessibility