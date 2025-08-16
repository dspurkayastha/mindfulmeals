import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Household } from './Household';

export enum ItemCategory {
  FRUITS_VEGETABLES = 'fruits_vegetables',
  DAIRY_EGGS = 'dairy_eggs',
  MEAT_FISH = 'meat_fish',
  GRAINS_PULSES = 'grains_pulses',
  SPICES_CONDIMENTS = 'spices_condiments',
  SNACKS_BEVERAGES = 'snacks_beverages',
  BAKERY = 'bakery',
  FROZEN_FOODS = 'frozen_foods',
  ORGANIC = 'organic',
  READY_TO_EAT = 'ready_to_eat',
  BEVERAGES = 'beverages',
  PERSONAL_CARE = 'personal_care',
  HOUSEHOLD = 'household',
}

export enum ItemStatus {
  ACTIVE = 'active',
  LOW_STOCK = 'low_stock',
  EXPIRED = 'expired',
  CONSUMED = 'consumed',
  WASTED = 'wasted',
}

export enum StorageLocation {
  REFRIGERATOR = 'refrigerator',
  FREEZER = 'freezer',
  PANTRY = 'pantry',
  COUNTERTOP = 'countertop',
  SPICE_RACK = 'spice_rack',
  WINE_CELLAR = 'wine_cellar',
}

@Entity('pantry_items')
@Index(['householdId', 'category'])
@Index(['householdId', 'expiryDate'])
@Index(['householdId', 'status'])
export class PantryItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  householdId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ItemCategory })
  category!: ItemCategory;

  @Column({ type: 'enum', enum: ItemStatus, default: ItemStatus.ACTIVE })
  status!: ItemStatus;

  @Column({ type: 'enum', enum: StorageLocation, default: StorageLocation.PANTRY })
  storageLocation!: StorageLocation;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'varchar', length: 50 })
  unit!: string; // kg, liters, pieces, etc.

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency?: string;

  @Column({ type: 'date', nullable: true })
  purchaseDate?: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode?: string;

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
  };

  @Column({ type: 'jsonb', nullable: true })
  dietaryInfo?: {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isOrganic?: boolean;
    allergens?: string[];
    certifications?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  regionalInfo?: {
    origin?: string;
    seasonal?: boolean;
    bestSeason?: string[];
    regionalNames?: string[];
    traditionalUses?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  cookingInfo?: {
    cookingTime?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    methods?: string[];
    tips?: string[];
    substitutes?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    favorite?: boolean;
    notes?: string;
    rating?: number;
    lastUsed?: Date;
    usageFrequency?: 'daily' | 'weekly' | 'monthly' | 'rarely';
  };

  @Column({ type: 'jsonb', nullable: true })
  tracking?: {
    lastChecked?: Date;
    checkFrequency?: 'daily' | 'weekly' | 'monthly';
    reminderEnabled?: boolean;
    reminderDays?: number;
    lastReminder?: Date;
  };

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Household, household => household.pantryItems)
  @JoinColumn({ name: 'householdId' })
  household!: Household;

  // Virtual properties
  get isExpired(): boolean {
    if (!this.expiryDate) return false;
    return new Date() > this.expiryDate;
  }

  get isExpiringSoon(): boolean {
    if (!this.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((this.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  }

  get daysUntilExpiry(): number | null {
    if (!this.expiryDate) return null;
    return Math.ceil((this.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  }

  get stockLevel(): 'full' | 'medium' | 'low' | 'critical' {
    // This would be configurable per household
    if (this.quantity <= 0.1) return 'critical';
    if (this.quantity <= 0.5) return 'low';
    if (this.quantity <= 1.0) return 'medium';
    return 'full';
  }

  get needsRestocking(): boolean {
    return this.stockLevel === 'low' || this.stockLevel === 'critical';
  }
}
