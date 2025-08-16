import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import { env } from './config/env';
import { userRoutes } from './routes/user.routes';
import { authRoutes, setAuthService } from './routes/auth.routes';
import { householdRoutes } from './routes/household.routes';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/authMiddleware';
import { config } from './config/database';
import { User } from './entities/User';
import { UserSession } from './entities/UserSession';
import { TwoFactorSecret } from './entities/TwoFactorSecret';
import { AuthService } from './services/auth.service';

const app = express();
const PORT = process.env.PORT || 3001;

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
    service: 'mindfulmeals-user-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authMiddleware, userRoutes);
app.use('/api/v1/households', authMiddleware, householdRoutes);

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
    const userRepo = config.getRepository(User);
    const userSessionRepo = config.getRepository(UserSession);
    const twoFactorRepo = config.getRepository(TwoFactorSecret);
    const authService = new AuthService(userRepo, userSessionRepo, twoFactorRepo);
    setAuthService(authService);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 MindfulMeals User Service running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/api/v1`);
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
