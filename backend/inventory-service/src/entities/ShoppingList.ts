import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Household } from './Household';
import { ShoppingListItem } from './ShoppingListItem';

export enum ShoppingListStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum ShoppingListType {
  MANUAL = 'manual',
  AUTO_GENERATED = 'auto_generated',
  MEAL_PLAN_BASED = 'meal_plan_based',
  LOW_STOCK = 'low_stock',
  EXPIRY_BASED = 'expiry_based',
  RECIPE_BASED = 'recipe_based',
}

@Entity('shopping_lists')
@Index(['householdId', 'status'])
@Index(['householdId', 'type'])
@Index(['householdId', 'createdAt'])
export class ShoppingList {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  householdId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ShoppingListStatus, default: ShoppingListStatus.DRAFT })
  status!: ShoppingListStatus;

  @Column({ type: 'enum', enum: ShoppingListType, default: ShoppingListType.MANUAL })
  type!: ShoppingListType;

  @Column({ type: 'date', nullable: true })
  plannedShoppingDate?: Date;

  @Column({ type: 'date', nullable: true })
  actualShoppingDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  estimatedBudget!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  actualSpent!: number;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency!: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    preferredVendors?: string[];
    organicPreference?: boolean;
    localSourcing?: boolean;
    bulkBuying?: boolean;
    deliveryPreference?: 'pickup' | 'delivery' | 'both';
    timePreference?: 'morning' | 'afternoon' | 'evening';
    budgetLimit?: number;
    priorityItems?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    source?: string; // meal plan, low stock, manual, etc.
    relatedMealPlanId?: string;
    relatedRecipeIds?: string[];
    generatedBy?: string; // system, user, ai
    generationReason?: string;
    lastModifiedBy?: string;
    modificationReason?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  stats?: {
    totalItems?: number;
    completedItems?: number;
    pendingItems?: number;
    priorityItems?: number;
    organicItems?: number;
    localItems?: number;
    estimatedWeight?: number;
    estimatedVolume?: number;
    categories?: string[];
    vendors?: string[];
  };

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Household, household => household.shoppingLists)
  @JoinColumn({ name: 'householdId' })
  household!: Household;

  @OneToMany(() => ShoppingListItem, item => item.shoppingList, { cascade: true })
  items!: ShoppingListItem[];

  // Virtual properties
  get completionRate(): number {
    if (!this.items || this.items.length === 0) return 0;
    const completedItems = this.items.filter(item => item.isCompleted).length;
    return Math.round((completedItems / this.items.length) * 100);
  }

  get isOverBudget(): boolean {
    return this.actualSpent > this.estimatedBudget;
  }

  get budgetUtilization(): number {
    if (this.estimatedBudget === 0) return 0;
    return Math.round((this.actualSpent / this.estimatedBudget) * 100);
  }

  get priorityItems(): ShoppingListItem[] {
    return this.items?.filter(item => item.priority === 'high') || [];
  }

  get pendingItems(): ShoppingListItem[] {
    return this.items?.filter(item => !item.isCompleted) || [];
  }

  get completedItems(): ShoppingListItem[] {
    return this.items?.filter(item => item.isCompleted) || [];
  }

  get totalItems(): number {
    return this.items?.length || 0;
  }

  get canBeCompleted(): boolean {
    return this.status === ShoppingListStatus.ACTIVE || this.status === ShoppingListStatus.IN_PROGRESS;
  }

  get estimatedTotalCost(): number {
    return this.items?.reduce((total, item) => total + (item.estimatedPrice || 0), 0) || 0;
  }

  get actualTotalCost(): number {
    return this.items?.reduce((total, item) => total + (item.actualPrice || 0), 0) || 0;
  }
}
