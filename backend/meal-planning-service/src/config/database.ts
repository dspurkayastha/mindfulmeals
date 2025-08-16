import { DataSource } from 'typeorm';
import { Recipe } from '../entities/Recipe';
import { RecipeIngredient } from '../entities/RecipeIngredient';
import { RecipeStep } from '../entities/RecipeStep';
import { MealPlan } from '../entities/MealPlan';
import { Household } from '../entities/Household';

export const config = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'secure_password',
  database: process.env.DB_NAME || 'mindfulmeals',
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev only
  logging: process.env.NODE_ENV === 'development',
  entities: [Recipe, RecipeIngredient, RecipeStep, MealPlan, Household],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});
