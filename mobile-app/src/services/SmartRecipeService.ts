import AsyncStorage from '@react-native-async-storage/async-storage';
import InsightsEngine from './InsightsEngine';

interface Recipe {
  id: string;
  name: string;
  description: string;
  moodBenefits: string[];
  energyLevel: number; // 1-5
  ingredients: string[];
  prepTime: number;
  cookTime: number;
  tags: string[];
  nutritionFocus: string[];
  image?: string;
}

interface RecipeSuggestion {
  recipe: Recipe;
  matchScore: number;
  matchReasons: string[];
  missingIngredients: string[];
  availableIngredients: string[];
}

interface UserPreferences {
  desiredMood?: string;
  desiredEnergy?: number;
  dietaryRestrictions?: string[];
  recentMeals?: string[];
}

// Mock recipe database - in real app, this would come from API
const RECIPE_DATABASE: Recipe[] = [
  {
    id: '1',
    name: 'Energizing Green Smoothie Bowl',
    description: 'A vibrant smoothie bowl packed with nutrients to boost your energy',
    moodBenefits: ['energized', 'focused'],
    energyLevel: 5,
    ingredients: ['spinach', 'banana', 'mango', 'chia seeds', 'almond milk', 'granola'],
    prepTime: 10,
    cookTime: 0,
    tags: ['breakfast', 'smoothie', 'vegan', 'quick'],
    nutritionFocus: ['vitamins', 'fiber', 'antioxidants'],
  },
  {
    id: '2',
    name: 'Comforting Chicken Soup',
    description: 'A warm, nourishing soup that soothes body and soul',
    moodBenefits: ['comforted', 'satisfied'],
    energyLevel: 3,
    ingredients: ['chicken', 'carrots', 'celery', 'onion', 'noodles', 'herbs'],
    prepTime: 15,
    cookTime: 45,
    tags: ['lunch', 'dinner', 'soup', 'comfort food'],
    nutritionFocus: ['protein', 'hydration', 'minerals'],
  },
  {
    id: '3',
    name: 'Light Mediterranean Salad',
    description: 'Fresh and light salad with Mediterranean flavors',
    moodBenefits: ['light', 'satisfied'],
    energyLevel: 3,
    ingredients: ['cucumber', 'tomatoes', 'feta cheese', 'olives', 'olive oil', 'lemon'],
    prepTime: 15,
    cookTime: 0,
    tags: ['lunch', 'salad', 'vegetarian', 'mediterranean'],
    nutritionFocus: ['healthy fats', 'vegetables', 'calcium'],
  },
  {
    id: '4',
    name: 'Power Protein Bowl',
    description: 'High-protein bowl to keep you satisfied and energized',
    moodBenefits: ['nourished', 'energized'],
    energyLevel: 4,
    ingredients: ['quinoa', 'chickpeas', 'avocado', 'eggs', 'spinach', 'tahini'],
    prepTime: 20,
    cookTime: 15,
    tags: ['lunch', 'dinner', 'bowl', 'high-protein'],
    nutritionFocus: ['protein', 'complex carbs', 'healthy fats'],
  },
  {
    id: '5',
    name: 'Calming Chamomile Oatmeal',
    description: 'Soothing oatmeal with chamomile and honey for a peaceful start',
    moodBenefits: ['comforted', 'satisfied'],
    energyLevel: 2,
    ingredients: ['oats', 'chamomile tea', 'honey', 'almonds', 'cinnamon', 'berries'],
    prepTime: 5,
    cookTime: 10,
    tags: ['breakfast', 'calming', 'vegetarian'],
    nutritionFocus: ['fiber', 'antioxidants', 'slow-release energy'],
  },
  {
    id: '6',
    name: 'Focus-Boosting Salmon',
    description: 'Omega-3 rich salmon with brain-boosting sides',
    moodBenefits: ['focused', 'nourished'],
    energyLevel: 4,
    ingredients: ['salmon', 'broccoli', 'sweet potato', 'garlic', 'lemon', 'herbs'],
    prepTime: 15,
    cookTime: 25,
    tags: ['dinner', 'fish', 'brain food'],
    nutritionFocus: ['omega-3', 'vitamins', 'antioxidants'],
  },
];

class SmartRecipeService {
  private static instance: SmartRecipeService;

  private constructor() {}

  static getInstance(): SmartRecipeService {
    if (!SmartRecipeService.instance) {
      SmartRecipeService.instance = new SmartRecipeService();
    }
    return SmartRecipeService.instance;
  }

  async getSuggestions(preferences?: UserPreferences): Promise<RecipeSuggestion[]> {
    const pantryItems = await this.getPantryItems();
    const userInsights = await this.getUserInsights();
    const mealHistory = await this.getMealHistory();

    // Score each recipe
    const suggestions = await Promise.all(
      RECIPE_DATABASE.map(async (recipe) => {
        const suggestion = await this.scoreRecipe(
          recipe,
          pantryItems,
          preferences,
          userInsights,
          mealHistory
        );
        return suggestion;
      })
    );

    // Sort by match score
    return suggestions
      .filter(s => s.matchScore > 0.3) // Only show relevant matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5); // Top 5 suggestions
  }

  private async scoreRecipe(
    recipe: Recipe,
    pantryItems: string[],
    preferences: UserPreferences | undefined,
    insights: any,
    mealHistory: string[]
  ): Promise<RecipeSuggestion> {
    let score = 0;
    const reasons: string[] = [];

    // 1. Ingredient availability (40% weight)
    const { available, missing } = this.checkIngredients(recipe.ingredients, pantryItems);
    const ingredientScore = available.length / recipe.ingredients.length;
    score += ingredientScore * 0.4;

    if (ingredientScore >= 0.8) {
      reasons.push('You have most ingredients');
    } else if (ingredientScore >= 0.5) {
      reasons.push(`Only ${missing.length} ingredients missing`);
    }

    // 2. Mood alignment (25% weight)
    if (preferences?.desiredMood) {
      const moodMatch = recipe.moodBenefits.includes(preferences.desiredMood);
      if (moodMatch) {
        score += 0.25;
        reasons.push(`Great for feeling ${preferences.desiredMood}`);
      }
    }

    // 3. Energy goal alignment (20% weight)
    if (preferences?.desiredEnergy) {
      const energyDiff = Math.abs(recipe.energyLevel - preferences.desiredEnergy);
      const energyScore = 1 - (energyDiff / 4); // Max diff is 4
      score += energyScore * 0.2;
      
      if (energyDiff <= 1) {
        reasons.push('Matches your energy goal');
      }
    }

    // 4. Time of day appropriateness (10% weight)
    const timeScore = this.getTimeAppropriateness(recipe);
    score += timeScore * 0.1;

    // 5. Variety (5% weight) - penalize recently eaten meals
    if (!mealHistory.includes(recipe.name)) {
      score += 0.05;
    }

    // Bonus points from insights
    if (insights.energyDipTime && this.isGoodForEnergyDip(recipe, insights.energyDipTime)) {
      score += 0.1;
      reasons.push('Perfect for your energy dip time');
    }

    return {
      recipe,
      matchScore: Math.min(score, 1), // Cap at 1
      matchReasons: reasons,
      missingIngredients: missing,
      availableIngredients: available,
    };
  }

  private checkIngredients(
    recipeIngredients: string[],
    pantryItems: string[]
  ): { available: string[]; missing: string[] } {
    const pantryLower = pantryItems.map(i => i.toLowerCase());
    const available: string[] = [];
    const missing: string[] = [];

    recipeIngredients.forEach(ingredient => {
      const found = pantryLower.some(pantryItem => 
        pantryItem.includes(ingredient.toLowerCase()) ||
        ingredient.toLowerCase().includes(pantryItem)
      );
      
      if (found) {
        available.push(ingredient);
      } else {
        missing.push(ingredient);
      }
    });

    return { available, missing };
  }

  private getTimeAppropriateness(recipe: Recipe): number {
    const hour = new Date().getHours();
    
    // Breakfast time (6-10)
    if (hour >= 6 && hour <= 10) {
      return recipe.tags.includes('breakfast') ? 1 : 0.3;
    }
    // Lunch time (11-14)
    else if (hour >= 11 && hour <= 14) {
      return recipe.tags.includes('lunch') ? 1 : 0.5;
    }
    // Dinner time (17-21)
    else if (hour >= 17 && hour <= 21) {
      return recipe.tags.includes('dinner') ? 1 : 0.5;
    }
    // Snack time
    else {
      return recipe.tags.includes('snack') || recipe.prepTime <= 15 ? 0.8 : 0.3;
    }
  }

  private isGoodForEnergyDip(recipe: Recipe, dipHour: number): boolean {
    const currentHour = new Date().getHours();
    const isNearDipTime = Math.abs(currentHour - dipHour) <= 1;
    
    return isNearDipTime && recipe.energyLevel >= 4;
  }

  private async getPantryItems(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem('@pantry_items');
      if (stored) {
        const items = JSON.parse(stored);
        return items.map((item: any) => item.name);
      }
    } catch (error) {
      console.error('Error loading pantry items:', error);
    }
    return [];
  }

  private async getUserInsights(): Promise<any> {
    const insights = await InsightsEngine.generateInsights();
    const energyInsight = insights.find(i => i.type === 'energy_pattern');
    
    return {
      energyDipTime: energyInsight?.data?.hour,
      preferredMoods: insights
        .filter(i => i.type === 'meal_mood')
        .map(i => i.data?.mood)
        .filter(Boolean),
    };
  }

  private async getMealHistory(): Promise<string[]> {
    try {
      const stored = await AsyncStorage.getItem('@meal_history');
      if (stored) {
        const history = JSON.parse(stored);
        // Get meals from last 3 days
        const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
        return history
          .filter((meal: any) => new Date(meal.timestamp).getTime() > threeDaysAgo)
          .map((meal: any) => meal.name);
      }
    } catch (error) {
      console.error('Error loading meal history:', error);
    }
    return [];
  }

  async saveMealToHistory(mealName: string) {
    try {
      const stored = await AsyncStorage.getItem('@meal_history');
      const history = stored ? JSON.parse(stored) : [];
      
      history.push({
        name: mealName,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 30 days
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const filtered = history.filter(
        (meal: any) => new Date(meal.timestamp).getTime() > thirtyDaysAgo
      );

      await AsyncStorage.setItem('@meal_history', JSON.stringify(filtered));
    } catch (error) {
      console.error('Error saving meal history:', error);
    }
  }

  // Get recipes for specific mood/energy goals
  async getRecipesForGoal(goal: {
    mood?: string;
    energyLevel?: number;
  }): Promise<Recipe[]> {
    return RECIPE_DATABASE.filter(recipe => {
      if (goal.mood && !recipe.moodBenefits.includes(goal.mood)) {
        return false;
      }
      if (goal.energyLevel && Math.abs(recipe.energyLevel - goal.energyLevel) > 1) {
        return false;
      }
      return true;
    });
  }

  // Add custom recipe to database (for future use)
  async addCustomRecipe(recipe: Omit<Recipe, 'id'>) {
    const newRecipe: Recipe = {
      ...recipe,
      id: `custom_${Date.now()}`,
    };

    try {
      const stored = await AsyncStorage.getItem('@custom_recipes');
      const customRecipes = stored ? JSON.parse(stored) : [];
      customRecipes.push(newRecipe);
      await AsyncStorage.setItem('@custom_recipes', JSON.stringify(customRecipes));
    } catch (error) {
      console.error('Error saving custom recipe:', error);
    }
  }
}

export default SmartRecipeService.getInstance();