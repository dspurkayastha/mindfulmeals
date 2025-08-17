// MindfulMeals Design System - Animation Tokens
// Spring curves, durations, and easing functions

export const durations = {
  instant: 0,
  fast: 200,
  medium: 300,
  slow: 500,
  slower: 800,
  verySlow: 1000,
  
  // Mindful durations
  breathIn: 4000,     // 4 seconds
  breathOut: 4000,    // 4 seconds
  breathHold: 2000,   // 2 seconds
  meditation: 10000,  // 10 seconds
  
  // Micro-interaction durations
  buttonPress: 100,
  cardExpand: 300,
  modalShow: 400,
  tabSwitch: 250,
  fadeIn: 200,
  fadeOut: 150,
};

export const easings = {
  // Standard easings
  linear: 'linear',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  
  // Cubic bezier easings
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  
  // Natural easings
  easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  
  // Spring-like easings
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

export const springConfigs = {
  // Tight spring (quick, responsive)
  tight: {
    tension: 170,
    friction: 26,
    mass: 1,
  },
  
  // Default spring (balanced)
  default: {
    tension: 100,
    friction: 20,
    mass: 1,
  },
  
  // Gentle spring (smooth, relaxed)
  gentle: {
    tension: 40,
    friction: 15,
    mass: 1,
  },
  
  // Bouncy spring (playful)
  bouncy: {
    tension: 150,
    friction: 10,
    mass: 1,
  },
  
  // Mindful spring (very smooth)
  mindful: {
    tension: 30,
    friction: 20,
    mass: 1.2,
  },
};

export const reanimatedConfigs = {
  // Spring configurations for react-native-reanimated
  defaultSpring: {
    damping: 15,
    stiffness: 100,
    mass: 1,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
  },
  
  gentleSpring: {
    damping: 20,
    stiffness: 60,
    mass: 1.2,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
  },
  
  bouncySpring: {
    damping: 10,
    stiffness: 150,
    mass: 0.8,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
  },
  
  noBouncingSpring: {
    damping: 20,
    stiffness: 100,
    mass: 1,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
  },
};

// Animation sequences for complex interactions
export const animationSequences = {
  // Button press sequence
  buttonPress: [
    { scale: 0.95, duration: durations.buttonPress },
    { scale: 1, duration: durations.buttonPress * 1.5 },
  ],
  
  // Card entrance
  cardEntrance: [
    { opacity: 0, translateY: 20 },
    { opacity: 1, translateY: 0, duration: durations.cardExpand },
  ],
  
  // Breathing exercise
  breathingCycle: [
    { scale: 1, duration: 0 },
    { scale: 1.2, duration: durations.breathIn },
    { scale: 1.2, duration: durations.breathHold },
    { scale: 1, duration: durations.breathOut },
    { scale: 1, duration: durations.breathHold },
  ],
  
  // Success celebration
  successCelebration: [
    { scale: 0, opacity: 0 },
    { scale: 1.2, opacity: 1, duration: durations.fast },
    { scale: 1, opacity: 1, duration: durations.medium },
  ],
};

// Gesture animation configs
export const gestureConfigs = {
  swipeThreshold: 100,
  swipeVelocityThreshold: 0.3,
  
  // Pan gesture configs
  panGesture: {
    activeOffsetX: [-10, 10],
    failOffsetY: [-5, 5],
  },
  
  // Long press configs
  longPress: {
    minDurationMs: 500,
    maxDistance: 10,
  },
};

export default {
  durations,
  easings,
  springConfigs,
  reanimatedConfigs,
  animationSequences,
  gestureConfigs,
};