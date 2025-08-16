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
import { Cart } from './Cart';
import { CommerceProduct } from './CommerceProduct';

@Entity('cart_items')
@Index(['cartId', 'productId'], { unique: true })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, nullable: false })
  cartId!: string;

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
  customization?: {
    specialInstructions?: string;
    modifications?: string[];
    addOns?: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
  };

  @Column({ type: 'jsonb', nullable: true })
  productSnapshot?: {
    name: string;
    description?: string;
    category: string;
    imageUrl?: string;
    nutritionalInfo?: any;
    dietaryInfo?: any;
    vendorName?: string;
    vendorType?: string;
  };

  @Column({ type: 'boolean', default: false })
  isSelected!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  addedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastUpdatedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: {
    source: 'search' | 'recommendation' | 'browse' | 'add_to_cart';
    searchQuery?: string;
    category?: string;
    vendorType?: string;
    priceRange?: string;
    dietaryFilter?: string;
  };

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @ManyToOne(() => Cart, cart => cart.items)
  @JoinColumn({ name: 'cartId' })
  cart!: Cart;

  @ManyToOne(() => CommerceProduct, product => product.cartItems)
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

  get isAvailable(): boolean {
    return this.product?.isAvailable && this.product?.stockQuantity > 0;
  }

  get isLowStock(): boolean {
    return this.product?.stockQuantity !== undefined && this.product.stockQuantity <= 5;
  }

  get canIncreaseQuantity(): boolean {
    if (!this.isAvailable) return false;
    if (this.product?.stockQuantity === undefined) return true;
    return this.quantity < this.product.stockQuantity;
  }

  get stockStatus(): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (!this.isAvailable) return 'out_of_stock';
    if (this.isLowStock) return 'low_stock';
    return 'in_stock';
  }

  get savingsAmount(): number {
    if (!this.product?.hasDiscount) return 0;
    return (this.product.originalPrice! - this.product.price) * this.quantity;
  }

  get savingsPercentage(): number {
    if (!this.product?.hasDiscount) return 0;
    return this.product.discountPercentage;
  }

  get isOrganic(): boolean {
    return this.product?.isOrganic || false;
  }

  get isSeasonal(): boolean {
    return this.product?.isSeasonal || false;
  }

  get isLocal(): boolean {
    return this.product?.vendor?.isLocalVendor || false;
  }

  get vendorType(): string {
    return this.product?.vendor?.vendorType || 'unknown';
  }

  get estimatedDeliveryTime(): string {
    if (this.product?.vendor?.isQuickCommerce) {
      return '15-30 minutes';
    } else if (this.product?.vendor?.isLocalVendor) {
      return '1-2 hours';
    } else {
      return '2-4 hours';
    }
  }
}
