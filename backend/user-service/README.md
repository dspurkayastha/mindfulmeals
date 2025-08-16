# MindfulMeals User Service

A comprehensive user and authentication service for MindfulMeals, featuring granular Indian regional preferences and cultural cuisine insights.

## 🌟 Features

### 🔐 **Authentication & Security**
- **Phone-based OTP authentication** with Indian mobile number validation
- **JWT tokens** with access and refresh token support
- **Two-factor authentication** with TOTP support
- **Rate limiting** for security and abuse prevention
- **Device tracking** and session management
- **Role-based access control** (RBAC)

### 🇮🇳 **Indian Regional Integration**
- **36+ granular regions** covering all Indian states and union territories
- **Cultural cuisine profiles** with signature dishes and cooking methods
- **Language preferences** (Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Marathi, Punjabi, Assamese, Odia, English)
- **Regional spice blends** and traditional cooking methods
- **Festival cuisine** and seasonal ingredient mapping
- **Street food preferences** by region

### 🧘 **Mindfulness Features**
- **Wellness goals** tracking and dietary restrictions
- **Mindfulness scoring** system (1-10 scale)
- **Breathing reminders** and meal mindfulness
- **Gratitude journal** support
- **Cultural mindfulness traditions** by region

## 🏗️ Architecture

```
src/
├── config/
│   └── database.ts              # TypeORM configuration
├── entities/
│   ├── User.ts                  # User entity with Indian-specific fields
│   ├── Household.ts             # Household entity with regional preferences
│   ├── UserSession.ts           # Session tracking for security
│   └── TwoFactorSecret.ts       # 2FA secret storage
├── services/
│   ├── auth.service.ts          # Authentication service
│   └── regional-cuisine.service.ts # Regional cuisine profiles
├── middleware/
│   ├── authMiddleware.ts        # JWT validation & RBAC
│   └── errorHandler.ts          # Comprehensive error handling
├── routes/
│   ├── auth.routes.ts           # Authentication endpoints
│   ├── user.routes.ts           # User management
│   └── household.routes.ts      # Household management
└── index.ts                     # Main server entry point
```

## 🗺️ **Regional Coverage**

### **North Indian States**
- **Punjab**: Punjabi cuisine, tandoor cooking, rich buttery dishes
- **Haryana**: Haryanvi cuisine, wheat-based, simple preparations
- **Uttar Pradesh**: Awadhi cuisine, Mughlai influence, biryani
- **Uttarakhand**: Kumaoni cuisine, mountain herbs, simple cooking
- **Himachal Pradesh**: Pahari cuisine, apple-based, mild spices
- **Jammu & Kashmir**: Kashmiri cuisine, saffron, dry fruits
- **Delhi**: Mughlai cuisine, fusion of cultures, street food
- **Chandigarh**: Modern Punjabi, fusion cuisine

### **South Indian States**
- **Tamil Nadu**: Tamil cuisine, idli-dosa, sambar, coconut-based
- **Kerala**: Malayali cuisine, seafood, coconut milk, spices
- **Karnataka**: Kannadiga cuisine, rice-based, mild spices
- **Andhra Pradesh**: Telugu cuisine, spicy, tamarind-based
- **Telangana**: Telugu cuisine, biryani, spicy preparations
- **Puducherry**: French-Indian fusion, coastal cuisine

### **East Indian States**
- **West Bengal**: Bengali cuisine, fish, rice, sweet desserts
- **Bihar**: Bihari cuisine, litti-chokha, simple preparations
- **Jharkhand**: Jharkhandi cuisine, tribal influence, wild ingredients
- **Odisha**: Odia cuisine, temple food, mild spices

### **West Indian States**
- **Maharashtra**: Maharashtrian cuisine, vada pav, peanut-based
- **Gujarat**: Gujarati cuisine, dhokla, sweet-sour balance
- **Goa**: Goan cuisine, Portuguese influence, seafood
- **Rajasthan**: Rajasthani cuisine, dal-bati, desert adaptations
- **Madhya Pradesh**: Central Indian, wheat-based, simple

### **Northeast Indian States**
- **Assam**: Assamese cuisine, bamboo shoots, fish, wild herbs
- **Arunachal Pradesh**: Arunachali cuisine, tribal, simple
- **Manipur**: Manipuri cuisine, rice, fish, wild vegetables
- **Meghalaya**: Khasi cuisine, pork, rice, local herbs
- **Mizoram**: Mizo cuisine, bamboo, fish, simple
- **Nagaland**: Naga cuisine, pork, rice, spicy
- **Tripura**: Tripuri cuisine, fish, rice, mild
- **Sikkim**: Sikkimese cuisine, momos, rice, simple

## 🍽️ **Cultural Cuisine Profiles**

Each region includes:
- **Signature dishes** and traditional recipes
- **Staple grains** and primary ingredients
- **Common spices** and spice blends
- **Cooking methods** (tandoor, bhuna, dum, steaming)
- **Seasonal ingredients** and festival cuisine
- **Street food** preferences and local specialties
- **Dietary preferences** and restrictions
- **Mindfulness traditions** and cultural practices

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+
- PostgreSQL 15+
- Redis (optional, for enhanced rate limiting)

### **Installation**
```bash
cd backend/user-service
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

### **Environment Variables**
```bash
# Server
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=app_user
DB_PASSWORD=secure_password
DB_NAME=mindfulmeals

# JWT
JWT_ACCESS_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret

# SMS (for OTP)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
```

## 📚 **API Endpoints**

### **Authentication**
- `POST /api/v1/auth/send-otp` - Send OTP for phone verification
- `POST /api/v1/auth/verify-otp` - Verify OTP and authenticate
- `POST /api/v1/auth/setup-2fa` - Setup two-factor authentication
- `POST /api/v1/auth/verify-2fa` - Verify 2FA token
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout and revoke tokens

### **Users** (Protected)
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/preferences` - Get user preferences

### **Households** (Protected)
- `GET /api/v1/households/profile` - Get household profile
- `PUT /api/v1/households/profile` - Update household profile
- `GET /api/v1/households/members` - Get household members

## 🔧 **Development**

### **Scripts**
```bash
npm run dev          # Development with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Lint code
```

### **Database**
```bash
# The service will auto-sync in development
# For production, use migrations
npm run migration:generate
npm run migration:run
```

## 🧪 **Testing**

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

## 📖 **Usage Examples**

### **Get Regional Cuisine Profile**
```typescript
import { RegionalCuisineService } from './services/regional-cuisine.service';
import { IndianRegion } from './entities/Household';

const keralaProfile = RegionalCuisineService.getRegionalProfile(IndianRegion.KERALA);
console.log(keralaProfile.signatureDishes); // ['appam', 'fish curry', 'puttu', ...]
```

### **Suggest Regional Recipes**
```typescript
const vegetarianRecipes = RegionalCuisineService.suggestRegionalRecipes(
  IndianRegion.WEST_BENGAL, 
  ['vegetarian']
);
```

## 🤝 **Contributing**

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## 📄 **License**

This project is part of MindfulMeals and is proprietary.

---

**Built with ❤️ for mindful eating and cultural preservation**
