import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Household } from './Household';
import { Recipe } from './Recipe';

export enum MealType {
  BREAKFAST = 'breakfast',
  MORNING_SNACK = 'morning_snack',
  LUNCH = 'lunch',
  AFTERNOON_SNACK = 'afternoon_snack',
  DINNER = 'dinner',
  EVENING_SNACK = 'evening_snack',
  LATE_NIGHT = 'late_night',
}

export enum PlanType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
  FESTIVAL = 'festival',
  SEASONAL = 'seasonal',
  HEALTH_GOAL = 'health_goal',
  MINDFULNESS = 'mindfulness',
}

export enum PlanStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum MindfulnessTheme {
  GRATITUDE = 'gratitude',
  PRESENCE = 'presence',
  JOY = 'joy',
  LOVE = 'love',
  PATIENCE = 'patience',
  COMPASSION = 'compassion',
  WISDOM = 'wisdom',
  BALANCE = 'balance',
  HARMONY = 'harmony',
  PEACE = 'peace',
}

@Entity('meal_plans')
@Index(['householdId', 'date'])
@Index(['householdId', 'planType'])
@Index(['householdId', 'status'])
@Index(['householdId', 'mindfulnessTheme'])
export class MealPlan {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  householdId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: PlanType, default: PlanType.DAILY })
  planType!: PlanType;

  @Column({ type: 'enum', enum: PlanStatus, default: PlanStatus.DRAFT })
  status!: PlanStatus;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date; // For weekly/monthly plans

  @Column({ type: 'enum', enum: MealType })
  mealType!: MealType;

  @Column({ type: 'uuid', nullable: true })
  recipeId?: string; // Optional - can be custom meal

  @Column({ type: 'varchar', length: 255, nullable: true })
  customMealName?: string;

  @Column({ type: 'text', nullable: true })
  customMealDescription?: string;

  @Column({ type: 'jsonb', nullable: true })
  nutritionalGoals?: {
    targetCalories?: number;
    targetProtein?: number;
    targetCarbs?: number;
    targetFat?: number;
    targetFiber?: number;
    targetSugar?: number;
    targetSodium?: number;
    vitaminGoals?: string[];
    mineralGoals?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  mindfulnessGoals?: {
    theme: MindfulnessTheme;
    intention?: string;
    meditationPrompt?: string;
    breathingExercise?: string;
    gratitudePractice?: string;
    sensoryAwareness?: string[];
    emotionalBalance?: string;
    stressReduction?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  culturalContext?: {
    festival?: string;
    occasion?: string;
    regionalPreference?: string;
    traditionalDish?: boolean;
    culturalSignificance?: string;
    seasonalConnection?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  healthConsiderations?: {
    dietaryRestrictions?: string[];
    allergies?: string[];
    healthGoals?: string[];
    medicalConditions?: string[];
    energyLevel?: 'low' | 'medium' | 'high';
    mood?: 'calm' | 'energized' | 'balanced';
    stressLevel?: 'low' | 'medium' | 'high';
  };

  @Column({ type: 'jsonb', nullable: true })
  preparationInfo?: {
    prepTime?: number;
    cookTime?: number;
    totalTime?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    equipment?: string[];
    ingredients?: string[];
    substitutions?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  servingInfo?: {
    portions?: number;
    servingSize?: string;
    presentation?: string;
    accompaniments?: string[];
    beverages?: string[];
    garnishes?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    favorite?: boolean;
    rating?: number;
    notes?: string;
    modifications?: string[];
    feedback?: string;
    lastCooked?: Date;
    cookFrequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'weekly';
  };

  @Column({ type: 'jsonb', nullable: true })
  aiMetadata?: {
    generatedBy?: string;
    confidence?: number;
    nutritionScore?: number;
    mindfulnessScore?: number;
    culturalScore?: number;
    healthScore?: number;
    seasonalScore?: number;
    lastOptimized?: Date;
    recommendations?: string[];
  };

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Household, household => household.mealPlans)
  @JoinColumn({ name: 'householdId' })
  household!: Household;

  @ManyToOne(() => Recipe, recipe => recipe.mealPlans)
  @JoinColumn({ name: 'recipeId' })
  recipe?: Recipe;

  // Virtual properties
  get isCustomMeal(): boolean {
    return !this.recipeId && !!this.customMealName;
  }

  get isRecipeBased(): boolean {
    return !!this.recipeId;
  }

  get isMultiDayPlan(): boolean {
    return this.planType === PlanType.WEEKLY || this.planType === PlanType.MONTHLY;
  }

  get isSingleDayPlan(): boolean {
    return this.planType === PlanType.DAILY;
  }

  get isFestivalPlan(): boolean {
    return this.planType === PlanType.FESTIVAL;
  }

  get isSeasonalPlan(): boolean {
    return this.planType === PlanType.SEASONAL;
  }

  get isHealthGoalPlan(): boolean {
    return this.planType === PlanType.HEALTH_GOAL;
  }

  get isMindfulnessPlan(): boolean {
    return this.planType === PlanType.MINDFULNESS;
  }

  get hasMindfulnessGoals(): boolean {
    return !!(this.mindfulnessGoals?.theme || this.mindfulnessGoals?.intention);
  }

  get hasCulturalContext(): boolean {
    return !!(this.culturalContext?.festival || this.culturalContext?.occasion || this.culturalContext?.traditionalDish);
  }

  get hasHealthConsiderations(): boolean {
    return !!(this.healthConsiderations?.dietaryRestrictions || this.healthConsiderations?.healthGoals);
  }

  get isActivePlan(): boolean {
    return this.status === PlanStatus.ACTIVE || this.status === PlanStatus.IN_PROGRESS;
  }

  get canBeCompleted(): boolean {
    return this.isActivePlan;
  }

  get displayName(): string {
    if (this.isCustomMeal) {
      return this.customMealName!;
    }
    return this.recipe?.name || 'Unknown Recipe';
  }

  get fullDescription(): string {
    let desc = this.description || '';
    
    if (this.mindfulnessGoals?.intention) {
      desc += `\n\n🧘 Intention: ${this.mindfulnessGoals.intention}`;
    }
    
    if (this.culturalContext?.festival) {
      desc += `\n\n🎉 Festival: ${this.culturalContext.festival}`;
    }
    
    if (this.healthConsiderations?.healthGoals && this.healthConsiderations.healthGoals.length > 0) {
      desc += `\n\n🌱 Health Goals: ${this.healthConsiderations.healthGoals.join(', ')}`;
    }
    
    return desc;
  }

  get totalTimeMinutes(): number {
    if (this.preparationInfo?.totalTime) {
      return this.preparationInfo.totalTime;
    }
    return (this.preparationInfo?.prepTime || 0) + (this.preparationInfo?.cookTime || 0);
  }

  get isQuickMeal(): boolean {
    return this.totalTimeMinutes <= 30;
  }

  get isComplexMeal(): boolean {
    return this.totalTimeMinutes > 60;
  }

  get mindfulnessScore(): number {
    if (!this.mindfulnessGoals) return 0;
    let score = 0;
    if (this.mindfulnessGoals.theme) score += 20;
    if (this.mindfulnessGoals.intention) score += 20;
    if (this.mindfulnessGoals.meditationPrompt) score += 15;
    if (this.mindfulnessGoals.breathingExercise) score += 15;
    if (this.mindfulnessGoals.gratitudePractice) score += 15;
    if (this.mindfulnessGoals.sensoryAwareness) score += 15;
    return Math.min(score, 100);
  }

  get culturalAuthenticity(): number {
    if (!this.culturalContext) return 0;
    let score = 0;
    if (this.culturalContext.festival) score += 30;
    if (this.culturalContext.occasion) score += 25;
    if (this.culturalContext.regionalPreference) score += 20;
    if (this.culturalContext.traditionalDish) score += 15;
    if (this.culturalContext.culturalSignificance) score += 10;
    return Math.min(score, 100);
  }
}
