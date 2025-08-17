export default {
  // Common
  common: {
    welcome: 'Welcome to MindfulMeals',
    continue: 'Continue',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try again',
    done: 'Done',
    next: 'Next',
    back: 'Back',
    skip: 'Skip',
  },

  // Auth
  auth: {
    login: 'Login',
    logout: 'Logout',
    signup: 'Sign up',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    welcomeBack: 'Welcome back, {{name}}!',
  },

  // Onboarding
  onboarding: {
    title: 'Nourish Your Body, Mind & Soul',
    subtitle: 'Begin your mindful eating journey',
    step1: 'Track your meals mindfully',
    step2: 'Reflect on how food makes you feel',
    step3: 'Build healthy, intentional habits',
    getStarted: 'Get Started',
  },

  // Household
  household: {
    setup: 'Set up your household',
    name: 'Household name',
    region: 'Region',
    dietary: 'Dietary preference',
    budget: 'Monthly budget',
    members: 'Household members',
    createHousehold: 'Create Household',
  },

  // Pantry
  pantry: {
    title: 'My Pantry',
    subtitle: 'Organize your ingredients mindfully',
    empty: 'Your pantry is empty',
    emptyTitle: 'No ingredients yet',
    emptyMessage: 'Add your first ingredient to start your mindful cooking journey',
    addFirst: 'Add your first ingredient mindfully',
    addItem: 'Add ingredient',
    searchPlaceholder: 'Search ingredients...',
    all: 'All',
    produce: 'Produce',
    dairy: 'Dairy',
    proteins: 'Proteins',
    grains: 'Grains',
    condiments: 'Condiments',
    snacks: 'Snacks',
    categories: {
      grains: 'Grains',
      vegetables: 'Vegetables',
      fruits: 'Fruits',
      dairy: 'Dairy',
      protein: 'Protein',
      spices: 'Spices',
    },
    expiring: 'Expiring soon',
    lowStock: 'Running low',
    gratitude: 'Take a moment to appreciate this ingredient',
    refreshed: 'Pantry refreshed mindfully',
    refreshError: 'Could not refresh pantry',
    errorTitle: 'Unable to load pantry',
    errorMessage: 'Please check your connection and try again',
  },

  // Meal Planning
  meals: {
    title: 'Meal Planner',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
    todaysMeals: "Today's meals",
    planWeek: 'Plan your week',
    moodBefore: 'How are you feeling before this meal?',
    moodAfter: 'How do you feel after eating?',
    intentions: 'Set your meal intention',
    schedule: 'Schedule',
  },

  // Wellness
  wellness: {
    title: 'Wellness Tracker',
    mood: 'Mood',
    energy: 'Energy',
    digestion: 'Digestion',
    gratitude: 'Gratitude',
    reflection: 'Daily reflection',
    breathe: 'Take a mindful breath',
    meditate: 'Meditate',
    track: 'Track wellness',
    insights: 'Your wellness insights',
  },

  // Mindfulness
  mindfulness: {
    gratitudePrompt: 'What are you grateful for today?',
    breathingExercise: 'Breathing exercise',
    startSession: 'Start session',
    sessionComplete: 'Well done! You completed your mindfulness session',
    dailyIntention: 'Set your daily food intention',
    mealBlessing: 'Take a moment to appreciate your meal',
    mindfulEating: 'Eat slowly and mindfully',
    takeBreath: 'Take a mindful breath',
    fiveMinutes: 'You\'ve been organizing for 5 minutes',
    skipForNow: 'Skip for now',
  },

  // Shopping
  shopping: {
    title: 'Shopping List',
    generateList: 'Generate from meal plan',
    buyNow: 'Buy now',
    orderWith: 'Order with {{service}}',
    itemsNeeded: '{{count}} items needed',
  },

  // Success & Encouragement
  encouragement: {
    greatJob: 'Great job!',
    keepGoing: 'Keep going!',
    wellDone: 'Well done on your mindful choice',
    streakMessage: '{{days}} days of mindful eating!',
    celebrate: "Let's celebrate your progress",
  },

  // Errors
  errors: {
    networkError: 'Please check your connection',
    loginFailed: 'Login failed. Please try again',
    saveFailed: 'Could not save. Please try again',
    loadFailed: 'Could not load data',
  },

  // Share
  share: {
    gratitudeTitle: 'My Gratitude',
    gratitudeMessage: 'Feeling grateful for {{item}}',
    error: 'Could not share at this time',
  },

  // Loading
  loading: {
    mindfulMoment: 'Taking a mindful moment...',
    breatheWhileWaiting: 'Breathe with us while we prepare...',
    practicePatience: 'Practice patience as we gather your information...',
  },

  // Intention
  intention: {
    title: 'Before {{meal}}',
    subtitle: 'Set your intention for this meal',
    howToFeel: 'How do you want to feel after this meal?',
    feelings: {
      energized: 'Energized',
      satisfied: 'Satisfied', 
      light: 'Light',
      nourished: 'Nourished',
      comforted: 'Comforted',
      focused: 'Focused',
    },
    energyLevel: 'Desired Energy Level',
    lowEnergy: 'Calm',
    highEnergy: 'Energetic',
    practices: 'Mindful Practices',
    mindfulEating: 'Eat Mindfully',
    mindfulEatingDesc: 'Slow down and savor each bite',
    portionAwareness: 'Portion Awareness',
    portionAwarenessDesc: 'Listen to your body\'s fullness cues',
    skip: 'Skip',
    setIntention: 'Set Intention',
  },

  // Eating
  eating: {
    startMindfulMeal: 'Start Mindful Meal',
    mindfulMode: 'Mindful Mode Active',
    phases: {
      preparation: 'Preparation',
      firstThird: 'First Part',
      checkIn1: 'Check-In',
      secondThird: 'Middle Part',
      checkIn2: 'Check-In',
      finalThird: 'Final Part',
      reflection: 'Reflection',
    },
    preparation: {
      title: 'Prepare Your Mind & Body',
      steps: 'Take a moment to prepare for your meal',
      gratitude: 'Express gratitude for this meal',
      observe: 'Observe the colors, textures, and aromas',
      breathe: 'Take 3 deep breaths to center yourself',
    },
    checkIn: {
      title: 'Pause & Check In',
      howFull: 'How full do you feel right now?',
    },
    fullness: {
      level1: 'Empty',
      level2: 'Slightly Full',
      level3: 'Satisfied',
      level4: 'Full',
      level5: 'Very Full',
    },
    tips: {
      lookAtFood: 'Take a moment to really look at your food',
      smellAroma: 'Notice the aroma of your meal',
      firstBite: 'Savor your first bite completely',
      chewSlowly: 'Chew slowly, noticing all the flavors',
      putDownFork: 'Put down your fork between bites',
      breatheBetween: 'Take a breath between bites',
      noticeTexture: 'Notice the texture as you eat',
      appreciateFlavors: 'Appreciate how the flavors change',
    },
    recordBite: 'Tap for Each Bite',
    bites: '{{count}} bites',
    complete: 'Complete Meal',
    portionReminder: 'You\'re comfortably satisfied. Listen to your body\'s fullness cues.',
  },

  // Widgets
  widgets: {
    todayEnergy: "Today's Energy",
    gratitudes: 'Gratitudes',
    streak: '{{days}} day streak',
    breathing: 'Breathing',
    dayStreak: 'Day Streak',
    sessions: 'Sessions',
  },

  // Breathing
  breathing: {
    inhale: 'Inhale...',
    hold: 'Hold...',
    exhale: 'Exhale...',
    inhaleInstruction: 'Breathe In',
    holdInstruction: 'Hold',
    exhaleInstruction: 'Breathe Out',
    tapToStart: 'Tap to begin',
    sessionComplete: 'Well done! You completed your breathing exercise',
    tip: 'Focus on your breath and let your thoughts drift away',
    contexts: {
      pantryOrganizing: 'Take a moment to center yourself while organizing',
      preMeal: 'Prepare your body and mind for nourishment',
      cooking: 'Find calm in the rhythm of cooking',
      general: 'Let\'s take a mindful breathing break',
    },
  },

  // Gratitude
  gratitude: {
    titleFor: 'Grateful for {{item}}',
    placeholder: 'Share what you appreciate...',
    express: 'Express Gratitude',
    enterText: 'Please share your gratitude',
    saved: 'Gratitude saved with love',
    saveError: 'Could not save gratitude',
    thanksForSharing: 'Thank you for sharing!',
    quick1: 'Grateful for this nourishment',
    quick2: 'Thankful for this moment',
    prompts: {
      nourishment: 'How does this nourish your body and soul?',
      preparation: 'What effort and care went into this?',
      source: 'Where did this blessing come from?',
      experience: 'What joy does this bring to your day?',
      sharing: 'Who would you love to share this with?',
    },
  },

  // Recipes
  recipes: {
    smartSuggestions: 'Smart Recipe Suggestions',
    basedOnPantryMood: 'Based on your pantry and how you want to feel',
    howToFeel: 'How do you want to feel?',
    energyGoal: 'Energy Goal',
    finding: 'Finding perfect recipes for you...',
    forYouNow: 'For You Now',
    noSuggestions: 'No recipes found for your current preferences',
    tryDifferentMood: 'Try a different mood',
  },

  // Cooking
  cooking: {
    breatheIn: 'Breathe In',
    holdBreath: 'Hold',
    breatheOut: 'Breathe Out',
    breathCount: '{{count}} breaths',
    startTimer: 'Start Cooking',
    timerComplete: '{{recipe}} is ready!',
    mindfulTip: 'Mindful Cooking Tip',
    tipMessage: 'Use the rhythm of your breath to stay present while cooking',
  },

  // Journal
  journal: {
    gratitudeJournal: 'Gratitude Journal',
    subtitle: 'Your collection of mindful moments',
    weeklyHighlights: 'This Week\'s Highlights',
    all: 'All',
    meals: 'Meals',
    ingredients: 'Ingredients',
    emptyTitle: 'Start Your Gratitude Journey',
    emptyText: 'Long press any meal or ingredient to add your first gratitude entry',
  },

  // Celebration
  celebration: {
    share: 'Share',
    continue: 'Continue',
    first_pantry_item: {
      title: 'First Step!',
      message: 'You\'ve added your first ingredient. Your mindful journey begins!',
    },
    pantry_10_items: {
      title: 'Pantry Growing!',
      message: '10 ingredients organized. You\'re building healthy habits!',
    },
    first_meal_planned: {
      title: 'Meal Planned!',
      message: 'Your first mindful meal is ready. Enjoy the nourishment!',
    },
    first_gratitude: {
      title: 'Gratitude Started!',
      message: 'Your first grateful moment captured. Keep the positive energy flowing!',
    },
    gratitude_streak_3: {
      title: '3 Days of Gratitude!',
      message: 'You\'re building a beautiful gratitude practice!',
    },
    gratitude_streak_7: {
      title: 'Week of Gratitude!',
      message: 'A full week of appreciation. You\'re glowing!',
    },
    breathing_streak_3: {
      title: 'Breathing Streak!',
      message: '3 days of mindful breathing. Feel the calm!',
    },
    breathing_streak_7: {
      title: 'Zen Master!',
      message: 'A week of breathing exercises. Inner peace achieved!',
    },
    first_reflection: {
      title: 'First Reflection!',
      message: 'You\'re tuning into how food makes you feel. Wonderful!',
    },
    weekly_wellness_complete: {
      title: 'Weekly Goal Met!',
      message: 'You\'ve completed your weekly wellness practices. Amazing!',
    },
  },

  // Report
  report: {
    weeklyReport: 'Weekly Wellness Report',
    loading: 'Gathering your wellness data...',
    noData: 'Not enough data for a report yet',
    reflections: 'Reflections',
    gratitudes: 'Gratitudes',
    mindfulMinutes: 'Mindful Minutes',
    avgEnergy: 'Average Energy Level',
    highEnergy: 'You had great energy this week!',
    moderateEnergy: 'Your energy was moderate this week',
    moodDistribution: 'How You Felt After Meals',
    insights: 'Your Wellness Insights',
    wellnessScore: 'Wellness Score',
    excellentWeek: 'Excellent week! Keep it up!',
    goodWeek: 'Good progress this week!',
    keepGoing: 'Keep going, you\'re building habits!',
    share: 'Share Report',
  },

  // Reflection
  reflection: {
    howWasMeal: 'How was {{meal}}?',
    mood: 'How do you feel?',
    moods: {
      energized: 'Energized',
      satisfied: 'Satisfied',
      heavy: 'Heavy',
      still_hungry: 'Still Hungry',
    },
    energyLevel: 'Energy Level',
    lowEnergy: 'Low Energy',
    moderateEnergy: 'Moderate Energy',
    highEnergy: 'High Energy',
    gratitude: 'Gratitude',
    gratitudePlaceholder: 'What are you grateful for about this meal?',
    addPhoto: 'Add Photo',
    addVoiceNote: 'Voice Note',
    skipForNow: 'Skip for now',
    save: 'Save Reflection',
    selectMood: 'Please select how you feel',
    saved: 'Reflection saved mindfully',
    saveError: 'Could not save reflection',
  },
};