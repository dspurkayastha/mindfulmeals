import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ShoppingList } from './ShoppingList';

export enum ItemPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum ItemSource {
  MANUAL = 'manual',
  LOW_STOCK = 'low_stock',
  EXPIRY = 'expiry',
  MEAL_PLAN = 'meal_plan',
  RECIPE = 'recipe',
  RECOMMENDATION = 'recommendation',
  TRENDING = 'trending',
}

@Entity('shopping_list_items')
@Index(['shoppingListId', 'priority'])
@Index(['shoppingListId', 'isCompleted'])
@Index(['shoppingListId', 'category'])
export class ShoppingListItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  shoppingListId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100 })
  category!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'varchar', length: 50 })
  unit!: string; // kg, liters, pieces, etc.

  @Column({ type: 'enum', enum: ItemPriority, default: ItemPriority.MEDIUM })
  priority!: ItemPriority;

  @Column({ type: 'enum', enum: ItemSource, default: ItemSource.MANUAL })
  source!: ItemSource;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualPrice?: number;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  barcode?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  preferredVendor?: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    organic?: boolean;
    local?: boolean;
    bulk?: boolean;
    specificBrand?: string;
    quality?: 'budget' | 'standard' | 'premium';
    packaging?: 'minimal' | 'standard' | 'premium';
    notes?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  alternatives?: {
    substituteItems?: string[];
    alternativeBrands?: string[];
    alternativeVendors?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    relatedPantryItemId?: string;
    relatedRecipeId?: string;
    relatedMealPlanId?: string;
    lastPurchasedDate?: Date;
    lastPurchasedPrice?: number;
    lastPurchasedVendor?: string;
    averagePrice?: number;
    priceHistory?: Array<{
      date: Date;
      price: number;
      vendor: string;
    }>;
  };

  @Column({ type: 'boolean', default: false })
  isCompleted!: boolean;

  @Column({ type: 'date', nullable: true })
  completedDate?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  purchasedFrom?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => ShoppingList, shoppingList => shoppingList.items)
  @JoinColumn({ name: 'shoppingListId' })
  shoppingList!: ShoppingList;

  // Virtual properties
  get isUrgent(): boolean {
    return this.priority === ItemPriority.URGENT;
  }

  get isHighPriority(): boolean {
    return this.priority === ItemPriority.HIGH || this.priority === ItemPriority.URGENT;
  }

  get priceDifference(): number | null {
    if (!this.estimatedPrice || !this.actualPrice) return null;
    return this.actualPrice - this.estimatedPrice;
  }

  get isOverBudget(): boolean {
    if (!this.estimatedPrice || !this.actualPrice) return false;
    return this.actualPrice > this.estimatedPrice;
  }

  get budgetUtilization(): number | null {
    if (!this.estimatedPrice || !this.actualPrice) return null;
    return Math.round((this.actualPrice / this.estimatedPrice) * 100);
  }

  get daysSinceCreated(): number {
    const now = new Date();
    const created = new Date(this.createdAt);
    return Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }

  get isStale(): boolean {
    return this.daysSinceCreated > 7 && !this.isCompleted;
  }

  get displayName(): string {
    if (this.brand) {
      return `${this.brand} ${this.name}`;
    }
    return this.name;
  }

  get fullDescription(): string {
    let desc = `${this.quantity} ${this.unit} of ${this.displayName}`;
    if (this.description) {
      desc += ` - ${this.description}`;
    }
    if (this.notes) {
      desc += ` (${this.notes})`;
    }
    return desc;
  }
}
