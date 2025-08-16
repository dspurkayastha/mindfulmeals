import { Router } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { InventoryService } from '../services/inventory.service';
import { PantryItem, ItemCategory, ItemStatus, StorageLocation } from '../entities/PantryItem';
import { Household } from '../entities/Household';
import { ShoppingList, ShoppingListStatus, ShoppingListType } from '../entities/ShoppingList';
import { ShoppingListItem, ItemPriority, ItemSource } from '../entities/ShoppingListItem';

export const router = Router();

// Initialize service (injected during server startup)
let inventoryService: InventoryService = null as unknown as InventoryService;
export const setInventoryService = (service: InventoryService) => {
  inventoryService = service;
};

// Validation middleware
const validateHouseholdId = param('householdId')
  .isUUID()
  .withMessage('Invalid household ID');

const validatePantryItemInput = [
  body('name').isLength({ min: 1, max: 255 }).withMessage('Name is required and must be less than 255 characters'),
  body('category').isIn(Object.values(ItemCategory)).withMessage('Invalid category'),
  body('storageLocation').isIn(Object.values(StorageLocation)).withMessage('Invalid storage location'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('unit').isLength({ min: 1, max: 50 }).withMessage('Unit is required and must be less than 50 characters'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('expiryDate').optional().isISO8601().withMessage('Invalid expiry date format'),
];

const validateShoppingListInput = [
  body('name').isLength({ min: 1, max: 255 }).withMessage('Name is required and must be less than 255 characters'),
  body('type').isIn(Object.values(ShoppingListType)).withMessage('Invalid shopping list type'),
  body('plannedShoppingDate').optional().isISO8601().withMessage('Invalid date format'),
  body('estimatedBudget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
];

// Pantry Item Routes
router.post('/households/:householdId/pantry-items',
  validateHouseholdId,
  validatePantryItemInput,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
    }

    const { householdId } = req.params;
    const input = { ...req.body, householdId };
    
    const item = await inventoryService.addPantryItem(input);
    
    res.status(201).json({
      success: true,
      data: item,
      message: 'Pantry item added successfully',
    });
  })
);

router.get('/households/:householdId/pantry-items',
  validateHouseholdId,
  query('category').optional().isIn(Object.values(ItemCategory)),
  query('storageLocation').optional().isIn(Object.values(StorageLocation)),
  query('status').optional().isIn(Object.values(ItemStatus)),
  query('search').optional().isLength({ min: 1, max: 100 }),
  query('lowStock').optional().isBoolean(),
  query('expiringSoon').optional().isBoolean(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
    }

    const { householdId } = req.params;
    const filters = {
      category: req.query.category as ItemCategory,
      storageLocation: req.query.storageLocation as StorageLocation,
      status: req.query.status as ItemStatus,
      search: req.query.search as string,
      lowStock: req.query.lowStock === 'true',
      expiringSoon: req.query.expiringSoon === 'true',
    };

    const items = await inventoryService.getPantryItems(householdId, filters);
    
    res.json({
      success: true,
      data: items,
      message: `Found ${items.length} pantry items`,
    });
  })
);

router.get('/households/:householdId/pantry-items/:itemId',
  validateHouseholdId,
  param('itemId').isUUID().withMessage('Invalid item ID'),
  asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    
    const item = await inventoryService.getPantryItem(itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Pantry item not found',
      });
    }
    
    res.json({
      success: true,
      data: item,
      message: 'Pantry item retrieved successfully',
    });
  })
);

router.put('/households/:householdId/pantry-items/:itemId',
  validateHouseholdId,
  param('itemId').isUUID().withMessage('Invalid item ID'),
  asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const updates = req.body;
    
    const item = await inventoryService.updatePantryItem(itemId, updates);
    
    res.json({
      success: true,
      data: item,
      message: 'Pantry item updated successfully',
    });
  })
);

router.delete('/households/:householdId/pantry-items/:itemId',
  validateHouseholdId,
  param('itemId').isUUID().withMessage('Invalid item ID'),
  asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    
    await inventoryService.removePantryItem(itemId);
    
    res.json({
      success: true,
      message: 'Pantry item removed successfully',
    });
  })
);

// Barcode Scanning Routes
router.post('/households/:householdId/scan-barcode',
  validateHouseholdId,
  body('barcode').isLength({ min: 1, max: 100 }).withMessage('Barcode is required'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
    }

    const { householdId } = req.params;
    const { barcode } = req.body;
    
    const result = await inventoryService.scanBarcode(barcode, householdId);
    
    res.json({
      success: true,
      data: result,
      message: result.found ? 'Item found in pantry' : 'Item not found, suggestions provided',
    });
  })
);

// Shopping List Routes
router.post('/households/:householdId/shopping-lists',
  validateHouseholdId,
  validateShoppingListInput,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
    }

    const { householdId } = req.params;
    const input = { ...req.body, householdId };
    
    const shoppingList = await inventoryService.generateShoppingList(
      householdId,
      input.type,
      {
        includeLowStock: req.body.includeLowStock,
        includeExpiring: req.body.includeExpiring,
        budget: input.estimatedBudget,
        preferredVendors: req.body.preferences?.preferredVendors,
      }
    );
    
    res.status(201).json({
      success: true,
      data: shoppingList,
      message: 'Shopping list generated successfully',
    });
  })
);

router.get('/households/:householdId/shopping-lists',
  validateHouseholdId,
  query('status').optional().isIn(Object.values(ShoppingListStatus)),
  query('type').optional().isIn(Object.values(ShoppingListType)),
  asyncHandler(async (req, res) => {
    // TODO: Implement shopping list retrieval
    res.status(501).json({
      success: false,
      message: 'Shopping list retrieval not implemented yet',
      error: 'NOT_IMPLEMENTED',
    });
  })
);

// Analytics Routes
router.get('/households/:householdId/analytics',
  validateHouseholdId,
  asyncHandler(async (req, res) => {
    const { householdId } = req.params;
    
    const analytics = await inventoryService.getInventoryAnalytics(householdId);
    
    res.json({
      success: true,
      data: analytics,
      message: 'Inventory analytics retrieved successfully',
    });
  })
);

// Expiry Management Routes
router.get('/households/:householdId/expiry-check',
  validateHouseholdId,
  asyncHandler(async (req, res) => {
    const { householdId } = req.params;
    
    const result = await inventoryService.checkExpiringItems(householdId);
    
    res.json({
      success: true,
      data: result,
      message: 'Expiry check completed successfully',
    });
  })
);

// Waste Tracking Routes
router.post('/households/:householdId/pantry-items/:itemId/waste',
  validateHouseholdId,
  param('itemId').isUUID().withMessage('Invalid item ID'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('reason').isLength({ min: 1, max: 500 }).withMessage('Reason is required and must be less than 500 characters'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => err.msg),
      });
    }

    const { itemId } = req.params;
    const { quantity, reason } = req.body;
    
    await inventoryService.trackWaste(itemId, quantity, reason);
    
    res.json({
      success: true,
      message: 'Waste tracked successfully',
    });
  })
);

// Categories and Storage Locations
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = Object.values(ItemCategory).map(category => ({
    value: category,
    label: category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    icon: getCategoryIcon(category),
  }));

  res.json({
    success: true,
    data: categories,
    message: 'Categories retrieved successfully',
  });
}));

router.get('/storage-locations', asyncHandler(async (req, res) => {
  const locations = Object.values(StorageLocation).map(location => ({
    value: location,
    label: location.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    icon: getStorageIcon(location),
  }));

  res.json({
    success: true,
    data: locations,
    message: 'Storage locations retrieved successfully',
  });
}));

// Helper functions
function getCategoryIcon(category: ItemCategory): string {
  const iconMap: Record<ItemCategory, string> = {
    [ItemCategory.FRUITS_VEGETABLES]: '🥬',
    [ItemCategory.DAIRY_EGGS]: '🥛',
    [ItemCategory.MEAT_FISH]: '🥩',
    [ItemCategory.GRAINS_PULSES]: '🌾',
    [ItemCategory.SPICES_CONDIMENTS]: '🧂',
    [ItemCategory.SNACKS_BEVERAGES]: '🍿',
    [ItemCategory.BAKERY]: '🥖',
    [ItemCategory.FROZEN_FOODS]: '🧊',
    [ItemCategory.ORGANIC]: '🌱',
    [ItemCategory.READY_TO_EAT]: '🍱',
    [ItemCategory.BEVERAGES]: '🥤',
    [ItemCategory.PERSONAL_CARE]: '🧴',
    [ItemCategory.HOUSEHOLD]: '🏠',
  };
  return iconMap[category] || '📦';
}

function getStorageIcon(location: StorageLocation): string {
  const iconMap: Record<StorageLocation, string> = {
    [StorageLocation.REFRIGERATOR]: '❄️',
    [StorageLocation.FREEZER]: '🧊',
    [StorageLocation.PANTRY]: '🏠',
    [StorageLocation.COUNTERTOP]: '🪑',
    [StorageLocation.SPICE_RACK]: '🧂',
    [StorageLocation.WINE_CELLAR]: '🍷',
  };
  return iconMap[location] || '📦';
}

export { router as inventoryRoutes };
