import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Household } from '../entities/Household';
import { UserSession } from '../entities/UserSession';
import { TwoFactorSecret } from '../entities/TwoFactorSecret';

export const config = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'secure_password',
  database: process.env.DB_NAME || 'mindfulmeals',
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev only
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Household, UserSession, TwoFactorSecret],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Database connection test
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await config.initialize();
    await connection.query('SELECT 1');
    await connection.destroy();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};
