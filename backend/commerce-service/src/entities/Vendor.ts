import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { CommerceProduct } from './CommerceProduct';
import { VendorType } from './CommerceProduct';
import { Order } from './Order';

export enum VendorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  MAINTENANCE = 'maintenance',
}

@Entity('vendors')
@Index(['vendorType', 'status'])
@Index(['location', 'status'])
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  vendorType!: VendorType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logoUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  websiteUrl?: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  location!: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  pincode?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: VendorStatus.ACTIVE })
  status!: VendorStatus;

  @Column({ type: 'jsonb', nullable: true })
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };

  @Column({ type: 'jsonb', nullable: true })
  operationalHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };

  @Column({ type: 'jsonb', nullable: true })
  deliveryInfo?: {
    deliveryRadius?: number; // in km
    minOrderAmount?: number;
    deliveryFee?: number;
    freeDeliveryThreshold?: number;
    estimatedDeliveryTime?: string; // e.g., "30-45 minutes"
    deliverySlots?: string[]; // e.g., ["9 AM - 12 PM", "12 PM - 3 PM"]
  };

  @Column({ type: 'jsonb', nullable: true })
  paymentMethods?: {
    cash?: boolean;
    card?: boolean;
    upi?: boolean;
    netBanking?: boolean;
    wallet?: boolean;
    cod?: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  ratings?: {
    overall?: number; // 1-5 scale
    foodQuality?: number;
    deliverySpeed?: number;
    customerService?: number;
    valueForMoney?: number;
    totalReviews?: number;
    lastUpdated?: Date;
  };

  @Column({ type: 'jsonb', nullable: true })
  specializations?: {
    categories?: string[];
    cuisines?: string[];
    dietaryOptions?: string[];
    organicProducts?: boolean;
    localProducts?: boolean;
    importedProducts?: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  apiCredentials?: {
    apiKey?: string;
    apiSecret?: string;
    baseUrl?: string;
    webhookUrl?: string;
    lastSyncAt?: Date;
  };

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastOrderAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => CommerceProduct, product => product.vendor)
  products!: CommerceProduct[];

  @OneToMany(() => Order, order => order.vendor)
  orders!: Order[];

  // Virtual properties
  get isOpen(): boolean {
    if (!this.operationalHours) return false;
    
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof this.operationalHours;
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
    
    const todayHours = this.operationalHours[day];
    if (!todayHours) return false;
    
    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  }

  get hasFreeDelivery(): boolean {
    return this.deliveryInfo?.freeDeliveryThreshold !== undefined;
  }

  get isLocalVendor(): boolean {
    return this.vendorType === VendorType.LOCAL_KIRANA;
  }

  get isQuickCommerce(): boolean {
    return [VendorType.BLINKIT, VendorType.ZEPTO, VendorType.SWIGGY].includes(this.vendorType);
  }

  get averageRating(): number {
    return this.ratings?.overall || 0;
  }

  get totalProducts(): number {
    return this.products?.length || 0;
  }

  get isOperational(): boolean {
    return this.status === VendorStatus.ACTIVE && this.isOpen;
  }
}
