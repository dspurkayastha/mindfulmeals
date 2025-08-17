import { Router } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { MealPlanningService } from '../services/meal-planning.service';
import { Recipe, RecipeCategory, RecipeType, MindfulnessLevel, RecipeDifficulty } from '../entities/Recipe';
import { RecipeIngredient, IngredientType } from '../entities/RecipeIngredient';
import { RecipeStep, MindfulnessPrompt } from '../entities/RecipeStep';
import { MealPlan, MealType, PlanType, PlanStatus, MindfulnessTheme } from '../entities/MealPlan';
import { Household, IndianRegion, DietaryType } from '../entities/Household';

export const router = Router();

// Initialize service (injected during server startup)
let mealPlanningService: MealPlanningService = null as unknown as MealPlanningService;
export const setMealPlanningService = (service: MealPlanningService) => {
  mealPlanningService = service;
};

// Validation middleware
const validateHouseholdId = param('householdId')
  .isUUID()
  .withMessage('Invalid household ID');

const validateMealPlanningInput = [
  body('planType').isIn(Object.values(PlanType)).withMessage('Invalid plan type'),
  body('startDate').isISO8601().withMessage('Invalid start date format'),
  body('endDate').optional().isISO8601().withMessage('Invalid end date format'),
  body('mealTypes').isArray({ min: 1 }).withMessage('At least one meal type is required'),
  body('mealTypes.*').isIn(Object.values(MealType)).withMessage('Invalid meal type'),
];

const validateRecipeInput = [
  body('name').isLength({ min: 1, max: 255 }).withMessage('Name is required and must be less than 255 characters'),
  body('category').isIn(Object.values(RecipeCategory)).withMessage('Invalid category'),
  body('type').isIn(Object.values(RecipeType)).withMessage('Invalid recipe type'),
  body('difficulty').optional().isIn(Object.values(RecipeDifficulty)),
  body('mindfulnessLevel').optional().isIn(Object.values(MindfulnessLevel)),
  body('servings').optional().isInt({ min: 1 }).withMessage('Servings must be a positive integer'),
  body('prepTime').optional().isInt({ min: 0 }).withMessage('Prep time must be a non-negative integer'),
  body('cookTime').optional().isInt({ min: 0 }).withMessage('Cook time must be a non-negative integer'),
];

// AI-Powered Meal Planning Routes
router.post('/households/:householdId/generate-plan',
  validateHouseholdId,
  validateMealPlanningInput,
  asyncHandler(async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
    }

    const { householdId } = req.params;
    const input = { ...req.body, householdId };
    
    const mealPlans = await mealPlanningService.generateMealPlan(input);
    
    res.status(201).json({
      success: true,
      data: mealPlans,
      message: `Generated ${mealPlans.length} mindful meal plans`,
      aiFeatures: {
        mindfulnessThemes: mealPlans.map(plan => plan.mindfulnessTheme),
        culturalContext: mealPlans.filter(plan => plan.culturalContext).length,
        healthBenefits: mealPlans.reduce((total, plan) => total + plan.healthBenefits.length, 0),
        nutritionalBalance: mealPlans.every(plan => plan.nutritionalGoals),
      },
    });
  })
);

router.post('/households/:householdId/save-plan',
  validateHouseholdId,
  body('mealPlans').isArray({ min: 1 }).withMessage('At least one meal plan is required'),
  asyncHandler(async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
    }

    const { householdId } = req.params;
    const { mealPlans } = req.body;
    
    const savedPlans = await mealPlanningService.saveMealPlan(mealPlans, householdId);
    
    res.status(201).json({
      success: true,
      data: savedPlans,
      message: `Saved ${savedPlans.length} meal plans successfully`,
    });
  })
);

// Recipe Management Routes
router.post('/households/:householdId/recipes',
  validateHouseholdId,
  validateRecipeInput,
  asyncHandler(async (req: any, res: any) => {
    // TODO: Implement recipe creation
    res.status(501).json({
      success: false,
      message: 'Recipe creation not implemented yet',
      error: 'NOT_IMPLEMENTED',
    });
  })
);

router.get('/households/:householdId/recipes',
  validateHouseholdId,
  query('category').optional().isIn(Object.values(RecipeCategory)),
  query('type').optional().isIn(Object.values(RecipeType)),
  query('difficulty').optional().isIn(Object.values(RecipeDifficulty)),
  query('mindfulnessLevel').optional().isIn(Object.values(MindfulnessLevel)),
  query('search').optional().isLength({ min: 1, max: 100 }),
  asyncHandler(async (req: any, res: any) => {
    // TODO: Implement recipe retrieval
    res.status(501).json({
      success: false,
      message: 'Recipe retrieval not implemented yet',
      error: 'NOT_IMPLEMENTED',
    });
  })
);

// Recipe Recommendations
router.get('/households/:householdId/recommendations',
  validateHouseholdId,
  query('mealType').isIn(Object.values(MealType)).withMessage('Valid meal type is required'),
  query('mindfulnessLevel').optional().isIn(Object.values(MindfulnessLevel)),
  query('culturalAuthenticity').optional().isBoolean(),
  query('seasonalCooking').optional().isBoolean(),
  query('healthGoals').optional().isArray(),
  asyncHandler(async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
    }

    const { householdId } = req.params;
    const { mealType, mindfulnessLevel, culturalAuthenticity, seasonalCooking, healthGoals } = req.query;

    // TODO: Implement recipe recommendations
    res.status(501).json({
      success: false,
      message: 'Recipe recommendations not implemented yet',
      error: 'NOT_IMPLEMENTED',
    });
  })
);

// Mindfulness Integration Routes
router.get('/mindfulness/themes',
  asyncHandler(async (req: any, res: any) => {
    const themes = (Object.values(MindfulnessTheme) as MindfulnessTheme[]).map(theme => ({
      value: theme,
      label: theme.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: getMindfulnessThemeDescription(theme),
      icon: getMindfulnessThemeIcon(theme),
    }));

    res.json({
      success: true,
      data: themes,
      message: 'Mindfulness themes retrieved successfully',
    });
  })
);

router.get('/mindfulness/prompts/:theme',
  param('theme').isIn(Object.values(MindfulnessTheme)).withMessage('Invalid mindfulness theme'),
  asyncHandler(async (req: any, res: any) => {
    const { theme } = req.params;
    
    const prompts = generateMindfulnessPrompts(theme as MindfulnessTheme);
    
    res.json({
      success: true,
      data: prompts,
      message: `Mindfulness prompts for ${theme} theme retrieved successfully`,
    });
  })
);

// Cultural Integration Routes
router.get('/cultural/regions',
  asyncHandler(async (req: any, res: any) => {
    const regions = Object.values(IndianRegion).map(region => ({
      value: region,
      label: region.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      cuisine: getRegionalCuisine(region),
      specialties: getRegionalSpecialties(region),
      festivals: getRegionalFestivals(region),
    }));

    res.json({
      success: true,
      data: regions,
      message: 'Cultural regions retrieved successfully',
    });
  })
);

router.get('/cultural/festivals',
  query('region').optional().isIn(Object.values(IndianRegion)),
  query('month').optional().isInt({ min: 1, max: 12 }),
  asyncHandler(async (req: any, res: any) => {
    const { region, month } = req.query;
    
    // TODO: Implement festival retrieval
    res.status(501).json({
      success: false,
      message: 'Festival retrieval not implemented yet',
      error: 'NOT_IMPLEMENTED',
    });
  })
);

// Nutritional Analysis Routes
router.post('/nutrition/analyze',
  body('ingredients').isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  body('ingredients.*.name').isLength({ min: 1 }).withMessage('Ingredient name is required'),
  body('ingredients.*.quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('ingredients.*.unit').isLength({ min: 1 }).withMessage('Unit is required'),
  asyncHandler(async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
    }

    const { ingredients } = req.body;
    
    // TODO: Implement nutritional analysis
    res.status(501).json({
      success: false,
      message: 'Nutritional analysis not implemented yet',
      error: 'NOT_IMPLEMENTED',
    });
  })
);

// Meal Plan Management Routes
router.get('/households/:householdId/meal-plans',
  validateHouseholdId,
  query('status').optional().isIn(Object.values(PlanStatus)),
  query('planType').optional().isIn(Object.values(PlanType)),
  query('mealType').optional().isIn(Object.values(MealType)),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  asyncHandler(async (req: any, res: any) => {
    // TODO: Implement meal plan retrieval
    res.status(501).json({
      success: false,
      message: 'Meal plan retrieval not implemented yet',
      error: 'NOT_IMPLEMENTED',
    });
  })
);

router.put('/households/:householdId/meal-plans/:planId',
  validateHouseholdId,
  param('planId').isUUID().withMessage('Invalid plan ID'),
  asyncHandler(async (req: any, res: any) => {
    // TODO: Implement meal plan update
    res.status(501).json({
      success: false,
      message: 'Meal plan update not implemented yet',
      error: 'NOT_IMPLEMENTED',
    });
  })
);

router.delete('/households/:householdId/meal-plans/:planId',
  validateHouseholdId,
  param('planId').isUUID().withMessage('Invalid plan ID'),
  asyncHandler(async (req: any, res: any) => {
    // TODO: Implement meal plan deletion
    res.status(501).json({
      success: false,
      message: 'Meal plan deletion not implemented yet',
      error: 'NOT_IMPLEMENTED',
    });
  })
);

// AI Insights and Analytics
router.get('/households/:householdId/insights',
  validateHouseholdId,
  query('period').optional().isIn(['week', 'month', 'quarter', 'year']),
  asyncHandler(async (req: any, res: any) => {
    // TODO: Implement AI insights
    res.status(501).json({
      success: false,
      message: 'AI insights not implemented yet',
      error: 'NOT_IMPLEMENTED',
    });
  })
);

// Helper functions
function getMindfulnessThemeDescription(theme: MindfulnessTheme): string {
  const descriptions: Record<MindfulnessTheme, string> = {
    [MindfulnessTheme.GRATITUDE]: 'Practice thankfulness and appreciation for the nourishment and abundance in your life',
    [MindfulnessTheme.PRESENCE]: 'Be fully aware and present in the moment while preparing and enjoying your meals',
    [MindfulnessTheme.JOY]: 'Find happiness and delight in the simple pleasures of cooking and eating',
    [MindfulnessTheme.LOVE]: 'Cook and eat with love, care, and compassion for yourself and others',
    [MindfulnessTheme.PATIENCE]: 'Practice patience and mindfulness throughout the cooking and eating process',
    [MindfulnessTheme.COMPASSION]: 'Show kindness and understanding to yourself and others through mindful eating',
    [MindfulnessTheme.WISDOM]: 'Make conscious, informed choices about your food and eating habits',
    [MindfulnessTheme.BALANCE]: 'Find equilibrium between indulgence and health, tradition and innovation',
    [MindfulnessTheme.HARMONY]: 'Create harmony between your body, mind, and the food you consume',
    [MindfulnessTheme.PEACE]: 'Cultivate inner tranquility and calm during your dining experiences',
  };
  return descriptions[theme] || 'Practice mindfulness and awareness in your daily meals';
}

function getMindfulnessThemeIcon(theme: MindfulnessTheme): string {
  const icons: Record<MindfulnessTheme, string> = {
    [MindfulnessTheme.GRATITUDE]: '🙏',
    [MindfulnessTheme.PRESENCE]: '🧘',
    [MindfulnessTheme.JOY]: '😊',
    [MindfulnessTheme.LOVE]: '❤️',
    [MindfulnessTheme.PATIENCE]: '⏳',
    [MindfulnessTheme.COMPASSION]: '🤗',
    [MindfulnessTheme.WISDOM]: '🧠',
    [MindfulnessTheme.BALANCE]: '⚖️',
    [MindfulnessTheme.HARMONY]: '🎵',
    [MindfulnessTheme.PEACE]: '🕊️',
  };
  return icons[theme] || '🧘';
}

function generateMindfulnessPrompts(theme: MindfulnessTheme): {
  intention: string;
  meditationPrompt: string;
  breathingExercise: string;
  mindfulEatingTips: string[];
} {
  const prompts = {
    [MindfulnessTheme.GRATITUDE]: {
      intention: 'Express gratitude for the nourishment and abundance in your life',
      meditationPrompt: 'Take three deep breaths and think of three things you\'re grateful for about this meal',
      breathingExercise: 'Inhale gratitude for 4 counts, exhale tension for 4 counts',
      mindfulEatingTips: [
        'Pause before eating to express thanks',
        'Appreciate the journey of ingredients from farm to table',
        'Give thanks for the hands that prepared this meal',
      ],
    },
    [MindfulnessTheme.PRESENCE]: {
      intention: 'Be fully present and aware during your meal',
      meditationPrompt: 'Focus your attention on the colors, textures, and aromas of your food',
      breathingExercise: 'Inhale for 4 counts, hold for 4, exhale for 4',
      mindfulEatingTips: [
        'Notice the sensations of hunger and anticipation',
        'Take your time to fully experience each bite',
        'Be aware of the present moment without distraction',
      ],
    },
    [MindfulnessTheme.JOY]: {
      intention: 'Find joy and happiness in your dining experience',
      meditationPrompt: 'Allow yourself to feel the joy and pleasure that good food brings',
      breathingExercise: 'Take 3 joyful breaths: inhale happiness, exhale any worries',
      mindfulEatingTips: [
        'Celebrate the simple happiness of sharing a meal',
        'Find delight in the flavors and textures',
        'Embrace the joy of nourishing your body',
      ],
    },
    [MindfulnessTheme.LOVE]: {
      intention: 'Cook and eat with love and care',
      meditationPrompt: 'Feel the love that went into growing, preparing, and serving this food',
      breathingExercise: 'Breathe in love for 5 counts, exhale love for 5',
      mindfulEatingTips: [
        'Cook with love and intention',
        'Share love through mindful eating',
        'Feel love in every ingredient and bite',
      ],
    },
    [MindfulnessTheme.PATIENCE]: {
      intention: 'Practice patience throughout your meal',
      meditationPrompt: 'Practice patience by taking your time to fully enjoy each bite',
      breathingExercise: 'Slow, patient breathing: inhale for 6, hold for 2, exhale for 6',
      mindfulEatingTips: [
        'Take your time to prepare your meal',
        'Eat slowly and savor each bite',
        'Allow yourself to enjoy the process without rushing',
      ],
    },
    [MindfulnessTheme.COMPASSION]: {
      intention: 'Show compassion to yourself and others',
      meditationPrompt: 'Be compassionate with yourself as you nourish your body',
      breathingExercise: 'Gentle breathing: inhale compassion for 4, exhale compassion for 4',
      mindfulEatingTips: [
        'Be kind to yourself through mindful eating',
        'Practice self-care and self-compassion',
        'Show understanding for your body\'s needs',
      ],
    },
    [MindfulnessTheme.WISDOM]: {
      intention: 'Make wise and conscious food choices',
      meditationPrompt: 'Use your wisdom to make conscious choices about your food',
      breathingExercise: 'Mindful breathing: inhale wisdom for 5, exhale clarity for 5',
      mindfulEatingTips: [
        'Make informed decisions about what you eat',
        'Apply knowledge about nutrition and health',
        'Use wisdom to balance taste and nourishment',
      ],
    },
    [MindfulnessTheme.BALANCE]: {
      intention: 'Find balance in your eating habits',
      meditationPrompt: 'Find balance between enjoying your food and maintaining health',
      breathingExercise: 'Balanced breathing: equal inhale and exhale for 4 counts each',
      mindfulEatingTips: [
        'Balance indulgence with health',
        'Find equilibrium in your food choices',
        'Create harmony between taste and nutrition',
      ],
    },
    [MindfulnessTheme.HARMONY]: {
      intention: 'Create harmony in your relationship with food',
      meditationPrompt: 'Create harmony between your body\'s needs and your food choices',
      breathingExercise: 'Harmonious breathing: inhale for 4, hold for 4, exhale for 4',
      mindfulEatingTips: [
        'Find balance between tradition and innovation',
        'Create harmony between body and mind',
        'Achieve equilibrium in your eating patterns',
      ],
    },
    [MindfulnessTheme.PEACE]: {
      intention: 'Find inner peace during your meals',
      meditationPrompt: 'Create a peaceful atmosphere for your meal',
      breathingExercise: 'Peaceful breathing: long, slow breaths, inhale peace, exhale disturbance',
      mindfulEatingTips: [
        'Create a calm environment for dining',
        'Find inner tranquility through mindful eating',
        'Cultivate peace and calm during meals',
      ],
    },
  };

  return prompts[theme] || prompts[MindfulnessTheme.GRATITUDE];
}

function getRegionalCuisine(region: IndianRegion): string {
  const cuisineMap: Record<IndianRegion, string> = {
    [IndianRegion.PUNJAB]: 'Punjabi',
    [IndianRegion.HARYANA]: 'Haryanvi',
    [IndianRegion.DELHI]: 'Delhi',
    [IndianRegion.UTTAR_PRADESH]: 'Awadhi',
    [IndianRegion.UTTARAKHAND]: 'Kumaoni',
    [IndianRegion.HIMACHAL_PRADESH]: 'Himachali',
    [IndianRegion.JAMMU_KASHMIR]: 'Kashmiri',
    [IndianRegion.LADAKH]: 'Ladakhi',
    [IndianRegion.RAJASTHAN]: 'Rajasthani',
    [IndianRegion.MADHYA_PRADESH]: 'Madhya Pradeshi',
    [IndianRegion.CHHATTISGARH]: 'Chhattisgarhi',
    [IndianRegion.JHARKHAND]: 'Jharkhandi',
    [IndianRegion.BIHAR]: 'Bihari',
    [IndianRegion.WEST_BENGAL]: 'Bengali',
    [IndianRegion.ODISHA]: 'Odia',
    [IndianRegion.ASSAM]: 'Assamese',
    [IndianRegion.ARUNACHAL_PRADESH]: 'Arunachali',
    [IndianRegion.NAGALAND]: 'Naga',
    [IndianRegion.MANIPUR]: 'Manipuri',
    [IndianRegion.MIZORAM]: 'Mizo',
    [IndianRegion.TRIPURA]: 'Tripuri',
    [IndianRegion.MEGHALAYA]: 'Khasi',
    [IndianRegion.SIKKIM]: 'Sikkimese',
    [IndianRegion.MAHARASHTRA]: 'Maharashtrian',
    [IndianRegion.GUJARAT]: 'Gujarati',
    [IndianRegion.GOA]: 'Goan',
    [IndianRegion.KARNATAKA]: 'Karnataka',
    [IndianRegion.TAMIL_NADU]: 'Tamil',
    [IndianRegion.KERALA]: 'Malayali',
    [IndianRegion.ANDHRA_PRADESH]: 'Telugu',
    [IndianRegion.TELANGANA]: 'Telugu',
    [IndianRegion.CHANDIGARH]: 'Punjabi',
    [IndianRegion.DADRA_NAGAR_HAVELI]: 'Gujarati',
    [IndianRegion.DAMAN_DIU]: 'Gujarati',
    [IndianRegion.LAKSHADWEEP]: 'Malayali',
    [IndianRegion.PUDUCHERRY]: 'Tamil',
    [IndianRegion.ANDAMAN_NICOBAR]: 'Mixed',
  };
  return cuisineMap[region] || 'Indian';
}

function getRegionalSpecialties(region: IndianRegion): string[] {
  const specialties: Partial<Record<IndianRegion, string[]>> = {
    [IndianRegion.PUNJAB]: ['Butter Chicken', 'Sarson da Saag', 'Makki di Roti', 'Amritsari Fish'],
    [IndianRegion.KERALA]: ['Kerala Fish Curry', 'Appam with Stew', 'Malabar Biryani', 'Puttu Kadala'],
    [IndianRegion.WEST_BENGAL]: ['Macher Jhol', 'Luchi Aloor Dom', 'Rasgulla', 'Sandesh'],
    [IndianRegion.MAHARASHTRA]: ['Vada Pav', 'Misal Pav', 'Puran Poli', 'Bharli Vangi'],
    [IndianRegion.GUJARAT]: ['Dhokla', 'Khandvi', 'Thepla', 'Undhiyu'],
    [IndianRegion.TAMIL_NADU]: ['Idli Sambar', 'Dosa', 'Pongal', 'Chettinad Chicken'],
    [IndianRegion.KARNATAKA]: ['Bisi Bele Bath', 'Ragi Mudde', 'Mangalore Fish Curry', 'Neer Dosa'],
    [IndianRegion.ANDHRA_PRADESH]: ['Andhra Chicken Curry', 'Pesarattu', 'Gongura Pachadi', 'Pulihora'],
    [IndianRegion.TELANGANA]: ['Hyderabadi Biryani', 'Mirchi ka Salan', 'Double ka Meetha', 'Qubani ka Meetha'],
    [IndianRegion.RAJASTHAN]: ['Dal Baati Churma', 'Laal Maas', 'Gatte ki Sabzi', 'Ker Sangri'],
  };
  return specialties[region] || ['Regional specialties vary by area'];
}

function getRegionalFestivals(region: IndianRegion): string[] {
  const festivals: Partial<Record<IndianRegion, string[]>> = {
    [IndianRegion.PUNJAB]: ['Lohri', 'Baisakhi', 'Gurpurab', 'Hola Mohalla'],
    [IndianRegion.KERALA]: ['Onam', 'Vishu', 'Thrissur Pooram', 'Theyyam'],
    [IndianRegion.WEST_BENGAL]: ['Durga Puja', 'Kali Puja', 'Poila Boishakh', 'Nabanna'],
    [IndianRegion.MAHARASHTRA]: ['Ganesh Chaturthi', 'Gudi Padwa', 'Narali Purnima', 'Pola'],
    [IndianRegion.GUJARAT]: ['Navratri', 'Uttarayan', 'Rath Yatra', 'Bhavai'],
    [IndianRegion.TAMIL_NADU]: ['Pongal', 'Tamil New Year', 'Karthigai Deepam', 'Kavadi'],
    [IndianRegion.KARNATAKA]: ['Ugadi', 'Karaga', 'Mysore Dasara', 'Hampi Utsav'],
    [IndianRegion.ANDHRA_PRADESH]: ['Ugadi', 'Sankranti', 'Vinayaka Chaviti', 'Sri Rama Navami'],
    [IndianRegion.TELANGANA]: ['Bathukamma', 'Bonalu', 'Ugadi', 'Sankranti'],
    [IndianRegion.RAJASTHAN]: ['Gangaur', 'Teej', 'Mewar Festival', 'Pushkar Fair'],
  };
  return festivals[region] || ['Festivals vary by region and culture'];
}

export { router as mealPlanningRoutes };
