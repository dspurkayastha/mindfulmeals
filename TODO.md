# MindfulMeals Production Readiness TODO (Phase-wise)

Status key: [ ] pending, [~] in progress, [x] done

## Phase 0 — Foundation & Hardening (0.5–1 week)
- [x] Enable TypeScript strict mode repo-wide (verify all packages)
- [x] Add ESLint, Prettier, root config, and fixers
- [x] Set up Husky + lint-staged + commitlint
- [x] Add .env.example and ignore real .env files
- [ ] Add CONTRIBUTING.md and basic ADR(s)
- [ ] Enforce CI quality gates (typecheck, lint, unit)

## Phase 1 — Fix Service Dependencies (1–2 weeks)
- [x] Switch all services to TypeORM DataSource initialization
- [x] Wire repository injection (User, Meal Planning, Inventory)
- [x] Harden auth: remove JWT fallbacks, require env secrets
- [x] Add typed env loaders (zod) per service
- [ ] Migrations + seed data for core entities
- [ ] Health/readiness endpoints per service
- [ ] Secrets management (GitHub Secrets/Doppler/Vault) for staging/prod

## Phase 2 — Complete Core Backend Features (3–4 weeks)
- [ ] Auth endpoints: register/login/logout, refresh, password reset, email verify
- [ ] DB integration: constraints, indexes, pagination patterns
- [ ] Finish meal planning domain: validation, idempotent writes, audit
- [ ] Rate limiting, input validation, structured logging, error taxonomy
- [ ] OpenAPI schema and publish; typed client generation
- [ ] Basic load test baseline + SLOs (e.g., p95 < 300ms)

## Phase 3 — Mobile App Integration (2–3 weeks)
- [ ] API client wrapper with interceptors
- [ ] TanStack Query for server state; Zustand for UI state
- [ ] Auth flow + secure storage + token refresh
- [ ] Navigation with deep/universal links; guards
- [ ] Connect screens to data; skeleton loaders; optimistic updates
- [ ] Offline cache (MMKV) and retry policies

## Phase 4 — Testing & Quality (2–3 weeks, start early)
- [ ] Jest + React Native Testing Library; hooks/util tests
- [ ] Contract tests vs mock server; MSW
- [ ] E2E with Detox/Maestro (auth, onboarding, planner)
- [ ] Accessibility checks (VoiceOver/TalkBack, 44px targets)
- [ ] Remove console.log; structured logger + levels
- [ ] Static analysis: type coverage, secret scan, SCA, CodeQL

## Phase 5 — Security, Privacy & Compliance (1–2 weeks, parallel)
- [ ] Token storage in secure storage; enforce HTTPS/TLS
- [ ] Certificate pinning (where feasible)
- [ ] PII minimization; retention policy; DSR (export/delete)
- [ ] Privacy nutrition labels; ATT if tracking
- [ ] (Optional) Jailbreak/root detection

## Phase 6 — Observability & Analytics (1 week, parallel)
- [ ] Crash reporting (Sentry/Crashlytics)
- [ ] Analytics taxonomy + events (Amplitude/Segment/Firebase)
- [ ] Backend logs/metrics/traces (OTel); dashboards + alerts

## Phase 7 — Performance, Offline & Resilience (1–2 weeks, parallel)
- [ ] Enable Hermes, Reanimated; startup/memory profiling (Flipper)
- [ ] Performance budgets (cold start <2s; TTI <3s); list virtualization
- [ ] Offline/background sync and conflict rules (if needed)

## Phase 8 — Infrastructure & Deployment (2–3 weeks)
- [ ] Finalize Docker + docker-compose for local
- [ ] Environments: dev/staging/prod with isolated resources
- [ ] Feature flags (ConfigCat/LD or custom)
- [ ] CI/CD: backend (build/test/scan/deploy with migrations)
- [ ] CI/CD: mobile (EAS Build/Update or Fastlane); signing automation
- [ ] OTA channel strategy (dev/preview/prod) + rollback

## Phase 9 — Release Management & Store Readiness (1–2 weeks)
- [ ] Beta via TestFlight and Play internal/closed
- [ ] Store assets: icons, splash, screenshots, videos, metadata
- [ ] Privacy/data safety forms; SDK disclosures
- [ ] Versioning/semver and changelog automation

## Phase 10 — Cutover, Launch & Post‑Launch (1 week + ongoing)
- [ ] Feature freeze; RC build; smoke tests
- [ ] Staged rollout (5% → 25% → 100%)
- [ ] On‑call, incident runbook, hotfix playbook
- [ ] Monitor crash‑free %, key funnels; plan v1.1

## Quality Gates (pre‑GA)
- [ ] Typecheck/lint clean; unit ≥80% critical modules; E2E passing
- [ ] Crash‑free sessions ≥99.5% in beta; p95 latency targets met
- [ ] No high/critical vulnerabilities; privacy forms complete
- [ ] Staged rollout + rollback tested; observability dashboards green

## Owners (RACI)
- Mobile: app integration, state, navigation, tests, store prep
- Backend: APIs, DB, auth, OpenAPI, observability, SLOs
- DevOps: CI/CD, IaC, environments, alerts, EAS/Fastlane
- QA: test plans, device matrix, accessibility, E2E
- Design/PM: design system, assets, copy, analytics taxonomy, release notes