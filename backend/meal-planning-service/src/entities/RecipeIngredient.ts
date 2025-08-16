import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Recipe } from './Recipe';

export enum IngredientRole {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SEASONING = 'seasoning',
  GARNISH = 'garnish',
  OPTIONAL = 'optional',
  SUBSTITUTE = 'substitute',
}

export enum IngredientType {
  VEGETABLE = 'vegetable',
  FRUIT = 'fruit',
  GRAIN = 'grain',
  LEGUME = 'legume',
  DAIRY = 'dairy',
  MEAT = 'meat',
  FISH = 'fish',
  EGG = 'egg',
  NUT = 'nut',
  SEED = 'seed',
  SPICE = 'spice',
  HERB = 'herb',
  OIL = 'oil',
  SWEETENER = 'sweetener',
  CONDIMENT = 'condiment',
  BEVERAGE = 'beverage',
  PROCESSED = 'processed',
}

@Entity('recipe_ingredients')
@Index(['recipeId', 'role'])
@Index(['recipeId', 'type'])
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  recipeId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'varchar', length: 50 })
  unit!: string; // kg, liters, pieces, tbsp, tsp, etc.

  @Column({ type: 'enum', enum: IngredientRole, default: IngredientRole.PRIMARY })
  role!: IngredientRole;

  @Column({ type: 'enum', enum: IngredientType, default: IngredientType.VEGETABLE })
  type!: IngredientType;

  @Column({ type: 'int', default: 1 })
  order!: number; // Order in recipe

  @Column({ type: 'boolean', default: false })
  isOptional!: boolean;

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
    antioxidants?: string[];
    antiInflammatory?: boolean;
    gutHealth?: boolean;
    brainHealth?: boolean;
    heartHealth?: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  mindfulnessInfo?: {
    mindfulEatingTip?: string;
    sensoryExperience?: string;
    emotionalBenefit?: string;
    gratitudePrompt?: string;
    meditationFocus?: string;
    breathingReminder?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  culturalInfo?: {
    origin?: string;
    traditionalUse?: string;
    culturalSignificance?: string;
    seasonalAvailability?: string[];
    regionalVariation?: string;
    festivalAssociation?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  cookingInfo?: {
    preparation?: string;
    cookingMethod?: string;
    timing?: string;
    temperature?: string;
    tips?: string[];
    substitutions?: string[];
    variations?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  healthInfo?: {
    benefits?: string[];
    precautions?: string[];
    allergies?: string[];
    interactions?: string[];
    bestTime?: 'morning' | 'afternoon' | 'evening' | 'anytime';
    seasonalRecommendation?: string[];
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
  @ManyToOne(() => Recipe, recipe => recipe.ingredients)
  @JoinColumn({ name: 'recipeId' })
  recipe!: Recipe;

  // Virtual properties
  get isEssential(): boolean {
    return !this.isOptional && this.role !== IngredientRole.GARNISH;
  }

  get isSeasoning(): boolean {
    return this.role === IngredientRole.SEASONING;
  }

  get isGarnish(): boolean {
    return this.role === IngredientRole.GARNISH;
  }

  get isSubstitute(): boolean {
    return this.role === IngredientRole.SUBSTITUTE;
  }

  get isHealthy(): boolean {
    if (!this.nutritionalInfo) return false;
    const { protein, fiber, sugar, sodium } = this.nutritionalInfo;
    return (protein || 0) > 0 && (fiber || 0) > 0 && (sugar || 0) < 10 && (sodium || 0) < 500;
  }

  get isMindful(): boolean {
    return !!(this.mindfulnessInfo?.mindfulEatingTip || this.mindfulnessInfo?.meditationFocus);
  }

  get isCultural(): boolean {
    return !!(this.culturalInfo?.origin || this.culturalInfo?.traditionalUse || this.culturalInfo?.festivalAssociation);
  }

  get isSeasonal(): boolean {
    return !!(this.culturalInfo?.seasonalAvailability && this.culturalInfo.seasonalAvailability.length > 0);
  }

  get displayName(): string {
    if (this.description) {
      return `${this.name} (${this.description})`;
    }
    return this.name;
  }

  get fullDescription(): string {
    let desc = `${this.quantity} ${this.unit} ${this.name}`;
    if (this.description) {
      desc += ` - ${this.description}`;
    }
    if (this.isOptional) {
      desc += ' (optional)';
    }
    return desc;
  }
}
