import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Household } from './Household';
import { RecipeIngredient } from './RecipeIngredient';
import { RecipeStep } from './RecipeStep';
import { MealPlan } from './MealPlan';

export enum RecipeCategory {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACKS = 'snacks',
  DESSERTS = 'desserts',
  BEVERAGES = 'beverages',
  APPETIZERS = 'appetizers',
  SOUPS = 'soups',
  SALADS = 'salads',
  BREADS = 'breads',
  RICE_DISHES = 'rice_dishes',
  CURRIES = 'curries',
  STREET_FOOD = 'street_food',
  FESTIVAL_SPECIAL = 'festival_special',
}

export enum RecipeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

export enum RecipeType {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  NON_VEGETARIAN = 'non_vegetarian',
  EGGETARIAN = 'eggetarian',
  JAIN = 'jain',
  HALAL = 'halal',
  KOSHER = 'kosher',
  GLUTEN_FREE = 'gluten_free',
  DAIRY_FREE = 'dairy_free',
  NUT_FREE = 'nut_free',
  LOW_CARB = 'low_carb',
  KETO = 'keto',
  PALEO = 'paleo',
  AYURVEDIC = 'ayurvedic',
}

export enum MindfulnessLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

@Entity('recipes')
@Index(['householdId', 'category'])
@Index(['householdId', 'type'])
@Index(['householdId', 'difficulty'])
@Index(['householdId', 'mindfulnessLevel'])
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  householdId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: RecipeCategory })
  category!: RecipeCategory;

  @Column({ type: 'enum', enum: RecipeType })
  type!: RecipeType;

  @Column({ type: 'enum', enum: RecipeDifficulty, default: RecipeDifficulty.MEDIUM })
  difficulty!: RecipeDifficulty;

  @Column({ type: 'enum', enum: MindfulnessLevel, default: MindfulnessLevel.BEGINNER })
  mindfulnessLevel!: MindfulnessLevel;

  @Column({ type: 'int', default: 4 })
  servings!: number;

  @Column({ type: 'int', default: 30 })
  prepTime!: number; // in minutes

  @Column({ type: 'int', default: 30 })
  cookTime!: number; // in minutes

  @Column({ type: 'int', default: 0 })
  totalTime!: number; // calculated field

  @Column({ type: 'text', nullable: true })
  story?: string; // Cultural or family story behind the recipe

  @Column({ type: 'jsonb', nullable: true })
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    vitamins?: string[];
    minerals?: string[];
    glycemicIndex?: number;
    satietyIndex?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  mindfulnessInfo?: {
    meditationPrompt?: string;
    mindfulEatingTips?: string[];
    breathingExercise?: string;
    gratitudePractice?: string;
    sensoryAwareness?: string[];
    emotionalBenefits?: string[];
    stressReduction?: string;
    energyLevel?: 'calming' | 'energizing' | 'balancing';
  };

  @Column({ type: 'jsonb', nullable: true })
  culturalInfo?: {
    origin?: string;
    region?: string;
    festival?: string;
    occasion?: string;
    traditionalUses?: string[];
    culturalSignificance?: string;
    seasonalAvailability?: string[];
    regionalVariations?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  cookingInfo?: {
    techniques?: string[];
    equipment?: string[];
    tips?: string[];
    substitutions?: string[];
    variations?: string[];
    servingSuggestions?: string[];
    storageInstructions?: string;
    reheatingInstructions?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    favorite?: boolean;
    rating?: number;
    reviewCount?: number;
    lastCooked?: Date;
    cookFrequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'weekly';
    notes?: string;
    tags?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  aiMetadata?: {
    generatedBy?: string;
    confidence?: number;
    nutritionScore?: number;
    mindfulnessScore?: number;
    culturalScore?: number;
    difficultyScore?: number;
    popularityScore?: number;
    seasonalScore?: number;
    healthScore?: number;
    lastOptimized?: Date;
  };

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'boolean', default: false })
  isPublic!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Household, household => household.recipes)
  @JoinColumn({ name: 'householdId' })
  household!: Household;

  @OneToMany(() => RecipeIngredient, ingredient => ingredient.recipe, { cascade: true })
  ingredients!: RecipeIngredient[];

  @OneToMany(() => RecipeStep, step => step.recipe, { cascade: true })
  steps!: RecipeStep[];

  @OneToMany(() => MealPlan, mealPlan => mealPlan.recipe)
  mealPlans!: MealPlan[];

  // Virtual properties
  get totalTimeMinutes(): number {
    return this.prepTime + this.cookTime;
  }

  get isQuickRecipe(): boolean {
    return this.totalTimeMinutes <= 30;
  }

  get isComplexRecipe(): boolean {
    return this.difficulty === RecipeDifficulty.HARD || this.difficulty === RecipeDifficulty.EXPERT;
  }

  get isMindfulRecipe(): boolean {
    return this.mindfulnessLevel !== MindfulnessLevel.BEGINNER;
  }

  get isCulturalRecipe(): boolean {
    return !!(this.culturalInfo?.origin || this.culturalInfo?.festival || this.culturalInfo?.occasion);
  }

  get isSeasonalRecipe(): boolean {
    return !!(this.culturalInfo?.seasonalAvailability && this.culturalInfo.seasonalAvailability.length > 0);
  }

  get nutritionDensity(): number {
    if (!this.nutritionalInfo?.calories || this.nutritionalInfo.calories === 0) return 0;
    const nutrients = (this.nutritionalInfo.protein || 0) + (this.nutritionalInfo.fiber || 0);
    return nutrients / this.nutritionalInfo.calories;
  }

  get mindfulnessScore(): number {
    if (!this.mindfulnessInfo) return 0;
    let score = 0;
    if (this.mindfulnessInfo.meditationPrompt) score += 20;
    if (this.mindfulnessInfo.mindfulEatingTips) score += 15;
    if (this.mindfulnessInfo.breathingExercise) score += 15;
    if (this.mindfulnessInfo.gratitudePractice) score += 15;
    if (this.mindfulnessInfo.sensoryAwareness) score += 15;
    if (this.mindfulnessInfo.emotionalBenefits) score += 10;
    if (this.mindfulnessInfo.stressReduction) score += 10;
    return Math.min(score, 100);
  }

  get culturalAuthenticity(): number {
    if (!this.culturalInfo) return 0;
    let score = 0;
    if (this.culturalInfo.origin) score += 25;
    if (this.culturalInfo.region) score += 20;
    if (this.culturalInfo.festival) score += 20;
    if (this.culturalInfo.occasion) score += 15;
    if (this.culturalInfo.traditionalUses) score += 10;
    if (this.culturalInfo.culturalSignificance) score += 10;
    return Math.min(score, 100);
  }
}
