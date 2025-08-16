import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import dotenv from 'dotenv';

dotenv.config();

import { commerceRoutes } from './routes/commerce.routes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config/database';
import { CommerceResolver } from './resolvers/commerce.resolver';
import { env } from './config/env';

const app = express();
const PORT = process.env.PORT || 3002;

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
    service: 'mindfulmeals-commerce-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    integrations: ['blinkit', 'zepto', 'swiggy', 'local-kirana'],
  });
});

// REST API routes
app.use('/api/v1/commerce', commerceRoutes);

// GraphQL setup
async function setupGraphQL() {
  try {
    const schema = await buildSchema({
      resolvers: [CommerceResolver],
      validate: false,
    });

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req }) => ({ req }),
      introspection: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });

    console.log('🚀 GraphQL server ready at /graphql');
  } catch (error) {
    console.error('❌ GraphQL setup failed:', error);
  }
}

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

    // Setup GraphQL
    await setupGraphQL();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 MindfulMeals Commerce Service running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 REST API: http://localhost:${PORT}/api/v1/commerce`);
      console.log(`🔍 GraphQL: http://localhost:${PORT}/graphql`);
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
