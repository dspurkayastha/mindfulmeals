import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import { env } from './config/env';
import { config } from './config/database';
import { inventoryRoutes, setInventoryService } from './routes/inventory.routes';
import { errorHandler } from './middleware/errorHandler';
import { InventoryService } from './services/inventory.service';
import { PantryItem } from './entities/PantryItem';
import { Household } from './entities/Household';
import { ShoppingList } from './entities/ShoppingList';
import { ShoppingListItem } from './entities/ShoppingListItem';

const app = express();
const PORT = process.env.PORT || 3003;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'mindfulmeals-inventory-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: ['pantry-management', 'barcode-scanning', 'shopping-lists', 'inventory-analytics'],
  });
});

// REST API routes
app.use('/api/v1/inventory', inventoryRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Database connection and server startup
async function startServer() {
  try {
    if (!config.isInitialized) {
      await config.initialize();
    }
    console.log('✅ Database connected successfully');

    // Wire repositories and inject services
    const pantryItemRepo = config.getRepository(PantryItem);
    const householdRepo = config.getRepository(Household);
    const shoppingListRepo = config.getRepository(ShoppingList);
    const shoppingListItemRepo = config.getRepository(ShoppingListItem);
    const inventoryService = new InventoryService(
      pantryItemRepo,
      householdRepo,
      shoppingListRepo,
      shoppingListItemRepo
    );
    setInventoryService(inventoryService);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 MindfulMeals Inventory Service running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 REST API: http://localhost:${PORT}/api/v1/inventory`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();
