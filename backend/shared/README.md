# MindfulMeals Shared Module

A comprehensive shared module that provides common types, utilities, and middleware for all MindfulMeals microservices. This module ensures consistency, reduces duplication, and provides a solid foundation for the entire ecosystem.

## 🚀 Features

### **Shared Types**
- **Base Types**: Common interfaces and base classes
- **Domain Types**: User, Household, Recipe, MealPlan, and more
- **Configuration Types**: Database, Server, Security configurations
- **Utility Types**: Health checks, metrics, and service info

### **Shared Utilities**
- **Validation**: Comprehensive validation functions for all data types
- **Common**: Date, string, number, array, and object utilities
- **Sanitization**: Data cleaning and normalization functions
- **Formatting**: Currency, date, time, and number formatting

### **Shared Middleware**
- **Error Handling**: Centralized error handling with custom error classes
- **Response Helpers**: Standardized API response creation
- **Async Wrapper**: Safe async function handling

## 📦 Installation

```bash
# Install as a dependency in your microservice
npm install @mindfulmeals/shared

# Or use as a local dependency
npm install ../shared
```

## 🔧 Usage

### **Importing Types**

```typescript
import {
  User,
  Household,
  Recipe,
  MealPlan,
  IndianRegion,
  DietaryType,
  MindfulnessLevel,
  BaseResponse,
  ErrorResponse,
  ValidationError,
} from '@mindfulmeals/shared';
```

### **Importing Utilities**

```typescript
import {
  validateEmail,
  validatePhone,
  validateRecipe,
  generateUUID,
  formatDate,
  formatCurrency,
  capitalize,
  slugify,
  chunk,
  unique,
  groupBy,
  sortBy,
  pick,
  omit,
  deepClone,
  isEmpty,
  retry,
  paginate,
} from '@mindfulmeals/shared';
```

### **Importing Middleware**

```typescript
import {
  errorHandler,
  asyncHandler,
  AppError,
  ValidationAppError,
  NotFoundAppError,
  createSuccessResponse,
  createErrorResponse,
  createValidationErrorResponse,
} from '@mindfulmeals/shared';
```

## 📚 API Reference

### **Base Types**

#### `BaseEntity`
```typescript
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

#### `BaseResponse<T>`
```typescript
interface BaseResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
```

#### `PaginatedResponse<T>`
```typescript
interface PaginatedResponse<T = any> extends BaseResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### **Domain Types**

#### `User`
```typescript
interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  profileImage?: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `Household`
```typescript
interface Household {
  id: string;
  name: string;
  description?: string;
  region: IndianRegion;
  dietaryType: DietaryType;
  mindfulnessLevel: MindfulnessLevel;
  budget?: number;
  currency: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `Recipe`
```typescript
interface Recipe {
  id: string;
  householdId: string;
  name: string;
  description?: string;
  category: RecipeCategory;
  type: RecipeType;
  difficulty: RecipeDifficulty;
  mindfulnessLevel: MindfulnessLevel;
  servings: number;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  story?: string;
  imageUrl?: string;
  isActive: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### **Enums**

#### `IndianRegion`
```typescript
enum IndianRegion {
  PUNJAB = 'punjab',
  HARYANA = 'haryana',
  DELHI = 'delhi',
  UTTAR_PRADESH = 'uttar_pradesh',
  UTTARAKHAND = 'uttarakhand',
  HIMACHAL_PRADESH = 'himachal_pradesh',
  JAMMU_KASHMIR = 'jammu_kashmir',
  LADAKH = 'ladakh',
  RAJASTHAN = 'rajasthan',
  MADHYA_PRADESH = 'madhya_pradesh',
  CHHATTISGARH = 'chhattisgarh',
  JHARKHAND = 'jharkhand',
  BIHAR = 'bihar',
  WEST_BENGAL = 'west_bengal',
  ODISHA = 'odisha',
  ASSAM = 'assam',
  ARUNACHAL_PRADESH = 'arunachal_pradesh',
  NAGALAND = 'nagaland',
  MANIPUR = 'manipur',
  MIZORAM = 'mizoram',
  TRIPURA = 'tripura',
  MEGHALAYA = 'meghalaya',
  SIKKIM = 'sikkim',
  MAHARASHTRA = 'maharashtra',
  GUJARAT = 'gujarat',
  GOA = 'goa',
  KARNATAKA = 'karnataka',
  TAMIL_NADU = 'tamil_nadu',
  KERALA = 'kerala',
  ANDHRA_PRADESH = 'andhra_pradesh',
  TELANGANA = 'telangana',
  CHANDIGARH = 'chandigarh',
  DADRA_NAGAR_HAVELI = 'dadra_nagar_haveli',
  DAMAN_DIU = 'daman_diu',
  LAKSHADWEEP = 'lakshadweep',
  PUDUCHERRY = 'puducherry',
  ANDAMAN_NICOBAR = 'andaman_nicobar',
}
```

#### `DietaryType`
```typescript
enum DietaryType {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  NON_VEGETARIAN = 'non_vegetarian',
  EGGETARIAN = 'eggetarian',
  JAIN = 'jain',
  HALAL = 'halal',
  KOSHER = 'kosher',
  GLUTEN_FREE = 'gluten_free',
  DAIRY_FREE = 'dairy_free',
  NUT_FREE = 'nut_free',
  FLEXITARIAN = 'flexitarian',
}
```

#### `MindfulnessLevel`
```typescript
enum MindfulnessLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}
```

### **Validation Utilities**

#### `validateEmail(email: string): boolean`
```typescript
import { validateEmail } from '@mindfulmeals/shared';

const isValid = validateEmail('user@example.com'); // true
const isInvalid = validateEmail('invalid-email'); // false
```

#### `validatePhone(phone: string): boolean`
```typescript
import { validatePhone } from '@mindfulmeals/shared';

const isValid = validatePhone('9876543210'); // true (Indian format)
const isInvalid = validatePhone('1234567890'); // false
```

#### `validateRecipe(recipe: any): { isValid: boolean; errors: ValidationError[] }`
```typescript
import { validateRecipe } from '@mindfulmeals/shared';

const recipe = {
  name: 'Test Recipe',
  category: 'curries',
  type: 'vegetarian',
};

const validation = validateRecipe(recipe);
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}
```

#### `validateMealPlan(mealPlan: any): { isValid: boolean; errors: ValidationError[] }`
```typescript
import { validateMealPlan } from '@mindfulmeals/shared';

const mealPlan = {
  name: 'Weekly Plan',
  planType: 'weekly',
  date: new Date(),
  mealType: 'breakfast',
};

const validation = validateMealPlan(mealPlan);
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}
```

### **Common Utilities**

#### `generateUUID(): string`
```typescript
import { generateUUID } from '@mindfulmeals/shared';

const id = generateUUID(); // '550e8400-e29b-41d4-a716-446655440000'
```

#### `formatDate(date: Date, formatStr?: string): string`
```typescript
import { formatDate } from '@mindfulmeals/shared';

const today = new Date();
const formatted = formatDate(today); // '2024-01-15'
const custom = formatDate(today, 'dd/MM/yyyy'); // '15/01/2024'
```

#### `formatCurrency(amount: number, currency?: string): string`
```typescript
import { formatCurrency } from '@mindfulmeals/shared';

const formatted = formatCurrency(1500); // '₹1,500.00'
const usd = formatCurrency(1500, 'USD'); // '$1,500.00'
```

#### `capitalize(str: string): string`
```typescript
import { capitalize } from '@mindfulmeals/shared';

const result = capitalize('hello world'); // 'Hello world'
```

#### `slugify(str: string): string`
```typescript
import { slugify } from '@mindfulmeals/shared';

const slug = slugify('Hello World!'); // 'hello-world'
```

#### `chunk<T>(array: T[], size: number): T[][]`
```typescript
import { chunk } from '@mindfulmeals/shared';

const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const chunks = chunk(numbers, 3); // [[1, 2, 3], [4, 5, 6], [7, 8]]
```

#### `groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]>`
```typescript
import { groupBy } from '@mindfulmeals/shared';

const users = [
  { name: 'Alice', age: 25, city: 'Mumbai' },
  { name: 'Bob', age: 30, city: 'Delhi' },
  { name: 'Charlie', age: 25, city: 'Mumbai' },
];

const groupedByCity = groupBy(users, 'city');
// {
//   'Mumbai': [{ name: 'Alice', age: 25, city: 'Mumbai' }, { name: 'Charlie', age: 25, city: 'Mumbai' }],
//   'Delhi': [{ name: 'Bob', age: 30, city: 'Delhi' }]
// }
```

### **Error Handling**

#### Custom Error Classes
```typescript
import {
  AppError,
  ValidationAppError,
  NotFoundAppError,
  UnauthorizedAppError,
  ForbiddenAppError,
  ConflictAppError,
  RateLimitAppError,
} from '@mindfulmeals/shared';

// Create custom errors
throw new NotFoundAppError('User not found');
throw new ValidationAppError('Validation failed', validationErrors);
throw new UnauthorizedAppError('Invalid credentials');
```

#### Response Helpers
```typescript
import {
  createSuccessResponse,
  createErrorResponse,
  createValidationErrorResponse,
  createNotFoundResponse,
} from '@mindfulmeals/shared';

// Success response
const successResponse = createSuccessResponse(data, 'Operation successful');

// Error responses
const errorResponse = createErrorResponse('Something went wrong', 'INTERNAL_ERROR');
const validationResponse = createValidationErrorResponse(validationErrors);
const notFoundResponse = createNotFoundResponse('User');
```

### **Middleware Usage**

#### Error Handler
```typescript
import { errorHandler } from '@mindfulmeals/shared';

// In your Express app
app.use(errorHandler);
```

#### Async Handler
```typescript
import { asyncHandler } from '@mindfulmeals/shared';

// Wrap async route handlers
app.get('/users', asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(createSuccessResponse(users));
}));
```

## 🏗️ Architecture

### **Module Structure**
```
shared/
├── src/
│   ├── types/           # Type definitions
│   │   ├── base.ts      # Base types and interfaces
│   │   ├── domain.ts    # Domain-specific types
│   │   └── index.ts     # Type exports
│   ├── utils/           # Utility functions
│   │   ├── validation.ts # Validation utilities
│   │   ├── common.ts    # Common utilities
│   │   └── index.ts     # Utility exports
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.ts # Error handling
│   │   └── index.ts     # Middleware exports
│   └── index.ts         # Main module exports
├── package.json
├── tsconfig.json
└── README.md
```

### **Dependencies**
- **Runtime**: Node.js with TypeScript
- **Core**: Express, TypeORM, Joi
- **Utilities**: UUID, date-fns, lodash
- **Security**: JWT, bcrypt

## 🔒 Security Features

- **Input Validation**: Comprehensive validation for all data types
- **Error Handling**: Secure error responses without information leakage
- **Type Safety**: Full TypeScript support for compile-time safety
- **Sanitization**: Data cleaning and normalization functions

## 📊 Performance Features

- **Efficient Algorithms**: Optimized utility functions
- **Memory Management**: Proper object cloning and memory handling
- **Async Support**: Safe async operation handling
- **Caching Ready**: Utilities designed for caching integration

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Development

### **Building the Module**
```bash
# Build for production
npm run build

# Build in watch mode
npm run dev

# Clean build artifacts
npm run clean
```

### **Adding New Types**
1. Add the type definition in the appropriate file under `src/types/`
2. Export it from the relevant `index.ts` file
3. Add it to the main `src/index.ts` exports if it's commonly used
4. Update this README with documentation

### **Adding New Utilities**
1. Add the utility function in the appropriate file under `src/utils/`
2. Export it from the relevant `index.ts` file
3. Add it to the main `src/index.ts` exports if it's commonly used
4. Add tests for the new utility
5. Update this README with documentation

### **Adding New Middleware**
1. Add the middleware in the appropriate file under `src/middleware/`
2. Export it from the relevant `index.ts` file
3. Add it to the main `src/index.ts` exports if it's commonly used
4. Add tests for the new middleware
5. Update this README with documentation

## 🤝 Contributing

1. Follow the existing code style and architecture
2. Add comprehensive tests for new functionality
3. Update documentation for new features
4. Ensure all tests pass before submitting
5. Consider backward compatibility when making changes

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for the MindfulMeals ecosystem**
