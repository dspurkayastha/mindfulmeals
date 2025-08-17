import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import { env } from './config/env';
import { config } from './config/database';
import { mealPlanningRoutes, setMealPlanningService } from './routes/meal-planning.routes';
import { errorHandler } from './middleware/errorHandler';
import { MealPlanningService } from './services/meal-planning.service';
import { Recipe } from './entities/Recipe';
import { RecipeIngredient } from './entities/RecipeIngredient';
import { RecipeStep } from './entities/RecipeStep';
import { MealPlan } from './entities/MealPlan';
import { Household } from './entities/Household';

const app = express();
const PORT = process.env.PORT || 3004;

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
    service: 'mindfulmeals-meal-planning-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: ['ai-meal-planning', 'mindful-cooking', 'cultural-recipes', 'nutritional-balance'],
  });
});

// REST API routes
app.use('/api/v1/meal-planning', mealPlanningRoutes);

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
    const recipeRepo = config.getRepository(Recipe);
    const ingredientRepo = config.getRepository(RecipeIngredient);
    const stepRepo = config.getRepository(RecipeStep);
    const mealPlanRepo = config.getRepository(MealPlan);
    const householdRepo = config.getRepository(Household);
    const mealPlanningService = new MealPlanningService(
      recipeRepo,
      ingredientRepo,
      stepRepo,
      mealPlanRepo,
      householdRepo
    );
    setMealPlanningService(mealPlanningService);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 MindfulMeals Meal Planning Service running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 REST API: http://localhost:${PORT}/api/v1/meal-planning`);
      console.log(`🧠 AI Features: Mindful meal planning, cultural integration, nutritional balance`);
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
