import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from './Order';
import { CommerceProduct } from './CommerceProduct';

@Entity('order_items')
@Index(['orderId', 'productId'])
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  orderId!: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  productId!: string;

  @Column({ type: 'integer', nullable: false, default: 1 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalPrice!: number;

  @Column({ type: 'varchar', length: 20, nullable: false, default: 'piece' })
  unit!: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  weight?: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  weightUnit?: string;

  @Column({ type: 'jsonb', nullable: true })
  productSnapshot?: {
    name: string;
    description?: string;
    category: string;
    imageUrl?: string;
    nutritionalInfo?: any;
    dietaryInfo?: any;
  };

  @Column({ type: 'jsonb', nullable: true })
  customization?: {
    specialInstructions?: string;
    modifications?: string[];
    addOns?: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
  };

  @Column({ type: 'boolean', default: false })
  isReplaced!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  replacementReason?: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  replacementProductId?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    vendorProductId?: string;
    vendorSku?: string;
    batchNumber?: string;
    expiryDate?: Date;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'orderId' })
  order!: Order;

  @ManyToOne(() => CommerceProduct, product => product.orderItems)
  @JoinColumn({ name: 'productId' })
  product!: CommerceProduct;

  // Virtual properties
  get hasCustomization(): boolean {
    return this.customization !== undefined && (
      this.customization.specialInstructions ||
      (this.customization.modifications && this.customization.modifications.length > 0) ||
      (this.customization.addOns && this.customization.addOns.length > 0)
    );
  }

  get hasAddOns(): boolean {
    return this.customization?.addOns && this.customization.addOns.length > 0;
  }

  get addOnsTotal(): number {
    if (!this.hasAddOns) return 0;
    return this.customization!.addOns!.reduce((sum, addon) => 
      sum + (addon.price * addon.quantity), 0
    );
  }

  get totalWithAddOns(): number {
    return this.totalPrice + this.addOnsTotal;
  }

  get isReplacement(): boolean {
    return this.isReplaced && this.replacementProductId !== undefined;
  }
}
