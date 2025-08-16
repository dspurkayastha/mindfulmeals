import { Repository } from 'typeorm';
import { PantryItem, ItemCategory, ItemStatus, StorageLocation } from '../entities/PantryItem';
import { Household } from '../entities/Household';
import { ShoppingList, ShoppingListStatus, ShoppingListType } from '../entities/ShoppingList';
import { ShoppingListItem, ItemPriority, ItemSource } from '../entities/ShoppingListItem';

export interface PantryItemInput {
  householdId: string;
  name: string;
  description?: string;
  category: ItemCategory;
  storageLocation: StorageLocation;
  quantity: number;
  unit: string;
  price?: number;
  currency?: string;
  purchaseDate?: Date;
  expiryDate?: Date;
  brand?: string;
  barcode?: string;
  nutritionalInfo?: any;
  dietaryInfo?: any;
  regionalInfo?: any;
  cookingInfo?: any;
}

export interface ShoppingListInput {
  householdId: string;
  name: string;
  description?: string;
  type: ShoppingListType;
  plannedShoppingDate?: Date;
  estimatedBudget?: number;
  currency?: string;
  preferences?: any;
  metadata?: any;
}

export interface InventoryAnalytics {
  totalItems: number;
  activeItems: number;
  lowStockItems: number;
  expiringItems: number;
  expiredItems: number;
  totalValue: number;
  categoryBreakdown: Array<{
    category: ItemCategory;
    count: number;
    value: number;
  }>;
  storageBreakdown: Array<{
    location: StorageLocation;
    count: number;
    value: number;
  }>;
  expiryTimeline: Array<{
    days: number;
    count: number;
    value: number;
  }>;
}

export class InventoryService {
  constructor(
    private pantryItemRepo: Repository<PantryItem>,
    private householdRepo: Repository<Household>,
    private shoppingListRepo: Repository<ShoppingList>,
    private shoppingListItemRepo: Repository<ShoppingListItem>,
  ) {}

  // Pantry Item Management
  async addPantryItem(input: PantryItemInput): Promise<PantryItem> {
    const item = this.pantryItemRepo.create(input);
    return await this.pantryItemRepo.save(item);
  }

  async updatePantryItem(id: string, updates: Partial<PantryItem>): Promise<PantryItem> {
    await this.pantryItemRepo.update(id, updates);
    const item = await this.pantryItemRepo.findOne({ where: { id } });
    if (!item) {
      throw new Error('Pantry item not found');
    }
    return item;
  }

  async removePantryItem(id: string): Promise<void> {
    await this.pantryItemRepo.update(id, { isActive: false });
  }

  async getPantryItem(id: string): Promise<PantryItem | null> {
    return await this.pantryItemRepo.findOne({
      where: { id, isActive: true },
      relations: ['household'],
    });
  }

  async getPantryItems(householdId: string, filters?: {
    category?: ItemCategory;
    storageLocation?: StorageLocation;
    status?: ItemStatus;
    search?: string;
    lowStock?: boolean;
    expiringSoon?: boolean;
  }): Promise<PantryItem[]> {
    let query = this.pantryItemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.household', 'household')
      .where('item.householdId = :householdId', { householdId })
      .andWhere('item.isActive = :isActive', { isActive: true });

    if (filters?.category) {
      query = query.andWhere('item.category = :category', { category: filters.category });
    }

    if (filters?.storageLocation) {
      query = query.andWhere('item.storageLocation = :location', { location: filters.storageLocation });
    }

    if (filters?.status) {
      query = query.andWhere('item.status = :status', { status: filters.status });
    }

    if (filters?.search) {
      query = query.andWhere(
        '(item.name ILIKE :search OR item.description ILIKE :search OR item.brand ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.lowStock) {
      query = query.andWhere('item.quantity <= 0.5');
    }

    if (filters?.expiringSoon) {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      query = query.andWhere('item.expiryDate <= :expiryDate', { expiryDate: sevenDaysFromNow });
    }

    return await query
      .orderBy('item.priority', 'DESC')
      .addOrderBy('item.expiryDate', 'ASC')
      .addOrderBy('item.name', 'ASC')
      .getMany();
  }

  // Barcode Scanning
  async scanBarcode(barcode: string, householdId: string): Promise<{
    found: boolean;
    item?: PantryItem;
    suggestions?: Array<{
      name: string;
      category: ItemCategory;
      brand?: string;
      description?: string;
    }>;
  }> {
    // First, check if we have this item in our pantry
    const existingItem = await this.pantryItemRepo.findOne({
      where: { barcode, householdId, isActive: true },
    });

    if (existingItem) {
      return { found: true, item: existingItem };
    }

    // TODO: Integrate with external barcode databases
    // For now, return suggestions based on common patterns
    const suggestions = this.getBarcodeSuggestions(barcode);
    
    return { found: false, suggestions };
  }

  private getBarcodeSuggestions(barcode: string): Array<{
    name: string;
    category: ItemCategory;
    brand?: string;
    description?: string;
  }> {
    // This would integrate with external APIs like Open Food Facts
    // For now, return mock suggestions
    return [
      {
        name: 'Organic Tomatoes',
        category: ItemCategory.FRUITS_VEGETABLES,
        brand: 'Fresh Farm',
        description: 'Fresh organic tomatoes from local farms',
      },
      {
        name: 'Whole Wheat Bread',
        category: ItemCategory.BAKERY,
        brand: 'Healthy Grains',
        description: '100% whole wheat bread with no preservatives',
      },
    ];
  }

  // Shopping List Generation
  async generateShoppingList(householdId: string, type: ShoppingListType, options?: {
    includeLowStock?: boolean;
    includeExpiring?: boolean;
    budget?: number;
    preferredVendors?: string[];
  }): Promise<ShoppingList> {
    const household = await this.householdRepo.findOne({ where: { id: householdId } });
    if (!household) {
      throw new Error('Household not found');
    }

    // Create shopping list
    const shoppingList = this.shoppingListRepo.create({
      householdId,
      name: `Auto-generated ${type.replace('_', ' ')} list`,
      type,
      status: ShoppingListStatus.DRAFT,
      estimatedBudget: options?.budget || 0,
      currency: household.currency,
      metadata: {
        source: type,
        generatedBy: 'system',
        generationReason: 'Automated inventory analysis',
      },
    });

    const savedList = await this.shoppingListRepo.save(shoppingList);

    // Generate items based on type
    let items: Partial<ShoppingListItem>[] = [];

    if (type === ShoppingListType.LOW_STOCK || options?.includeLowStock) {
      const lowStockItems = await this.getLowStockItems(householdId);
      items.push(...lowStockItems.map(item => ({
        shoppingListId: savedList.id,
        name: item.name,
        description: item.description,
        category: item.category,
        quantity: Math.max(1, 2 - item.quantity), // Buy enough to reach 2 units
        unit: item.unit,
        priority: ItemPriority.HIGH,
        source: ItemSource.LOW_STOCK,
        estimatedPrice: item.price,
        currency: item.currency || 'INR',
        brand: item.brand,
        barcode: item.barcode,
        metadata: {
          relatedPantryItemId: item.id,
        },
      })));
    }

    if (type === ShoppingListType.EXPIRY_BASED || options?.includeExpiring) {
      const expiringItems = await this.getExpiringItems(householdId);
      items.push(...expiringItems.map(item => ({
        shoppingListId: savedList.id,
        name: item.name,
        description: `Replacing expiring item (expires: ${item.expiryDate?.toLocaleDateString()})`,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        priority: ItemPriority.URGENT,
        source: ItemSource.EXPIRY,
        estimatedPrice: item.price,
        currency: item.currency || 'INR',
        brand: item.brand,
        barcode: item.barcode,
        metadata: {
          relatedPantryItemId: item.id,
        },
      })));
    }

    // Save shopping list items
    if (items.length > 0) {
      await this.shoppingListItemRepo.save(items);
    }

    // Update list stats
    await this.updateShoppingListStats(savedList.id);

    return savedList;
  }

  private async getLowStockItems(householdId: string): Promise<PantryItem[]> {
    return await this.pantryItemRepo
      .createQueryBuilder('item')
      .where('item.householdId = :householdId', { householdId })
      .andWhere('item.isActive = :isActive', { isActive: true })
      .andWhere('item.quantity <= 0.5')
      .getMany();
  }

  private async getExpiringItems(householdId: string): Promise<PantryItem[]> {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    return await this.pantryItemRepo
      .createQueryBuilder('item')
      .where('item.householdId = :householdId', { householdId })
      .andWhere('item.isActive = :isActive', { isActive: true })
      .andWhere('item.expiryDate <= :expiryDate', { expiryDate: sevenDaysFromNow })
      .andWhere('item.expiryDate > :today', { today: new Date() })
      .getMany();
  }

  private async updateShoppingListStats(shoppingListId: string): Promise<void> {
    const items = await this.shoppingListItemRepo.find({
      where: { shoppingListId, isActive: true },
    });

    const stats = {
      totalItems: items.length,
      completedItems: items.filter(item => item.isCompleted).length,
      pendingItems: items.filter(item => !item.isCompleted).length,
      priorityItems: items.filter(item => item.isHighPriority).length,
      organicItems: items.filter(item => item.preferences?.organic).length,
      localItems: items.filter(item => item.preferences?.local).length,
      estimatedWeight: 0, // TODO: Calculate based on units
      estimatedVolume: 0, // TODO: Calculate based on units
      categories: [...new Set(items.map(item => item.category))],
      vendors: [...new Set(items.map(item => item.preferredVendor).filter(Boolean))],
    };

    await this.shoppingListRepo.update(shoppingListId, { stats });
  }

  // Inventory Analytics
  async getInventoryAnalytics(householdId: string): Promise<InventoryAnalytics> {
    const items = await this.getPantryItems(householdId);
    
    const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);
    
    const categoryBreakdown = Object.values(ItemCategory).map(category => {
      const categoryItems = items.filter(item => item.category === category);
      return {
        category,
        count: categoryItems.length,
        value: categoryItems.reduce((sum, item) => sum + (item.price || 0), 0),
      };
    }).filter(breakdown => breakdown.count > 0);

    const storageBreakdown = Object.values(StorageLocation).map(location => {
      const locationItems = items.filter(item => item.storageLocation === location);
      return {
        location,
        count: locationItems.length,
        value: locationItems.reduce((sum, item) => sum + (item.price || 0), 0),
      };
    }).filter(breakdown => breakdown.count > 0);

    const expiryTimeline = [
      { days: 1, count: 0, value: 0 },
      { days: 3, count: 0, value: 0 },
      { days: 7, count: 0, value: 0 },
      { days: 14, count: 0, value: 0 },
      { days: 30, count: 0, value: 0 },
    ];

    items.forEach(item => {
      if (item.expiryDate) {
        const daysUntilExpiry = item.daysUntilExpiry || 0;
        const timelineEntry = expiryTimeline.find(entry => daysUntilExpiry <= entry.days);
        if (timelineEntry) {
          timelineEntry.count++;
          timelineEntry.value += item.price || 0;
        }
      }
    });

    return {
      totalItems: items.length,
      activeItems: items.filter(item => item.isActive).length,
      lowStockItems: items.filter(item => item.needsRestocking).length,
      expiringItems: items.filter(item => item.isExpiringSoon).length,
      expiredItems: items.filter(item => item.isExpired).length,
      totalValue,
      categoryBreakdown,
      storageBreakdown,
      expiryTimeline,
    };
  }

  // Waste Tracking
  async trackWaste(itemId: string, quantity: number, reason: string): Promise<void> {
    const item = await this.getPantryItem(itemId);
    if (!item) {
      throw new Error('Pantry item not found');
    }

    // Update item status and quantity
    await this.updatePantryItem(itemId, {
      status: ItemStatus.WASTED,
      quantity: Math.max(0, item.quantity - quantity),
      notes: `Wasted: ${quantity} ${item.unit} - Reason: ${reason}`,
    });

    // TODO: Log waste analytics for household insights
  }

  // Expiry Management
  async checkExpiringItems(householdId: string): Promise<{
    expiringSoon: PantryItem[];
    expired: PantryItem[];
    recommendations: string[];
  }> {
    const items = await this.getPantryItems(householdId);
    
    const expiringSoon = items.filter(item => item.isExpiringSoon);
    const expired = items.filter(item => item.isExpired);

    const recommendations: string[] = [];
    
    if (expiringSoon.length > 0) {
      recommendations.push(`You have ${expiringSoon.length} items expiring soon. Consider using them in meals or freezing them.`);
    }
    
    if (expired.length > 0) {
      recommendations.push(`You have ${expired.length} expired items. Please dispose of them safely.`);
    }

    return { expiringSoon, expired, recommendations };
  }
}
