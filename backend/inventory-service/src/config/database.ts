import { DataSource } from 'typeorm';
import { PantryItem } from '../entities/PantryItem';
import { Household } from '../entities/Household';
import { ShoppingList } from '../entities/ShoppingList';
import { ShoppingListItem } from '../entities/ShoppingListItem';

export const config = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'secure_password',
  database: process.env.DB_NAME || 'mindfulmeals',
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev only
  logging: process.env.NODE_ENV === 'development',
  entities: [PantryItem, Household, ShoppingList, ShoppingListItem],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});
