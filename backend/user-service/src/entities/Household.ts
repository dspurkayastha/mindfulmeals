import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './User';

export enum IndianRegion {
  // North Indian States
  PUNJAB = 'punjab',
  HARYANA = 'haryana',
  UTTAR_PRADESH = 'uttar_pradesh',
  UTTARAKHAND = 'uttarakhand',
  HIMACHAL_PRADESH = 'himachal_pradesh',
  JAMMU_KASHMIR = 'jammu_kashmir',
  DELHI = 'delhi',
  CHANDIGARH = 'chandigarh',
  
  // South Indian States
  TAMIL_NADU = 'tamil_nadu',
  KERALA = 'kerala',
  KARNATAKA = 'karnataka',
  ANDHRA_PRADESH = 'andhra_pradesh',
  TELANGANA = 'telangana',
  PUDUCHERRY = 'puducherry',
  
  // East Indian States
  WEST_BENGAL = 'west_bengal',
  BIHAR = 'bihar',
  JHARKHAND = 'jharkhand',
  ODISHA = 'odisha',
  
  // West Indian States
  MAHARASHTRA = 'maharashtra',
  GUJARAT = 'gujarat',
  GOA = 'goa',
  RAJASTHAN = 'rajasthan',
  MADHYA_PRADESH = 'madhya_pradesh',
  
  // Northeast Indian States
  ASSAM = 'assam',
  ARUNACHAL_PRADESH = 'arunachal_pradesh',
  MANIPUR = 'manipur',
  MEGHALAYA = 'meghalaya',
  MIZORAM = 'mizoram',
  NAGALAND = 'nagaland',
  TRIPURA = 'tripura',
  SIKKIM = 'sikkim',
  
  // Union Territories
  ANDAMAN_NICOBAR = 'andaman_nicobar',
  DADRA_NAGAR_HAVELI = 'dadra_nagar_haveli',
  DAMAN_DIU = 'daman_diu',
  LAKSHADWEEP = 'lakshadweep'
}

export enum DietaryType {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  MIXED = 'mixed',
  JAIN = 'jain',
  HALAL = 'halal',
}

@Entity('households')
@Index(['name', 'region'], { unique: true })
export class Household {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  region!: IndianRegion;

  @Column({ type: 'varchar', length: 30, nullable: false, default: DietaryType.VEGETARIAN })
  dietaryType!: DietaryType;

  @Column({ type: 'integer', nullable: true })
  budgetMonthly?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  pincode?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state?: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    cuisinePreferences: string[];
    spiceLevel: 'mild' | 'medium' | 'hot';
    mealTimings: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
    specialOccasions: string[];
    mindfulnessSettings: {
      mealReminders: boolean;
      breathingExercises: boolean;
      gratitudeJournal: boolean;
    };
    // Granular regional preferences
    regionalPreferences: {
      primaryLanguage: 'hindi' | 'bengali' | 'tamil' | 'telugu' | 'kannada' | 'malayalam' | 'gujarati' | 'marathi' | 'punjabi' | 'assamese' | 'odia' | 'english';
      traditionalCookingMethods: string[]; // e.g., ['tandoor', 'dum', 'bhuna', 'steaming']
      seasonalIngredients: string[]; // e.g., ['mango', 'jackfruit', 'bamboo_shoots']
      festivalCuisine: string[]; // e.g., ['diwali', 'eid', 'christmas', 'baisakhi']
      streetFoodPreferences: string[]; // e.g., ['chaat', 'vada_pav', 'dosa', 'samosa']
      spiceBlends: string[]; // e.g., ['garam_masala', 'panch_phoron', 'godha_masala']
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  stats?: {
    totalMembers: number;
    averageAge: number;
    primaryCuisine: string;
    lastMealPlanDate?: Date;
    mindfulnessScore: number; // 1-10 scale
    // Regional cuisine insights
    regionalStats: {
      dominantCuisine: string; // e.g., 'bengali', 'tamil', 'punjabi'
      spiceTolerance: 'mild' | 'medium' | 'hot';
      seasonalCookingFrequency: number; // 1-10 scale
      traditionalRecipeCount: number;
      fusionRecipeCount: number;
      streetFoodFrequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'daily';
    };
  };

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => User, (user: User) => user.household)
  members!: User[];

  // Virtual properties (not stored in database)
  get memberCount(): number {
    return this.members?.length || 0;
  }

  get hasPrimaryCook(): boolean {
    return this.members?.some(member => member.role === 'primary_cook') || false;
  }

  get primaryCuisine(): string {
    const regionMap: Record<string, string> = {
      // North Indian
      punjab: 'Punjabi',
      haryana: 'Haryanvi',
      uttar_pradesh: 'Awadhi',
      uttarakhand: 'Kumaoni',
      himachal_pradesh: 'Pahari',
      jammu_kashmir: 'Kashmiri',
      delhi: 'Mughlai',
      chandigarh: 'Punjabi',
      
      // South Indian
      tamil_nadu: 'Tamil',
      kerala: 'Malayali',
      karnataka: 'Kannadiga',
      andhra_pradesh: 'Telugu',
      telangana: 'Telugu',
      puducherry: 'French-Indian',
      
      // East Indian
      west_bengal: 'Bengali',
      bihar: 'Bihari',
      jharkhand: 'Jharkhandi',
      odisha: 'Odia',
      
      // West Indian
      maharashtra: 'Maharashtrian',
      gujarat: 'Gujarati',
      goa: 'Goan',
      rajasthan: 'Rajasthani',
      madhya_pradesh: 'Madhya Pradeshi',
      
      // Northeast Indian
      assam: 'Assamese',
      arunachal_pradesh: 'Arunachali',
      manipur: 'Manipuri',
      meghalaya: 'Khasi',
      mizoram: 'Mizo',
      nagaland: 'Naga',
      tripura: 'Tripuri',
      sikkim: 'Sikkimese',
      
      // Union Territories
      andaman_nicobar: 'Andamanese',
      dadra_nagar_haveli: 'Gujarati',
      daman_diu: 'Gujarati',
      lakshadweep: 'Malayali'
    };
    
    return regionMap[this.region] || this.region.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  get isBudgetConstrained(): boolean {
    return this.budgetMonthly !== undefined && this.budgetMonthly > 0;
  }

  get mindfulnessLevel(): 'beginner' | 'intermediate' | 'advanced' {
    const score = this.stats?.mindfulnessScore || 0;
    if (score <= 3) return 'beginner';
    if (score <= 7) return 'intermediate';
    return 'advanced';
  }
}
