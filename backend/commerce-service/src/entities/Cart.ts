import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { CartItem } from './CartItem';

export enum CartStatus {
  ACTIVE = 'active',
  CONVERTED = 'converted',
  ABANDONED = 'abandoned',
  EXPIRED = 'expired',
}

@Entity('carts')
@Index(['userId', 'status'])
@Index(['sessionId'], { unique: true })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  sessionId!: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: CartStatus.ACTIVE })
  status!: CartStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  pincode?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state?: string;

  @Column({ type: 'jsonb', nullable: true })
  deliveryPreferences?: {
    deliveryTime?: string;
    deliveryDate?: string;
    specialInstructions?: string;
    contactPerson?: string;
    contactPhone?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  vendorPreferences?: {
    preferredVendors?: string[];
    excludeVendors?: string[];
    organicOnly?: boolean;
    localProducts?: boolean;
    budget?: number;
  };

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  deliveryFee!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  tax!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  total!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountAmount?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  discountCode?: string;

  @Column({ type: 'jsonb', nullable: true })
  appliedCoupons?: Array<{
    code: string;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
    description?: string;
  }>;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  convertedAt?: Date;

  @Column({ type: 'varchar', length: 36, nullable: true })
  convertedOrderId?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    source: 'mobile_app' | 'web_app' | 'api';
    deviceInfo?: string;
    userAgent?: string;
    ipAddress?: string;
    referralCode?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => CartItem, item => item.cart)
  items!: CartItem[];

  // Virtual properties
  get isEmpty(): boolean {
    return this.items?.length === 0 || this.totalItems === 0;
  }

  get totalItems(): number {
    return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  get uniqueItems(): number {
    return this.items?.length || 0;
  }

  get hasDiscount(): boolean {
    return this.discountAmount !== undefined && this.discountAmount > 0;
  }

  get discountPercentage(): number {
    if (!this.hasDiscount || this.subtotal === 0) return 0;
    return Math.round((this.discountAmount! / this.subtotal) * 100);
  }

  get isExpired(): boolean {
    if (!this.lastActivityAt) return false;
    const now = new Date();
    const diffMs = now.getTime() - this.lastActivityAt.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours > 24; // Cart expires after 24 hours of inactivity
  }

  get canCheckout(): boolean {
    return this.status === CartStatus.ACTIVE && !this.isEmpty && !this.isExpired;
  }

  get estimatedDeliveryTime(): string {
    if (this.items?.some(item => item.product?.vendor?.isQuickCommerce)) {
      return '15-30 minutes';
    } else if (this.items?.some(item => item.product?.vendor?.isLocalVendor)) {
      return '1-2 hours';
    } else {
      return '2-4 hours';
    }
  }

  get vendorCount(): number {
    const vendors = new Set(this.items?.map(item => item.product?.vendor?.id) || []);
    return vendors.size;
  }

  get isMultiVendor(): boolean {
    return this.vendorCount > 1;
  }

  get needsMultiVendorCheckout(): boolean {
    return this.isMultiVendor;
  }

  get totalWithTaxAndDelivery(): number {
    return this.subtotal + this.tax + this.deliveryFee - (this.discountAmount || 0);
  }

  get savingsAmount(): number {
    return this.discountAmount || 0;
  }

  get savingsPercentage(): number {
    if (this.subtotal === 0) return 0;
    return Math.round((this.savingsAmount / this.subtotal) * 100);
  }
}
