import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Vendor } from './Vendor';
import { OrderItem } from './OrderItem';
import { CartItem } from './CartItem';

export enum ProductCategory {
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

export enum VendorType {
  BLINKIT = 'blinkit',
  ZEPTO = 'zepto',
  SWIGGY = 'swiggy',
  LOCAL_KIRANA = 'local_kirana',
  AMAZON_FRESH = 'amazon_fresh',
  BIG_BASKET = 'big_basket',
}

@Entity('commerce_products')
@Index(['vendorId', 'vendorProductId'], { unique: true })
@Index(['category', 'isAvailable'])
@Index(['price', 'isAvailable'])
export class CommerceProduct {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  vendorId!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  vendorProductId!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  category!: ProductCategory;

  @Column({ type: 'varchar', length: 50, nullable: false })
  vendorType!: VendorType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice?: number;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'piece' })
  unit!: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight?: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  weightUnit?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl?: string;

  @Column({ type: 'jsonb', nullable: true })
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  dietaryInfo?: {
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isOrganic?: boolean;
    allergens?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  regionalInfo?: {
    origin?: string;
    seasonal?: boolean;
    bestSeason?: string[];
    regionalNames?: Record<string, string>;
  };

  @Column({ type: 'boolean', default: true })
  isAvailable!: boolean;

  @Column({ type: 'integer', default: 0 })
  stockQuantity!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  vendorUrl?: string;

  @Column({ type: 'jsonb', nullable: true })
  vendorMetadata?: {
    rating?: number;
    reviewCount?: number;
    deliveryTime?: string;
    minOrderAmount?: number;
    deliveryFee?: number;
  };

  @Column({ type: 'timestamp', nullable: true })
  lastUpdatedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Vendor, vendor => vendor.products)
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;

  @OneToMany(() => OrderItem, item => item.product)
  orderItems!: OrderItem[];

  @OneToMany(() => CartItem, item => item.product)
  cartItems!: CartItem[];

  // Virtual properties
  get hasDiscount(): boolean {
    return this.originalPrice !== undefined && this.originalPrice > this.price;
  }

  get discountPercentage(): number {
    if (!this.hasDiscount) return 0;
    return Math.round(((this.originalPrice! - this.price) / this.originalPrice!) * 100);
  }

  get isSeasonal(): boolean {
    return this.regionalInfo?.seasonal || false;
  }

  get isOrganic(): boolean {
    return this.dietaryInfo?.isOrganic || false;
  }

  get isVegetarian(): boolean {
    return this.dietaryInfo?.isVegetarian || false;
  }

  get isVegan(): boolean {
    return this.dietaryInfo?.isVegan || false;
  }

  get isGlutenFree(): boolean {
    return this.dietaryInfo?.isGlutenFree || false;
  }

  get hasAllergens(): boolean {
    return this.dietaryInfo?.allergens && this.dietaryInfo.allergens.length > 0;
  }
}
