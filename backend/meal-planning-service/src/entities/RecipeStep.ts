import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Recipe } from './Recipe';

export enum StepType {
  PREPARATION = 'preparation',
  COOKING = 'cooking',
  ASSEMBLY = 'assembly',
  GARNISHING = 'garnishing',
  SERVING = 'serving',
  CLEANUP = 'cleanup',
}

export enum MindfulnessPrompt {
  BREATHING = 'breathing',
  GRATITUDE = 'gratitude',
  SENSORY = 'sensory',
  PATIENCE = 'patience',
  PRESENCE = 'presence',
  JOY = 'joy',
  LOVE = 'love',
  INTENTION = 'intention',
}

@Entity('recipe_steps')
@Index(['recipeId', 'order'])
@Index(['recipeId', 'type'])
export class RecipeStep {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  recipeId!: string;

  @Column({ type: 'int' })
  order!: number; // Step order in recipe

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: StepType, default: StepType.COOKING })
  type!: StepType;

  @Column({ type: 'int', default: 5 })
  estimatedTime!: number; // in minutes

  @Column({ type: 'jsonb', nullable: true })
  mindfulnessPrompt?: {
    type: MindfulnessPrompt;
    prompt: string;
    duration?: number; // seconds to pause and reflect
    breathingPattern?: string;
    meditationFocus?: string;
    gratitudeStatement?: string;
    sensoryReminder?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  culturalContext?: {
    traditionalMethod?: string;
    culturalSignificance?: string;
    regionalVariation?: string;
    festivalConnection?: string;
    story?: string;
    blessing?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  cookingDetails?: {
    temperature?: string;
    technique?: string;
    equipment?: string[];
    tips?: string[];
    warnings?: string[];
    visualCues?: string[];
    timingCues?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  healthNotes?: {
    benefits?: string[];
    precautions?: string[];
    nutritionalImpact?: string;
    digestiveNotes?: string;
    energyEffect?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  substitutions?: {
    alternativeIngredients?: string[];
    alternativeMethods?: string[];
    reasons?: string[];
    impact?: string;
  };

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  videoUrl?: string;

  @Column({ type: 'boolean', default: false })
  isOptional!: boolean;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Recipe, recipe => recipe.steps)
  @JoinColumn({ name: 'recipeId' })
  recipe!: Recipe;

  // Virtual properties
  get isPreparationStep(): boolean {
    return this.type === StepType.PREPARATION;
  }

  get isCookingStep(): boolean {
    return this.type === StepType.COOKING;
  }

  get isAssemblyStep(): boolean {
    return this.type === StepType.ASSEMBLY;
  }

  get isGarnishingStep(): boolean {
    return this.type === StepType.GARNISHING;
  }

  get isServingStep(): boolean {
    return this.type === StepType.SERVING;
  }

  get isCleanupStep(): boolean {
    return this.type === StepType.CLEANUP;
  }

  get hasMindfulnessPrompt(): boolean {
    return !!this.mindfulnessPrompt;
  }

  get isMindfulStep(): boolean {
    return this.hasMindfulnessPrompt && this.mindfulnessPrompt!.type !== MindfulnessPrompt.BREATHING;
  }

  get hasCulturalContext(): boolean {
    return !!(this.culturalContext?.traditionalMethod || this.culturalContext?.culturalSignificance);
  }

  get isTraditionalStep(): boolean {
    return !!(this.culturalContext?.traditionalMethod || this.culturalContext?.story);
  }

  get hasHealthNotes(): boolean {
    return !!(this.healthNotes?.benefits || this.healthNotes?.nutritionalImpact);
  }

  get isHealthyStep(): boolean {
    return this.hasHealthNotes && !this.healthNotes?.precautions;
  }

  get hasSubstitutions(): boolean {
    return !!(this.substitutions?.alternativeIngredients || this.substitutions?.alternativeMethods);
  }

  get isFlexibleStep(): boolean {
    return this.hasSubstitutions || this.isOptional;
  }

  get displayTitle(): string {
    if (this.isOptional) {
      return `${this.title} (Optional)`;
    }
    return this.title;
  }

  get fullDescription(): string {
    let desc = this.description;
    
    if (this.mindfulnessPrompt) {
      desc += `\n\n🧘 Mindfulness: ${this.mindfulnessPrompt.prompt}`;
      if (this.mindfulnessPrompt.duration) {
        desc += `\n⏱️ Take ${this.mindfulnessPrompt.duration} seconds to reflect`;
      }
    }
    
    if (this.culturalContext?.story) {
      desc += `\n\n📖 Cultural Story: ${this.culturalContext.story}`;
    }
    
    if (this.cookingDetails?.tips && this.cookingDetails.tips.length > 0) {
      desc += `\n\n💡 Tips: ${this.cookingDetails.tips.join(', ')}`;
    }
    
    if (this.healthNotes?.benefits && this.healthNotes.benefits.length > 0) {
      desc += `\n\n🌱 Health Benefits: ${this.healthNotes.benefits.join(', ')}`;
    }
    
    return desc;
  }

  get estimatedTimeFormatted(): string {
    if (this.estimatedTime < 1) {
      return 'Less than 1 minute';
    } else if (this.estimatedTime === 1) {
      return '1 minute';
    } else {
      return `${this.estimatedTime} minutes`;
    }
  }
}
