// Base types and interfaces used across all MindfulMeals microservices

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface BaseResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface PaginatedResponse<T = any> extends BaseResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse extends BaseResponse<null> {
  success: false;
  error: string;
  errors?: string[];
  errorCode?: string;
  errorType?: string;
  stack?: string;
}

export interface SuccessResponse<T = any> extends BaseResponse<T> {
  success: true;
  data: T;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
  code?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  httpStatus: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface QueryParams extends PaginationParams, FilterParams {}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize?: boolean;
  logging?: boolean;
  ssl?: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  keyPrefix?: string;
}

export interface ServerConfig {
  port: number;
  host: string;
  environment: 'development' | 'staging' | 'production';
  corsOrigins: string[];
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

export interface LogConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
  format: 'json' | 'simple';
  transports: string[];
  filename?: string;
  maxSize?: string;
  maxFiles?: string;
}

export interface SecurityConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
  allowedOrigins: string[];
  rateLimitEnabled: boolean;
  corsEnabled: boolean;
  helmetEnabled: boolean;
}

export interface ExternalApiConfig {
  timeout: number;
  retries: number;
  baseURL: string;
  headers: Record<string, string>;
  auth?: {
    type: 'bearer' | 'basic' | 'apiKey';
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
  };
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  maxKeys: number;
  strategy: 'lru' | 'ttl' | 'hybrid';
}

export interface MonitoringConfig {
  enabled: boolean;
  metrics: boolean;
  healthChecks: boolean;
  logging: boolean;
  tracing: boolean;
}

export interface FeatureFlags {
  aiEnabled: boolean;
  mindfulnessEnabled: boolean;
  culturalIntegrationEnabled: boolean;
  nutritionalAnalysisEnabled: boolean;
  seasonalIntelligenceEnabled: boolean;
  communityFeaturesEnabled: boolean;
  quickCommerceEnabled: boolean;
  barcodeScanningEnabled: boolean;
  wasteTrackingEnabled: boolean;
  expiryRemindersEnabled: boolean;
}

export interface UserContext {
  userId: string;
  householdId: string;
  roles: string[];
  permissions: string[];
  preferences: Record<string, any>;
  locale: string;
  timezone: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface NotificationConfig {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  channels: string[];
  templates: Record<string, any>;
}

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  responseTime: number;
  dependencies: {
    database: boolean;
    redis: boolean;
    externalApis: boolean;
  };
  metrics: Record<string, any>;
}

export interface ServiceInfo {
  name: string;
  version: string;
  description: string;
  environment: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
    free: number;
  };
  cpu: {
    usage: number;
    load: number;
  };
  dependencies: string[];
  features: string[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: Record<string, any>;
  responses?: Record<string, any>;
  authentication?: boolean;
  rateLimit?: boolean;
  deprecated?: boolean;
}

export interface ServiceDependency {
  name: string;
  type: 'database' | 'cache' | 'external' | 'internal';
  status: 'healthy' | 'unhealthy' | 'unknown';
  responseTime: number;
  lastCheck: Date;
  config: Record<string, any>;
}

export interface PerformanceMetrics {
  requestCount: number;
  responseTime: {
    min: number;
    max: number;
    average: number;
    p95: number;
    p99: number;
  };
  errorRate: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
  activeConnections: number;
}

export interface SecurityMetrics {
  failedLogins: number;
  blockedIPs: number;
  suspiciousActivities: number;
  rateLimitViolations: number;
  authenticationFailures: number;
  authorizationFailures: number;
}

export interface BusinessMetrics {
  activeUsers: number;
  totalRecipes: number;
  totalMealPlans: number;
  totalHouseholds: number;
  mindfulnessSessions: number;
  culturalRecipeUsage: number;
  nutritionalGoalAchievement: number;
  userEngagement: number;
}
