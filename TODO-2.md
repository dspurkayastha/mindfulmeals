### Step-by-step plan to complete the app

1) Stabilize build and app shell
- Install missing/core deps:
```bash
cd /workspace/mobile-app
npm i @react-navigation/native-stack @tanstack/react-query axios date-fns react-native-toast-message
# For scanning/voice/sharing (planning to implement):
npm i react-native-permissions react-native-vision-camera vision-camera-code-scanner react-native-voice react-native-share
```
- Add `mobile-app/tsconfig.json` extending `@tsconfig/react-native`.
- Add `src/assets/lottie/success.json` (temporary placeholder) to satisfy Lottie import.
- iOS: run pods; Android: initialize Android project and configure (Reanimated, Hermes, permissions, vector icons fonts).
- Verify Reanimated is configured (Babel plugin already present).

2) Fix i18n and translation hook
- Expand `src/i18n/index.ts` with keys used across onboarding, pantry, categories, days/festivals, mealPlan.
- Implement `src/hooks/useTranslation.ts` wrapper exposing `{ t, language, setLanguage }`.

3) Normalize components and barrels
- Create `src/components/common/index.ts` exporting: `SunsetHeader`, `MindfulButton`, `MindfulCard`, `AnimatedSurface`, `LottieSuccess`.
- Refactor `HouseholdSetup` to use React Native Paper components directly (`Button`, `TextInput`, `HelperText`, `Card`, `Text`, `Menu` etc.) OR create thin wrappers in `components/common` that map to Paper. Prefer refactor to reduce surface area.
- Create pantry UI components used by `InventoryList`: `PantryItem`, `SearchBar`, `FilterChips`, `FloatingActionButton`, `AlertCard`, `EmptyState`, `BarCodeScanner` (Vision Camera + code scanner plugin). Add a small `showToast` helper using `react-native-toast-message`.

4) Implement hooks + API layer
- Add `src/core/api/client.ts` (axios base) and `src/core/api/queryClient.ts` (React Query client and provider integration).
- Implement hooks:
  - `src/hooks/api/useUser.ts`: `useCreateHousehold`.
  - `src/hooks/api/useMealPlan.ts`: `useGenerateWeeklyPlan`, `useOptimizeWithInventory`.
  - `src/hooks/api/useInventory.ts`: `usePantryItems`, `useAddPantryItem`.
- Wire to backend endpoints or mock via MSW until backend is ready.
- (Optional) Add Zustand store for user/household/pantry session state.

5) Wire navigation thoroughly
- Register missing screens in `src/navigation/AppNavigator.tsx`:
  - Pantry: `InventoryList`, `AddPantryItem`, `PantryItemDetails`, `EditPantryItem`, `ExpiringItems`, `ShoppingList`.
  - Meal Planning: `WeeklyPlanner`.
  - Onboarding: `HouseholdSetup`, `DietaryPreferences`.
- Add linking/deep-links for key routes.

6) Build Pantry Organizer feature
- Complete `InventoryList` replacing fallbacks with real components; implement search, filters (all/expiring/low stock/categories), and pull-to-refresh.
- Implement scanner flow (Vision Camera) to prefill `AddPantryItem`.
- Implement screens: `AddPantryItem`, `EditPantryItem`, `PantryItemDetails`, `ExpiringItems`, `ShoppingList`.
- Add expiry tracking and low-stock thresholds; surface alerts and toasts.

7) Build Meal Planning (AI + optimization)
- Finish `WeeklyPlanner` with data from `useGenerateWeeklyPlan`.
- Implement actions: replace meal, share to WhatsApp via `react-native-share`.
- Use `date-fns` for `addWeeks`, `subWeeks`, `formatDate`, `formatWeekRange`.
- Add nutrition widgets and stats cards; implement `useOptimizeWithInventory`.

8) Calorie scanner
- Integrate Vision Camera:
  - Request camera permission (iOS Info.plist + Android Manifest + runtime).
  - Implement camera preview; integrate ML inference or code-scanner plugin.
  - Display nutrition estimation (mock first, then backend or local model).

9) Quick Commerce
- Add vendor deep-links or in-app webviews:
  - Blinkit/Zepto/Swiggy Instamart actions open vendor app or web with referral params.
  - (Optional) Build cart from meal plan/pantry and pass via link params.

10) Community (Share Recipe)
- Connect `ShareRecipe` to backend API (create recipe, basic validation, error handling).
- Add a minimal community list and details view.

11) Wellness tracking
- Persist `useMindfulness` state to `@react-native-async-storage/async-storage`.
- Add progress history and small celebratory Lottie on milestones.

12) Theming, icons, animations, accessibility
- Bundle and apply brand fonts (Poppins/Nunito/SF Pro) via Paper theme.
- Standardize icons (Phosphor/Feather or keep Material consistently across app).
- Add microinteractions (Moti/Lottie) to key flows (onboarding, plan generation success, item added).
- Add accessibility labels, role hints, and ensure >44px touch targets.

13) Testing
- Unit: Jest + React Native Testing Library for components, hooks, providers, and navigation.
- e2e: Detox or Maestro for onboarding, add pantry item, generate plan, basic nav.
- Add CI (GitHub Actions) to run lint, type-check, tests on PRs.

14) Platform readiness
- Android: initialize project, configure Reanimated/Hermes, Permissions, Vision Camera setup, vector icons fonts.
- iOS: run pods, add usage descriptions (camera/mic) in Info.plist; ensure Lottie iOS setup.

15) Observability and release
- Add an error boundary and retry flows.
- (Optional) Add Sentry.
- Prepare app icons/splash, build variants, and store configs.

### Quick checklist (short-term, highest impact)
- Install `@react-navigation/native-stack` (missing, currently imported).
- Add `src/assets/lottie/success.json` placeholder asset.
- Add `mobile-app/tsconfig.json`.
- Expand i18n resources; fix `useTranslation` to return `language`.
- Refactor `HouseholdSetup` to use React Native Paper components or add wrappers.
- Implement pantry UI components and wire `InventoryList` to real hooks.
- Register missing routes in `AppNavigator`.
- Add API client + React Query hooks.
- Initialize Android project; run iOS pods.
