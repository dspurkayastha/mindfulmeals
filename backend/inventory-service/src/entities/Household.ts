import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PantryItem } from './PantryItem';

export enum IndianRegion {
  PUNJAB = 'punjab',
  HARYANA = 'haryana',
  DELHI = 'delhi',
  UTTAR_PRADESH = 'uttar_pradesh',
  UTTARAKHAND = 'uttarakhand',
  HIMACHAL_PRADESH = 'himachal_pradesh',
  JAMMU_KASHMIR = 'jammu_kashmir',
  LADAKH = 'ladakh',
  RAJASTHAN = 'rajasthan',
  MADHYA_PRADESH = 'madhya_pradesh',
  CHHATTISGARH = 'chhattisgarh',
  JHARKHAND = 'jharkhand',
  BIHAR = 'bihar',
  WEST_BENGAL = 'west_bengal',
  ODISHA = 'odisha',
  ASSAM = 'assam',
  ARUNACHAL_PRADESH = 'arunachal_pradesh',
  NAGALAND = 'nagaland',
  MANIPUR = 'manipur',
  MIZORAM = 'mizoram',
  TRIPURA = 'tripura',
  MEGHALAYA = 'meghalaya',
  SIKKIM = 'sikkim',
  MAHARASHTRA = 'maharashtra',
  GUJARAT = 'gujarat',
  GOA = 'goa',
  KARNATAKA = 'karnataka',
  TAMIL_NADU = 'tamil_nadu',
  KERALA = 'kerala',
  ANDHRA_PRADESH = 'andhra_pradesh',
  TELANGANA = 'telangana',
  CHANDIGARH = 'chandigarh',
  DADRA_NAGAR_HAVELI = 'dadra_nagar_haveli',
  DAMAN_DIU = 'daman_diu',
  LAKSHADWEEP = 'lakshadweep',
  PUDUCHERRY = 'puducherry',
  ANDAMAN_NICOBAR = 'andaman_nicobar',
}

export enum DietaryType {
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
  FLEXITARIAN = 'flexitarian',
}

@Entity('households')
export class Household {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'enum', enum: IndianRegion })
  region!: IndianRegion;

  @Column({ type: 'enum', enum: DietaryType, default: DietaryType.VEGETARIAN })
  dietaryType!: DietaryType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget?: number;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency!: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  pincode?: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    primaryLanguage?: string;
    traditionalCookingMethods?: string[];
    seasonalIngredients?: boolean;
    festivalCuisine?: string[];
    streetFoodPreferences?: string[];
    spiceBlends?: string[];
    organicPreference?: boolean;
    localSourcing?: boolean;
    bulkBuying?: boolean;
    mealPlanning?: boolean;
    wasteReduction?: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  stats?: {
    dominantCuisine?: string;
    spiceTolerance?: 'low' | 'medium' | 'high';
    seasonalCookingFrequency?: 'rarely' | 'sometimes' | 'often' | 'always';
    traditionalRecipeCount?: number;
    fusionRecipeCount?: number;
    streetFoodFrequency?: 'never' | 'rarely' | 'sometimes' | 'often';
    averageMealPrepTime?: number;
    preferredCookingMethods?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  pantrySettings?: {
    lowStockThreshold?: number;
    expiryReminderDays?: number;
    autoReorderEnabled?: boolean;
    preferredVendors?: string[];
    budgetAlerts?: boolean;
    wasteTracking?: boolean;
    inventoryCheckFrequency?: 'daily' | 'weekly' | 'monthly';
    barcodeScanning?: boolean;
    nutritionalTracking?: boolean;
    allergenAlerts?: boolean;
  };

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => PantryItem, pantryItem => pantryItem.household)
  pantryItems!: PantryItem[];

  // Virtual properties
  get primaryCuisine(): string {
    const regionMap: Record<IndianRegion, string> = {
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
    return regionMap[this.region] || 'Indian';
  }

  get totalPantryItems(): number {
    return this.pantryItems?.length || 0;
  }

  get activePantryItems(): number {
    return this.pantryItems?.filter(item => item.isActive).length || 0;
  }

  get lowStockItems(): number {
    return this.pantryItems?.filter(item => item.needsRestocking).length || 0;
  }

  get expiringItems(): number {
    return this.pantryItems?.filter(item => item.isExpiringSoon).length || 0;
  }
}
