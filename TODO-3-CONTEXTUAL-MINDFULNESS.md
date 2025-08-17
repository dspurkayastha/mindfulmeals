# TODO-3: Contextual Mindfulness Features 🧘‍♀️

**Philosophy**: Mindfulness should be woven into the natural flow of meal planning, not a separate wellness app.

Status key: [ ] pending, [~] in progress, [x] done, [🚀] next focus

## Phase 1 — Breathing Integration (Week 1) 🌬️

### Contextual Breathing Triggers
- [🚀] Pantry "Take a Breather" - appears after 5 min of organizing
- [🚀] Cooking Timer Breathing - sync breath with cook time
- [🚀] Loading State Breathing - all loading uses breath rhythm
- [ ] Pre-Shopping Centering - before opening shopping list
- [ ] Decision Fatigue Relief - after 10+ min meal planning
- [ ] Transition Breathing - between major app sections

### Implementation Details
- [ ] Create `FloatingBreatherButton` component
- [ ] Build `CookingBreathingTimer` with circular progress
- [ ] Enhance all loaders with `MindfulLoader` component
- [ ] Add breath counter to cooking screens
- [ ] Implement "skip for now" without guilt

## Phase 2 — Meal-Based Gratitude (Week 1-2) 🙏

### Post-Meal Reflections
- [🚀] 30-min post-meal notification system
- [🚀] Contextual prompts based on time of day
- [ ] Mood tracking (energized/satisfied/heavy/still-hungry)
- [ ] Energy level indicators (1-5 scale)
- [ ] Photo attachment option
- [ ] Voice note support

### Gratitude Integration Points
- [ ] Long-press meal card for quick gratitude
- [ ] Morning: "What are you looking forward to eating?"
- [ ] Pre-meal: "Take a moment to appreciate this food"
- [ ] Post-meal: "What flavors brought you joy?"
- [ ] Evening: "Which meal nourished you most today?"

### Visual Journal
- [ ] Timeline view with meal photos and moods
- [ ] Weekly gratitude highlights
- [ ] Mood patterns visualization
- [ ] Shareable gratitude cards
- [ ] Export to health apps

## Phase 3 — Intelligent Meditation (Week 2) 🧠

### Context-Aware Triggers
- [🚀] Stress detection (rushed navigation, long planning)
- [ ] Energy dip detection (3 PM, slow scrolling)
- [ ] Pre-meal meditation prompts
- [ ] Post-lunch digestive meditation
- [ ] Evening reflection reminders

### Smart Notification System
- [ ] Learn user's meal schedule
- [ ] Adapt to energy patterns
- [ ] Skip if user is actively using app
- [ ] Gentle, non-intrusive design
- [ ] Celebration over guilt

### Micro-Meditations
- [ ] 1-min breathing for transitions
- [ ] 3-min pre-meal gratitude
- [ ] 5-min digestive meditation
- [ ] 10-min evening reflection
- [ ] Custom duration option

## Phase 4 — Micro-Wellness Moments (Week 2-3) ✨

### Ingredient Gratitude
- [ ] Special toast for fresh/seasonal/local items
- [ ] "Where did this come from?" prompts
- [ ] Seasonal celebration animations
- [ ] Local farmer appreciation

### Mindful Interactions
- [ ] Button breathing (subtle expand/contract)
- [ ] Page transitions (inhale exit, exhale enter)
- [ ] Scroll resistance at natural pause points
- [ ] Haptic breathing patterns

### Celebration Moments
- [ ] 10 items organized celebration
- [ ] First meal planned
- [ ] 7-day streak achievement
- [ ] Healthy choice recognition
- [ ] Waste reduction milestone

### Error Recovery
- [ ] Mindful error boundaries
- [ ] "Let's pause together" messaging
- [ ] 3-breath recovery option
- [ ] No judgment language
- [ ] Gentle retry prompts

## Phase 5 — Adaptive Experience (Week 3) 🎯

### UI Adaptation
- [ ] Low energy → energizing meal suggestions
- [ ] Stressed → softer colors, calming animations
- [ ] Grateful → celebration particles
- [ ] Rushed → gentle "slow down" reminders

### Contextual Insights
- [ ] "You feel best after Mediterranean meals"
- [ ] "Your energy dips at 3 PM"
- [ ] "Gratitude improved meal satisfaction 20%"
- [ ] "Breathing reduces cooking stress"
- [ ] Weekly wellness report

### Habit Formation
- [ ] Streak tracking (non-pressuring)
- [ ] Gentle nudges at optimal times
- [ ] Progress celebration
- [ ] Insight-based suggestions
- [ ] Community sharing (optional)

## Technical Requirements

### Performance
- [ ] Native driver for all breathing animations
- [ ] Cached haptic patterns
- [ ] Local notification scheduling
- [ ] On-device insight calculation
- [ ] Smooth 60fps animations

### Privacy & Sensitivity
- [ ] Local storage for moods/reflections
- [ ] No judgment language ever
- [ ] Always skippable
- [ ] Celebration over correction
- [ ] Opt-in analytics only

### Accessibility
- [ ] VoiceOver for all prompts
- [ ] Reduced motion respects settings
- [ ] High contrast mode support
- [ ] Clear haptic alternatives
- [ ] Text size adaptation

## Success Metrics 📊

### Engagement Targets
- [ ] 3+ breathing exercises daily
- [ ] 60% post-meal reflection rate
- [ ] 40% meditation acceptance
- [ ] 70% day-7 retention
- [ ] 50% day-30 retention

### Wellness Outcomes
- [ ] 20% increase in meal satisfaction
- [ ] 30% decrease in cooking stress
- [ ] 50% mindful eating adoption
- [ ] Positive energy trend
- [ ] Improved food relationships

### Feature Discovery
- [ ] 80% discover breathing in week 1
- [ ] 70% try gratitude journaling
- [ ] 50% complete a meditation
- [ ] 90% experience a celebration
- [ ] 60% check insights

## Implementation Priority

### Week 1 Sprint
1. Post-meal notification system
2. Pantry breather button
3. Cooking timer breathing
4. Basic gratitude input
5. Mindful loading states

### Week 2 Sprint
1. Smart meditation triggers
2. Gratitude timeline view
3. Celebration animations
4. Error recovery flows
5. Contextual insights

### Week 3 Sprint
1. Adaptive UI system
2. Habit streak tracking
3. Weekly reports
4. Performance optimization
5. User testing

## Dependencies

### Required Packages
```bash
npm i react-native-push-notification  # Smart notifications
npm i react-native-background-timer   # Cooking timers
npm i react-native-voice             # Voice gratitude
npm i react-native-share             # Share gratitude cards
npm i react-native-blur              # Meditation overlays
```

### Animation Assets
- breathing-circle.json
- gratitude-heart.json
- celebration-particles.json
- gentle-waves.json (errors)
- mindful-transitions.json

### Sound Assets (Optional)
- gentle-chime.wav
- breathing-guide.mp3
- celebration.wav
- meditation-bell.mp3

## Notes

- Every feature must be skippable
- No guilt, only encouragement
- Celebrate small wins
- Adapt to user patterns
- Privacy first approach
- Performance is mindfulness