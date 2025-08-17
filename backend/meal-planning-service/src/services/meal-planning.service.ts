import { Repository } from 'typeorm';
import { Recipe, RecipeCategory, RecipeType, MindfulnessLevel } from '../entities/Recipe';
import { RecipeIngredient, IngredientType } from '../entities/RecipeIngredient';
import { RecipeStep, MindfulnessPrompt } from '../entities/RecipeStep';
import { MealPlan, MealType, PlanType, PlanStatus, MindfulnessTheme } from '../entities/MealPlan';
import { Household, IndianRegion, DietaryType } from '../entities/Household';

export interface MealPlanningInput {
  householdId: string;
  planType: PlanType;
  startDate: Date;
  endDate?: Date;
  mealTypes: MealType[];
  preferences?: {
    mindfulnessLevel?: MindfulnessLevel;
    culturalAuthenticity?: boolean;
    seasonalCooking?: boolean;
    festivalCooking?: boolean;
    healthGoals?: string[];
    dietaryRestrictions?: string[];
    cookingTime?: 'quick' | 'moderate' | 'elaborate';
    complexity?: 'simple' | 'moderate' | 'complex';
    budget?: number;
  };
}

export interface MindfulMealPlan {
  date: Date;
  mealType: MealType;
  recipe?: Recipe;
  customMeal?: {
    name: string;
    description: string;
    ingredients: string[];
    mindfulnessPrompt: string;
  };
  mindfulnessTheme: MindfulnessTheme;
  intention: string;
  meditationPrompt: string;
  breathingExercise: string;
  culturalContext?: string;
  healthBenefits: string[];
  nutritionalGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface RecipeRecommendation {
  recipe: Recipe;
  score: number;
  reasons: string[];
  mindfulnessScore: number;
  culturalScore: number;
  healthScore: number;
  seasonalScore: number;
}

export class MealPlanningService {
  constructor(
    private recipeRepo: Repository<Recipe>,
    private ingredientRepo: Repository<RecipeIngredient>,
    private stepRepo: Repository<RecipeStep>,
    private mealPlanRepo: Repository<MealPlan>,
    private householdRepo: Repository<Household>,
  ) {}

  // Core Meal Planning
  async generateMealPlan(input: MealPlanningInput): Promise<MindfulMealPlan[]> {
    const household = await this.householdRepo.findOne({ where: { id: input.householdId } });
    if (!household) {
      throw new Error('Household not found');
    }

    const mealPlans: MindfulMealPlan[] = [];
    const startDate = new Date(input.startDate);
    const endDate = input.endDate ? new Date(input.endDate) : startDate;
    
    // Generate plans for each day
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      for (const mealType of input.mealTypes) {
        const mealPlan = await this.generateSingleMeal(
          date,
          mealType,
          household,
          input.preferences
        );
        mealPlans.push(mealPlan);
      }
    }

    return mealPlans;
  }

  private async generateSingleMeal(
    date: Date,
    mealType: MealType,
    household: Household,
    preferences?: any
  ): Promise<MindfulMealPlan> {
    // Get recipe recommendations
    const recommendations = await this.getRecipeRecommendations(
      mealType,
      household,
      preferences
    );

    // Select best recipe or create custom meal
    const selectedRecipe = recommendations.length > 0 ? recommendations[0].recipe : undefined;
    
    // Generate mindfulness theme and prompts
    const mindfulnessTheme = this.generateMindfulnessTheme(mealType, date, household);
    const intention = this.generateIntention(mindfulnessTheme, mealType, household);
    const meditationPrompt = this.generateMeditationPrompt(mindfulnessTheme, mealType);
    const breathingExercise = this.generateBreathingExercise(mindfulnessTheme);

    // Generate cultural context
    const culturalContext = this.generateCulturalContext(date, household, selectedRecipe);

    // Generate health benefits
    const healthBenefits = this.generateHealthBenefits(selectedRecipe, mealType, household);

    // Calculate nutritional goals
    const nutritionalGoals = this.calculateNutritionalGoals(mealType, household, selectedRecipe);

    if (selectedRecipe) {
      return {
        date,
        mealType,
        recipe: selectedRecipe,
        mindfulnessTheme,
        intention,
        meditationPrompt,
        breathingExercise,
        culturalContext,
        healthBenefits,
        nutritionalGoals,
      };
    } else {
      // Create custom meal
      const customMeal = this.generateCustomMeal(mealType, household, preferences);
      return {
        date,
        mealType,
        customMeal,
        mindfulnessTheme,
        intention,
        meditationPrompt,
        breathingExercise,
        culturalContext,
        healthBenefits,
        nutritionalGoals,
      };
    }
  }

  // AI-Powered Recipe Recommendations
  async getRecipeRecommendations(
    mealType: MealType,
    household: Household,
    preferences?: any
  ): Promise<RecipeRecommendation[]> {
    // Get available recipes
    const recipes = await this.recipeRepo.find({
      where: {
        householdId: household.id,
        isActive: true,
        category: this.mapMealTypeToCategory(mealType),
        type: this.getCompatibleRecipeType(household.dietaryType),
      },
      relations: ['ingredients', 'steps'],
    });

    // Score and rank recipes
    const recommendations: RecipeRecommendation[] = [];
    
    for (const recipe of recipes) {
      const score = await this.calculateRecipeScore(recipe, household, preferences, mealType);
      const mindfulnessScore = this.calculateMindfulnessScore(recipe);
      const culturalScore = this.calculateCulturalScore(recipe, household);
      const healthScore = this.calculateHealthScore(recipe, household);
      const seasonalScore = this.calculateSeasonalScore(recipe, new Date());

      const totalScore = (score + mindfulnessScore + culturalScore + healthScore + seasonalScore) / 5;
      
      recommendations.push({
        recipe,
        score: totalScore,
        reasons: this.generateRecommendationReasons(recipe, household, preferences),
        mindfulnessScore,
        culturalScore,
        healthScore,
        seasonalScore,
      });
    }

    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  private async calculateRecipeScore(
    recipe: Recipe,
    household: Household,
    preferences?: any,
    mealType?: MealType
  ): Promise<number> {
    let score = 0;

    // Base score from recipe quality
    score += recipe.mindfulnessScore || 0;
    score += recipe.culturalAuthenticity || 0;

    // Preference matching
    if (preferences?.mindfulnessLevel && recipe.mindfulnessLevel === preferences.mindfulnessLevel) {
      score += 20;
    }

    if (preferences?.cookingTime === 'quick' && recipe.isQuickRecipe) {
      score += 15;
    }

    if (preferences?.complexity === 'simple' && recipe.difficulty === 'easy') {
      score += 15;
    }

    // Cultural alignment
    if (household.isCulturalHousehold && recipe.isCulturalRecipe) {
      score += 25;
    }

    // Seasonal alignment
    if (household.isSeasonalCooking && recipe.isSeasonalRecipe) {
      score += 20;
    }

    // Health goal alignment
    if (household.isHealthFocused && recipe.nutritionDensity > 0.1) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  private calculateMindfulnessScore(recipe: Recipe): number {
    return recipe.mindfulnessScore || 0;
  }

  private calculateCulturalScore(recipe: Recipe, household: Household): number {
    let score = recipe.culturalAuthenticity || 0;
    
    // Boost score for regional recipes
    if (recipe.culturalInfo?.region === household.region) {
      score += 20;
    }

    return Math.min(score, 100);
  }

  private calculateHealthScore(recipe: Recipe, household: Household): number {
    let score = 0;

    // Nutritional density
    if (recipe.nutritionDensity > 0.1) {
      score += 30;
    }

    // Dietary compliance
    if (this.isRecipeTypeCompatibleWithDiet(recipe.type, household.dietaryType)) {
      score += 25;
    }

    // Health considerations
    if (recipe.ingredients?.some(ing => ing.isHealthy)) {
      score += 20;
    }

    // Mindfulness integration
    if (recipe.steps?.some(step => step.isMindfulStep)) {
      score += 25;
    }

    return Math.min(score, 100);
  }

  private calculateSeasonalScore(recipe: Recipe, date: Date): number {
    if (!recipe.isSeasonalRecipe) return 50; // Neutral score for non-seasonal recipes

    const currentMonth = date.getMonth() + 1;
    const seasonalMonths = recipe.culturalInfo?.seasonalAvailability || [];
    
    if (seasonalMonths.includes(currentMonth.toString())) {
      return 100; // Perfect seasonal match
    }

    return 30; // Lower score for off-season
  }

  private isRecipeTypeCompatibleWithDiet(recipeType: RecipeType, dietaryType: DietaryType): boolean {
    // Simple compatibility mapping; can be expanded
    if (dietaryType === DietaryType.VEGAN) return recipeType === RecipeType.VEGAN;
    if (dietaryType === DietaryType.VEGETARIAN) return recipeType === RecipeType.VEGETARIAN || recipeType === RecipeType.EGGETARIAN;
    if (dietaryType === DietaryType.JAIN) return recipeType === RecipeType.JAIN;
    if (dietaryType === DietaryType.HALAL) return recipeType === RecipeType.HALAL || recipeType === RecipeType.NON_VEGETARIAN;
    // Mixed or others
    return true;
  }

  // Mindfulness Generation
  private generateMindfulnessTheme(mealType: MealType, date: Date, household: Household): MindfulnessTheme {
    // Morning meals - energizing themes
    if (mealType === MealType.BREAKFAST || mealType === MealType.MORNING_SNACK) {
      const morningThemes: MindfulnessTheme[] = [MindfulnessTheme.JOY, MindfulnessTheme.BALANCE, MindfulnessTheme.PRESENCE];
      return morningThemes[Math.floor(Math.random() * morningThemes.length)];
    }
    
    // Midday meals - balancing themes
    if (mealType === MealType.LUNCH || mealType === MealType.AFTERNOON_SNACK) {
      const middayThemes: MindfulnessTheme[] = [MindfulnessTheme.BALANCE, MindfulnessTheme.HARMONY, MindfulnessTheme.WISDOM];
      return middayThemes[Math.floor(Math.random() * middayThemes.length)];
    }
    
    // Evening meals - calming themes
    if (mealType === MealType.DINNER || mealType === MealType.EVENING_SNACK) {
      const eveningThemes: MindfulnessTheme[] = [MindfulnessTheme.PEACE, MindfulnessTheme.GRATITUDE, MindfulnessTheme.LOVE];
      return eveningThemes[Math.floor(Math.random() * eveningThemes.length)];
    }

    // Default theme
    return MindfulnessTheme.GRATITUDE;
  }

  private generateIntention(theme: MindfulnessTheme, mealType: MealType, household: Household): string {
    const intentions: Record<MindfulnessTheme, string[]> = {
      [MindfulnessTheme.GRATITUDE]: [
        `Express gratitude for the nourishment this ${mealType} provides`,
        `Appreciate the journey of ingredients from farm to table`,
        `Give thanks for the hands that prepared this meal`,
      ],
      [MindfulnessTheme.PRESENCE]: [
        `Be fully present with each bite of this ${mealType}`,
        `Savor the moment and the flavors of this meal`,
        `Focus on the here and now while enjoying this food`,
      ],
      [MindfulnessTheme.JOY]: [
        `Find joy in the simple pleasure of this ${mealType}`,
        `Celebrate the abundance and variety of this meal`,
        `Embrace the happiness that good food brings`,
      ],
      [MindfulnessTheme.LOVE]: [
        `Cook and eat this ${mealType} with love and care`,
        `Share the love through the preparation of this meal`,
        `Feel the love in every ingredient and every bite`,
      ],
      [MindfulnessTheme.PATIENCE]: [
        `Practice patience while preparing this ${mealType}`,
        `Take your time to fully enjoy this meal`,
        `Embrace the process of cooking and eating mindfully`,
      ],
      [MindfulnessTheme.COMPASSION]: [
        `Show compassion to yourself through this ${mealType}`,
        `Be kind to your body as you nourish it`,
        `Practice self-compassion while enjoying this meal`,
      ],
      [MindfulnessTheme.WISDOM]: [
        `Make wise choices about what goes into this ${mealType}`,
        `Use your wisdom to appreciate the nutritional value`,
        `Apply knowledge about healthy eating to this meal`,
      ],
      [MindfulnessTheme.BALANCE]: [
        `Find balance in the flavors and nutrition of this ${mealType}`,
        `Maintain equilibrium between indulgence and health`,
        `Create harmony between taste and nourishment`,
      ],
      [MindfulnessTheme.HARMONY]: [
        `Create harmony between your body and this ${mealType}`,
        `Find the perfect balance of flavors and textures`,
        `Achieve harmony between tradition and innovation`,
      ],
      [MindfulnessTheme.PEACE]: [
        `Find inner peace while enjoying this ${mealType}`,
        `Create a peaceful atmosphere for your meal`,
        `Cultivate tranquility through mindful eating`,
      ],
    };

    const themeIntentions = intentions[theme] || intentions[MindfulnessTheme.GRATITUDE];
    return themeIntentions[Math.floor(Math.random() * themeIntentions.length)];
  }

  private generateMeditationPrompt(theme: MindfulnessTheme, mealType: MealType): string {
    const prompts: Record<MindfulnessTheme, string[]> = {
      [MindfulnessTheme.GRATITUDE]: [
        `Before eating, take three deep breaths and think of three things you're grateful for about this ${mealType}`,
        `As you prepare to eat, reflect on the journey this food took to reach your plate`,
        `Take a moment to appreciate the abundance and variety in your meal`,
      ],
      [MindfulnessTheme.PRESENCE]: [
        `Focus your attention on the colors, textures, and aromas of your ${mealType}`,
        `Take a moment to be fully present with your food before taking the first bite`,
        `Notice the sensations of hunger and anticipation as you prepare to eat`,
      ],
      [MindfulnessTheme.JOY]: [
        `Allow yourself to feel the joy and pleasure that good food brings`,
        `Celebrate the simple happiness of sharing a meal with yourself or others`,
        `Find delight in the flavors and the experience of eating`,
      ],
      [MindfulnessTheme.LOVE]: [
        `Cook and eat with love, knowing that you're nourishing your body and soul`,
        `Feel the love that went into growing, preparing, and serving this food`,
        `Share love through the act of mindful eating and appreciation`,
      ],
      [MindfulnessTheme.PATIENCE]: [
        `Practice patience by taking your time to fully enjoy each bite`,
        `Embrace the process of eating slowly and mindfully`,
        `Allow yourself to savor the experience without rushing`,
      ],
      [MindfulnessTheme.COMPASSION]: [
        `Be compassionate with yourself as you nourish your body`,
        `Show kindness to yourself through mindful eating practices`,
        `Practice self-care and self-compassion during your meal`,
      ],
      [MindfulnessTheme.WISDOM]: [
        `Use your wisdom to make conscious choices about your food`,
        `Apply knowledge about nutrition and health to your eating`,
        `Make informed decisions about what and how you eat`,
      ],
      [MindfulnessTheme.BALANCE]: [
        `Find balance between enjoying your food and maintaining health`,
        `Create harmony between indulgence and nourishment`,
        `Achieve equilibrium in your eating habits and choices`,
      ],
      [MindfulnessTheme.HARMONY]: [
        `Create harmony between your body's needs and your food choices`,
        `Find balance between tradition and modern nutrition`,
        `Achieve harmony in your relationship with food`,
      ],
      [MindfulnessTheme.PEACE]: [
        `Create a peaceful atmosphere for your meal`,
        `Find inner tranquility through mindful eating`,
        `Cultivate peace and calm during your dining experience`,
      ],
    };

    const themePrompts = prompts[theme] || prompts[MindfulnessTheme.GRATITUDE];
    return themePrompts[Math.floor(Math.random() * themePrompts.length)];
  }

  private generateBreathingExercise(theme: MindfulnessTheme): string {
    const exercises: Record<MindfulnessTheme, string> = {
      [MindfulnessTheme.GRATITUDE]: 'Take 4 deep breaths: Inhale gratitude, exhale tension. Feel thankful for this moment.',
      [MindfulnessTheme.PRESENCE]: 'Breathe in for 4 counts, hold for 4, exhale for 4. Be fully present now.',
      [MindfulnessTheme.JOY]: 'Take 3 joyful breaths: Inhale happiness, exhale any worries. Let joy fill your being.',
      [MindfulnessTheme.LOVE]: 'Breathe in love for 5 counts, exhale love for 5. Feel love in every breath.',
      [MindfulnessTheme.PATIENCE]: 'Slow, patient breathing: Inhale for 6, hold for 2, exhale for 6. Practice patience.',
      [MindfulnessTheme.COMPASSION]: 'Gentle breathing: Inhale compassion for 4, exhale compassion for 4. Be kind to yourself.',
      [MindfulnessTheme.WISDOM]: 'Mindful breathing: Inhale wisdom for 5, exhale clarity for 5. Access your inner knowing.',
      [MindfulnessTheme.BALANCE]: 'Balanced breathing: Equal inhale and exhale for 4 counts each. Find your center.',
      [MindfulnessTheme.HARMONY]: 'Harmonious breathing: Inhale for 4, hold for 4, exhale for 4. Create inner harmony.',
      [MindfulnessTheme.PEACE]: 'Peaceful breathing: Long, slow breaths. Inhale peace, exhale any disturbance.',
    };

    return exercises[theme] || exercises[MindfulnessTheme.GRATITUDE];
  }

  // Cultural Context Generation
  private generateCulturalContext(date: Date, household: Household, recipe?: Recipe): string | undefined {
    if (recipe?.isCulturalRecipe) {
      return `This ${recipe.name} is a traditional ${household.primaryCuisine} dish with deep cultural roots.`;
    }

    // Check for festivals
    const festival = this.getFestivalForDate(date, household.region);
    if (festival) {
      return `Today is ${festival.name}, a perfect time to prepare traditional ${household.primaryCuisine} dishes.`;
    }

    // Check for seasonal context
    const season = this.getSeasonForDate(date);
    if (household.isSeasonalCooking) {
      return `It's ${season} season, ideal for fresh, seasonal ${household.primaryCuisine} ingredients.`;
    }

    return undefined;
  }

  // Health Benefits Generation
  private generateHealthBenefits(recipe?: Recipe, mealType?: MealType, household?: Household): string[] {
    const benefits: string[] = [];

    if (recipe) {
      if (recipe.nutritionalInfo?.protein && recipe.nutritionalInfo.protein > 10) {
        benefits.push('High in protein for muscle building and repair');
      }
      if (recipe.nutritionalInfo?.fiber && recipe.nutritionalInfo.fiber > 5) {
        benefits.push('Rich in fiber for digestive health');
      }
      if (recipe.nutritionalInfo?.vitamins && recipe.nutritionalInfo.vitamins.length > 0) {
        benefits.push(`Contains essential vitamins: ${recipe.nutritionalInfo.vitamins.join(', ')}`);
      }
      if (recipe.isMindfulRecipe) {
        benefits.push('Promotes mindful eating and mental well-being');
      }
      if (recipe.isCulturalRecipe) {
        benefits.push('Connects you to cultural heritage and traditions');
      }
    }

    // Add meal-specific benefits
    if (mealType === MealType.BREAKFAST) {
      benefits.push('Provides energy to start your day mindfully');
    } else if (mealType === MealType.LUNCH) {
      benefits.push('Sustains energy and focus throughout the afternoon');
    } else if (mealType === MealType.DINNER) {
      benefits.push('Promotes restful sleep and evening relaxation');
    }

    return benefits.length > 0 ? benefits : ['Nourishes your body and soul'];
  }

  // Nutritional Goals Calculation
  private calculateNutritionalGoals(mealType: MealType, household: Household, recipe?: Recipe): {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  } {
    // Base nutritional goals by meal type
    const baseGoals: Record<MealType, { calories: number; protein: number; carbs: number; fat: number; fiber: number }> = {
      [MealType.BREAKFAST]: { calories: 400, protein: 20, carbs: 50, fat: 15, fiber: 8 },
      [MealType.MORNING_SNACK]: { calories: 150, protein: 8, carbs: 20, fat: 6, fiber: 3 },
      [MealType.LUNCH]: { calories: 600, protein: 30, carbs: 70, fat: 20, fiber: 10 },
      [MealType.AFTERNOON_SNACK]: { calories: 200, protein: 10, carbs: 25, fat: 8, fiber: 4 },
      [MealType.DINNER]: { calories: 500, protein: 25, carbs: 55, fat: 18, fiber: 8 },
      [MealType.EVENING_SNACK]: { calories: 100, protein: 5, carbs: 15, fat: 4, fiber: 2 },
      [MealType.LATE_NIGHT]: { calories: 50, protein: 3, carbs: 8, fat: 2, fiber: 1 },
    };

    let goals = baseGoals[mealType];

    // Adjust based on household health goals
    if (household.healthGoals?.targetCalories) {
      const dailyCalories = household.healthGoals.targetCalories;
      const mealRatio = goals.calories / 2000; // Assuming 2000 is standard daily
      goals.calories = Math.round(dailyCalories * mealRatio);
    }

    // Adjust based on recipe if available
    if (recipe?.nutritionalInfo) {
      goals = {
        calories: recipe.nutritionalInfo.calories || goals.calories,
        protein: recipe.nutritionalInfo.protein || goals.protein,
        carbs: recipe.nutritionalInfo.carbs || goals.carbs,
        fat: recipe.nutritionalInfo.fat || goals.fat,
        fiber: recipe.nutritionalInfo.fiber || goals.fiber,
      };
    }

    return goals;
  }

  // Helper Methods
  private mapMealTypeToCategory(mealType: MealType): RecipeCategory {
    const mapping: Record<MealType, RecipeCategory> = {
      [MealType.BREAKFAST]: RecipeCategory.BREAKFAST,
      [MealType.MORNING_SNACK]: RecipeCategory.SNACKS,
      [MealType.LUNCH]: RecipeCategory.LUNCH,
      [MealType.AFTERNOON_SNACK]: RecipeCategory.SNACKS,
      [MealType.DINNER]: RecipeCategory.DINNER,
      [MealType.EVENING_SNACK]: RecipeCategory.SNACKS,
      [MealType.LATE_NIGHT]: RecipeCategory.SNACKS,
    };
    return mapping[mealType] || RecipeCategory.LUNCH;
  }

  private getCompatibleRecipeType(dietaryType: DietaryType): RecipeType {
    const mapping: Partial<Record<DietaryType, RecipeType>> = {
      [DietaryType.VEGAN]: RecipeType.VEGAN,
      [DietaryType.NON_VEGETARIAN]: RecipeType.NON_VEGETARIAN,
      [DietaryType.EGGETARIAN]: RecipeType.EGGETARIAN,
      [DietaryType.JAIN]: RecipeType.JAIN,
      [DietaryType.HALAL]: RecipeType.HALAL,
      [DietaryType.KOSHER]: RecipeType.KOSHER,
      [DietaryType.GLUTEN_FREE]: RecipeType.GLUTEN_FREE,
      [DietaryType.DAIRY_FREE]: RecipeType.DAIRY_FREE,
      [DietaryType.NUT_FREE]: RecipeType.NUT_FREE,
      // FLEXITARIAN and others map to a general type
    };
    return mapping[dietaryType] || RecipeType.VEGETARIAN;
  }

  private generateRecommendationReasons(recipe: Recipe, household: Household, preferences?: any): string[] {
    const reasons: string[] = [];

    if (recipe.isMindfulRecipe) {
      reasons.push('Promotes mindful eating and mental well-being');
    }

    if (recipe.isCulturalRecipe && household.isCulturalHousehold) {
      reasons.push('Aligns with your cultural cooking preferences');
    }

    if (recipe.isSeasonalRecipe && household.isSeasonalCooking) {
      reasons.push('Uses seasonal ingredients for optimal freshness');
    }

    if (recipe.isQuickRecipe && preferences?.cookingTime === 'quick') {
      reasons.push('Perfect for quick meal preparation');
    }

    if (recipe.difficulty === 'easy' && preferences?.complexity === 'simple') {
      reasons.push('Simple and easy to prepare');
    }

    if (recipe.nutritionDensity > 0.1 && household.isHealthFocused) {
      reasons.push('High nutritional value for your health goals');
    }

    return reasons.length > 0 ? reasons : ['Well-balanced and delicious meal option'];
  }

  private generateCustomMeal(mealType: MealType, household: Household, preferences?: any): {
    name: string;
    description: string;
    ingredients: string[];
    mindfulnessPrompt: string;
  } {
    const mealNames: Record<MealType, string[]> = {
      [MealType.BREAKFAST]: ['Mindful Morning Bowl', 'Gratitude Breakfast', 'Peaceful Start'],
      [MealType.MORNING_SNACK]: ['Mindful Bite', 'Gratitude Snack', 'Peaceful Pause'],
      [MealType.LUNCH]: ['Mindful Midday Meal', 'Gratitude Lunch', 'Peaceful Nourishment'],
      [MealType.AFTERNOON_SNACK]: ['Mindful Afternoon Bite', 'Gratitude Snack', 'Peaceful Break'],
      [MealType.DINNER]: ['Mindful Evening Meal', 'Gratitude Dinner', 'Peaceful Closure'],
      [MealType.EVENING_SNACK]: ['Mindful Evening Bite', 'Gratitude Snack', 'Peaceful Wind-down'],
      [MealType.LATE_NIGHT]: ['Mindful Late Night', 'Gratitude Bite', 'Peaceful Rest'],
    };

    const name = mealNames[mealType][Math.floor(Math.random() * mealNames[mealType].length)];
    const description = `A mindful ${mealType} prepared with intention and gratitude, using fresh, seasonal ingredients that align with your ${household.primaryCuisine} preferences.`;
    
    const ingredients = this.generateCustomMealIngredients(mealType, household);
    const mindfulnessPrompt = `Take a moment to appreciate this ${mealType} and the nourishment it provides. Eat slowly and mindfully, savoring each bite.`;

    return { name, description, ingredients, mindfulnessPrompt };
  }

  private generateCustomMealIngredients(mealType: MealType, household: Household): string[] {
    const baseIngredients: Record<MealType, string[]> = {
      [MealType.BREAKFAST]: ['Fresh seasonal fruits', 'Whole grains', 'Nuts and seeds', 'Dairy or plant-based milk'],
      [MealType.MORNING_SNACK]: ['Fresh vegetables', 'Hummus or dip', 'Whole grain crackers', 'Herbal tea'],
      [MealType.LUNCH]: ['Seasonal vegetables', 'Whole grains or legumes', 'Fresh herbs', 'Olive oil or ghee'],
      [MealType.AFTERNOON_SNACK]: ['Fresh fruits', 'Nuts or seeds', 'Yogurt or plant-based alternative', 'Green tea'],
      [MealType.DINNER]: ['Seasonal vegetables', 'Lean protein', 'Whole grains', 'Fresh herbs and spices'],
      [MealType.EVENING_SNACK]: ['Light fruits', 'Herbal tea', 'Small portion of nuts', 'Warm milk or alternative'],
      [MealType.LATE_NIGHT]: ['Herbal tea', 'Small piece of fruit', 'Warm water with lemon', 'Light herbal infusion'],
    };

    return baseIngredients[mealType] || baseIngredients[MealType.LUNCH];
  }

  private getFestivalForDate(date: Date, region: IndianRegion): { name: string; description: string } | null {
    // This would integrate with a festival database
    // For now, return null
    return null;
  }

  private getSeasonForDate(date: Date): string {
    const month = date.getMonth() + 1;
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  // Save Meal Plan
  async saveMealPlan(mealPlans: MindfulMealPlan[], householdId: string): Promise<MealPlan[]> {
    const savedPlans: MealPlan[] = [];

    for (const mealPlan of mealPlans) {
      const plan = this.mealPlanRepo.create({
        householdId,
        name: mealPlan.recipe?.name || mealPlan.customMeal?.name || 'Mindful Meal',
        description: mealPlan.recipe?.description || mealPlan.customMeal?.description,
        planType: PlanType.DAILY,
        status: PlanStatus.DRAFT,
        date: mealPlan.date as any,
        mealType: mealPlan.mealType,
        recipeId: mealPlan.recipe?.id,
        customMealName: mealPlan.customMeal?.name,
        customMealDescription: mealPlan.customMeal?.description,
        mindfulnessGoals: {
          theme: mealPlan.mindfulnessTheme as any,
          intention: mealPlan.intention,
          meditationPrompt: mealPlan.meditationPrompt,
          breathingExercise: mealPlan.breathingExercise,
        },
        culturalContext: mealPlan.culturalContext ? {
          culturalSignificance: mealPlan.culturalContext,
        } : undefined,
        healthConsiderations: {
          healthGoals: mealPlan.healthBenefits,
        },
        nutritionalGoals: {
          targetCalories: mealPlan.nutritionalGoals.calories,
          targetProtein: mealPlan.nutritionalGoals.protein,
          targetCarbs: mealPlan.nutritionalGoals.carbs,
          targetFat: mealPlan.nutritionalGoals.fat,
          targetFiber: mealPlan.nutritionalGoals.fiber,
        },
      } as any);

      const savedPlan = await (this.mealPlanRepo.save as any)(plan);
      savedPlans.push(savedPlan);
    }

    return savedPlans;
  }
}
