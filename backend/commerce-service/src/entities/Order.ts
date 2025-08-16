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

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  UPI = 'upi',
  NET_BANKING = 'net_banking',
  WALLET = 'wallet',
  COD = 'cod',
}

@Entity('orders')
@Index(['userId', 'status'])
@Index(['vendorId', 'status'])
@Index(['orderNumber'], { unique: true })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  orderNumber!: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  userId!: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  vendorId!: string;

  @Column({ type: 'varchar', length: 20, nullable: false, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Column({ type: 'varchar', length: 20, nullable: false, default: PaymentStatus.PENDING })
  paymentStatus!: PaymentStatus;

  @Column({ type: 'varchar', length: 20, nullable: false })
  paymentMethod!: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  deliveryFee!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0 })
  tax!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountAmount?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  discountCode?: string;

  @Column({ type: 'text', nullable: false })
  deliveryAddress!: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  deliveryPhone!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  deliveryName?: string;

  @Column({ type: 'text', nullable: true })
  specialInstructions?: string;

  @Column({ type: 'timestamp', nullable: true })
  estimatedDeliveryTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualDeliveryTime?: Date;

  @Column({ type: 'jsonb', nullable: true })
  deliveryTracking?: {
    currentStatus: string;
    location?: string;
    estimatedTime?: string;
    trackingUrl?: string;
    updates: Array<{
      status: string;
      timestamp: Date;
      location?: string;
      description?: string;
    }>;
  };

  @Column({ type: 'jsonb', nullable: true })
  vendorOrderDetails?: {
    vendorOrderId: string;
    vendorOrderNumber: string;
    vendorStatus: string;
    vendorTrackingUrl?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  customerFeedback?: {
    rating?: number;
    review?: string;
    foodQuality?: number;
    deliverySpeed?: number;
    customerService?: number;
    submittedAt?: Date;
  };

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cancellationReason?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    source: 'mobile_app' | 'web_app' | 'api';
    deviceInfo?: string;
    userAgent?: string;
    ipAddress?: string;
    referralCode?: string;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Vendor, vendor => vendor.orders)
  @JoinColumn({ name: 'vendorId' })
  vendor!: Vendor;

  @OneToMany(() => OrderItem, item => item.order)
  items!: OrderItem[];

  // Virtual properties
  get isActive(): boolean {
    return ![OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.FAILED].includes(this.status);
  }

  get isDelivered(): boolean {
    return this.status === OrderStatus.DELIVERED;
  }

  get isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }

  get hasDiscount(): boolean {
    return this.discountAmount !== undefined && this.discountAmount > 0;
  }

  get totalItems(): number {
    return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  get isPaid(): boolean {
    return this.paymentStatus === PaymentStatus.COMPLETED;
  }

  get deliveryTime(): string {
    if (this.actualDeliveryTime && this.createdAt) {
      const diffMs = this.actualDeliveryTime.getTime() - this.createdAt.getTime();
      const diffMins = Math.round(diffMs / (1000 * 60));
      return `${diffMins} minutes`;
    }
    return 'N/A';
  }

  get isLate(): boolean {
    if (!this.estimatedDeliveryTime) return false;
    const now = new Date();
    return now > this.estimatedDeliveryTime && this.status !== OrderStatus.DELIVERED;
  }
}
