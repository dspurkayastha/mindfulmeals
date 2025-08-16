# MindfulMeals Inventory Service

A comprehensive inventory management service for MindfulMeals that handles pantry management, barcode scanning, shopping list generation, and inventory analytics.

## 🚀 Features

### Core Functionality
- **Pantry Management**: Track household food items with detailed information
- **Barcode Scanning**: Product identification and lookup (future integration)
- **Shopping Lists**: Auto-generated lists based on low stock and expiry
- **Inventory Analytics**: Comprehensive insights into household inventory
- **Waste Tracking**: Monitor and analyze food waste patterns
- **Expiry Management**: Smart reminders for expiring items

### Advanced Features
- **Multi-Category Support**: 13 food categories with icons
- **Storage Location Management**: 6 storage locations (fridge, freezer, pantry, etc.)
- **Regional Preferences**: 36+ Indian states with cultural cuisine mapping
- **Dietary Compliance**: Support for various dietary restrictions
- **Nutritional Tracking**: Comprehensive nutritional information
- **Smart Recommendations**: AI-powered shopping suggestions

## 🏗️ Architecture

### Service Structure
```
inventory-service/
├── src/
│   ├── entities/           # Database entities
│   ├── services/           # Business logic
│   ├── routes/             # REST API endpoints
│   ├── middleware/         # Express middleware
│   └── config/             # Configuration files
├── package.json
└── README.md
```

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express-validator
- **Error Handling**: Custom error classes

## 📡 API Endpoints

### Pantry Management

#### Add Pantry Item
```http
POST /api/v1/inventory/households/:householdId/pantry-items
{
  "name": "Organic Tomatoes",
  "description": "Fresh organic tomatoes from local farms",
  "category": "fruits_vegetables",
  "storageLocation": "refrigerator",
  "quantity": 1.5,
  "unit": "kg",
  "price": 120,
  "currency": "INR",
  "expiryDate": "2024-01-15",
  "brand": "Fresh Farm",
  "barcode": "1234567890123"
}
```

#### Get Pantry Items
```http
GET /api/v1/inventory/households/:householdId/pantry-items?category=fruits_vegetables&lowStock=true&expiringSoon=true
```

#### Update Pantry Item
```http
PUT /api/v1/inventory/households/:householdId/pantry-items/:itemId
{
  "quantity": 0.5,
  "status": "low_stock"
}
```

#### Remove Pantry Item
```http
DELETE /api/v1/inventory/households/:householdId/pantry-items/:itemId
```

### Barcode Scanning

#### Scan Barcode
```http
POST /api/v1/inventory/households/:householdId/scan-barcode
{
  "barcode": "1234567890123"
}
```

### Shopping Lists

#### Generate Shopping List
```http
POST /api/v1/inventory/households/:householdId/shopping-lists
{
  "name": "Weekly Grocery List",
  "type": "auto_generated",
  "includeLowStock": true,
  "includeExpiring": true,
  "estimatedBudget": 2000,
  "currency": "INR"
}
```

### Analytics

#### Get Inventory Analytics
```http
GET /api/v1/inventory/households/:householdId/analytics
```

#### Check Expiring Items
```http
GET /api/v1/inventory/households/:householdId/expiry-check
```

### Waste Tracking

#### Track Waste
```http
POST /api/v1/inventory/households/:householdId/pantry-items/:itemId/waste
{
  "quantity": 0.2,
  "reason": "Spoiled due to improper storage"
}
```

### Reference Data

#### Get Categories
```http
GET /api/v1/inventory/categories
```

#### Get Storage Locations
```http
GET /api/v1/inventory/storage-locations
```

## 🏪 Supported Categories

- **🥬 Fruits & Vegetables**: Fresh produce, seasonal items
- **🥛 Dairy & Eggs**: Milk, cheese, yogurt, eggs
- **🥩 Meat & Fish**: Fresh meat, seafood, poultry
- **🌾 Grains & Pulses**: Rice, wheat, lentils, beans
- **🧂 Spices & Condiments**: Herbs, spices, sauces
- **🍿 Snacks & Beverages**: Chips, drinks, packaged snacks
- **🥖 Bakery**: Bread, pastries, cakes
- **🧊 Frozen Foods**: Frozen vegetables, ice cream
- **🌱 Organic**: Certified organic products
- **🍱 Ready to Eat**: Pre-cooked meals, convenience foods
- **🥤 Beverages**: Juices, sodas, tea, coffee
- **🧴 Personal Care**: Hygiene products, supplements
- **🏠 Household**: Cleaning supplies, paper products

## 🏠 Storage Locations

- **❄️ Refrigerator**: Perishable items, dairy, vegetables
- **🧊 Freezer**: Frozen foods, long-term storage
- **🏠 Pantry**: Dry goods, canned foods, spices
- **🪑 Countertop**: Frequently used items, fruits
- **🧂 Spice Rack**: Spices, herbs, seasonings
- **🍷 Wine Cellar**: Alcoholic beverages, wine storage

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 13+

### Installation
```bash
cd backend/inventory-service
npm install
cp env.example .env
# Edit .env with your database credentials
npm run dev
```

### Environment Variables
```env
# Server
NODE_ENV=development
PORT=3003

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=app_user
DB_PASSWORD=secure_password
DB_NAME=mindfulmeals

# Security
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002

# Feature Flags
ENABLE_BARCODE_SCANNING=true
ENABLE_WASTE_TRACKING=true
ENABLE_EXPIRY_REMINDERS=true
ENABLE_AUTO_SHOPPING_LISTS=true
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Docker
```bash
# Build image
docker build -t mindfulmeals-inventory .

# Run container
docker run -p 3003:3003 mindfulmeals-inventory
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Helmet Security**: Comprehensive security headers
- **Input Validation**: Express-validator for all inputs
- **Error Handling**: Centralized error handling with custom classes

## 📊 Analytics & Insights

### Inventory Analytics
- Total items and value
- Category breakdown
- Storage location distribution
- Expiry timeline analysis
- Low stock alerts

### Waste Analytics
- Waste tracking by item
- Waste reasons and patterns
- Cost impact analysis
- Reduction recommendations

### Consumption Patterns
- Usage frequency analysis
- Seasonal consumption trends
- Dietary preference insights
- Shopping behavior analysis

## 🔮 Future Enhancements

- **Barcode Integration**: Open Food Facts API integration
- **Nutritional APIs**: Real-time nutritional data
- **Smart Notifications**: Push notifications for expiry and low stock
- **AI Recommendations**: Machine learning for shopping suggestions
- **Waste Prediction**: Predictive analytics for food waste
- **Recipe Integration**: Link pantry items to recipes
- **Mobile SDK**: Native mobile app integration

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for mindful pantry management**
