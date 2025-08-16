# MindfulMeals Commerce Service

A lightweight commerce service that provides seamless integration with quick commerce platforms through app redirects and deep links.

## 🚀 Features

### Core Functionality
- **Vendor App Detection**: Check which quick commerce apps are installed
- **Deep Link Generation**: Create links to vendor apps with search queries (coming soon)
- **Fallback Handling**: Open app store if app not installed
- **Basic Analytics**: Track which vendors users prefer

### Supported Vendors
- **Quick Commerce**: Blinkit, Zepto, Swiggy Instamart
- **Local Vendors**: Local Kirana stores
- **E-commerce**: Amazon Fresh, BigBasket
- **Extensible**: Easy to add new vendor integrations

### What This Service Does NOT Do
- ❌ Product database management
- ❌ Order processing
- ❌ Payment handling
- ❌ Inventory tracking
- ❌ Complex shopping cart logic

## 🏗️ Architecture

### Service Structure
```
commerce-service/
├── src/
│   ├── services/           # Simple redirect logic
│   ├── routes/             # REST API endpoints
│   ├── resolvers/          # GraphQL resolvers
│   ├── middleware/         # Express middleware
│   └── config/             # Configuration files
├── package.json
└── README.md
```

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (minimal - no complex entities)
- **GraphQL**: Apollo Server with Type-GraphQL
- **Security**: Helmet, CORS, Rate Limiting

## 📡 API Endpoints

### REST API

#### Get All Vendors
```http
GET /api/v1/commerce/vendors
```

#### Get Vendor Information
```http
GET /api/v1/commerce/vendors/blinkit
```

#### Generate Deep Link
```http
GET /api/v1/commerce/deep-link/blinkit?query=organic%20bananas
```

#### Get Recommendations
```http
GET /api/v1/commerce/recommendations?limit=3
```

#### Track Preference
```http
POST /api/v1/commerce/track-preference
{
  "vendorType": "blinkit"
}
```

### GraphQL

#### Get Vendors
```graphql
query GetVendors {
  getVendors {
    name
    icon
    deliveryTime
    packageName
  }
}
```

#### Generate Deep Link
```graphql
query GenerateDeepLink($vendor: String!, $query: String) {
  generateDeepLink(vendor: $vendor, query: $query) {
    deepLink
    fallbackUrl
    appStoreUrl
    vendor {
      name
      icon
      deliveryTime
    }
  }
}
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 13+

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
```

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=app_user
DB_PASSWORD=secure_password
DB_NAME=mindfulmeals

# Server
PORT=3002
NODE_ENV=development

# Security
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Docker
```bash
# Build image
docker build -t mindfulmeals-commerce .

# Run container
docker run -p 3002:3002 mindfulmeals-commerce
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Helmet Security**: Comprehensive security headers
- **Input Validation**: Express-validator for all inputs

## 🔮 Future Enhancements

- **Deep Link Integration**: Native app-to-app navigation
- **App Detection**: Check if vendor apps are installed
- **Preference Analytics**: User behavior insights
- **Vendor Performance**: Usage metrics and recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for seamless app redirects and deep links**
