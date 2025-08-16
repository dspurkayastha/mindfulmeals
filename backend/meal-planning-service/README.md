# MindfulMeals Meal Planning Service

An AI-powered meal planning service that combines nutrition science, mindfulness principles, and Indian culinary traditions to create personalized, mindful meal experiences.

## 🚀 Features

### Core AI-Powered Meal Planning
- **Intelligent Meal Generation**: AI algorithms create personalized meal plans
- **Mindful Eating Integration**: Mindfulness themes and meditation prompts for each meal
- **Cultural Authenticity**: Deep integration with Indian regional cuisines and traditions
- **Nutritional Balance**: Smart nutritional analysis and goal tracking
- **Seasonal Intelligence**: Local ingredients and seasonal cooking recommendations

### Mindfulness Integration
- **10 Mindfulness Themes**: Gratitude, Presence, Joy, Love, Patience, Compassion, Wisdom, Balance, Harmony, Peace
- **Meditation Prompts**: Customized prompts for each meal and theme
- **Breathing Exercises**: Theme-specific breathing patterns
- **Sensory Awareness**: Mindful eating techniques and tips
- **Emotional Balance**: Stress reduction and emotional well-being

### Cultural Cuisine Integration
- **36+ Indian Regions**: Comprehensive coverage of all states and union territories
- **Regional Specialties**: Traditional dishes and cooking methods
- **Festival Integration**: Cultural celebrations and traditional recipes
- **Seasonal Cooking**: Local ingredients and seasonal availability
- **Cultural Stories**: Traditional wisdom and family recipes

### Recipe Management
- **Smart Recipe Scoring**: AI-powered recipe recommendations
- **Ingredient Substitutions**: Flexible cooking with alternatives
- **Cooking Tips**: Step-by-step mindfulness integration
- **Nutritional Analysis**: Comprehensive health and wellness insights
- **Cultural Context**: Traditional methods and regional variations

## 🏗️ Architecture

### Service Structure
```
meal-planning-service/
├── src/
│   ├── entities/           # Database entities
│   ├── services/           # Business logic and AI
│   ├── routes/             # REST API endpoints
│   ├── middleware/         # Express middleware
│   ├── config/             # Configuration files
│   └── ai/                 # AI/ML components
├── package.json
└── README.md
```

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **AI/ML**: Natural language processing, recommendation engines
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express-validator with custom rules
- **Error Handling**: Custom error classes with AI-specific handling

## 📡 API Endpoints

### AI-Powered Meal Planning

#### Generate Meal Plan
```http
POST /api/v1/meal-planning/households/:householdId/generate-plan
{
  "planType": "weekly",
  "startDate": "2024-01-15",
  "endDate": "2024-01-21",
  "mealTypes": ["breakfast", "lunch", "dinner"],
  "preferences": {
    "mindfulnessLevel": "intermediate",
    "culturalAuthenticity": true,
    "seasonalCooking": true,
    "healthGoals": ["weight_management", "energy_boost"],
    "cookingTime": "moderate",
    "complexity": "simple"
  }
}
```

#### Save Meal Plan
```http
POST /api/v1/meal-planning/households/:householdId/save-plan
{
  "mealPlans": [
    {
      "date": "2024-01-15",
      "mealType": "breakfast",
      "mindfulnessTheme": "gratitude",
      "intention": "Express gratitude for morning nourishment",
      "meditationPrompt": "Take three deep breaths and think of three things you're grateful for",
      "breathingExercise": "Inhale gratitude for 4 counts, exhale tension for 4 counts"
    }
  ]
}
```

### Mindfulness Integration

#### Get Mindfulness Themes
```http
GET /api/v1/meal-planning/mindfulness/themes
```

#### Get Mindfulness Prompts
```http
GET /api/v1/meal-planning/mindfulness/prompts/gratitude
```

### Cultural Integration

#### Get Cultural Regions
```http
GET /api/v1/meal-planning/cultural/regions
```

#### Get Regional Festivals
```http
GET /api/v1/meal-planning/cultural/festivals?region=kerala&month=8
```

### Recipe Management

#### Create Recipe
```http
POST /api/v1/meal-planning/households/:householdId/recipes
{
  "name": "Mindful Kerala Fish Curry",
  "description": "Traditional Kerala fish curry with mindfulness integration",
  "category": "curries",
  "type": "non_vegetarian",
  "difficulty": "medium",
  "mindfulnessLevel": "intermediate",
  "mindfulnessInfo": {
    "meditationPrompt": "Focus on the aroma of coconut and spices",
    "mindfulEatingTips": ["Savor each bite", "Notice the texture of fish"],
    "breathingExercise": "Inhale the fragrance, exhale gratitude"
  },
  "culturalInfo": {
    "origin": "Kerala",
    "region": "kerala",
    "traditionalUses": ["Festival meals", "Family gatherings"],
    "culturalSignificance": "Represents coastal Kerala's fishing heritage"
  }
}
```

#### Get Recipe Recommendations
```http
GET /api/v1/meal-planning/households/:householdId/recommendations?mealType=lunch&mindfulnessLevel=intermediate&culturalAuthenticity=true
```

### Nutritional Analysis

#### Analyze Ingredients
```http
POST /api/v1/meal-planning/nutrition/analyze
{
  "ingredients": [
    {
      "name": "Fresh Fish",
      "quantity": 500,
      "unit": "grams"
    },
    {
      "name": "Coconut Milk",
      "quantity": 200,
      "unit": "ml"
    }
  ]
}
```

## 🧘 Mindfulness Themes

### Available Themes
- **🙏 Gratitude**: Practice thankfulness and appreciation
- **🧘 Presence**: Be fully aware and present in the moment
- **😊 Joy**: Find happiness and delight in simple pleasures
- **❤️ Love**: Cook and eat with love, care, and compassion
- **⏳ Patience**: Practice patience throughout the cooking process
- **🤗 Compassion**: Show kindness and understanding
- **🧠 Wisdom**: Make conscious, informed food choices
- **⚖️ Balance**: Find equilibrium between indulgence and health
- **🎵 Harmony**: Create harmony between body, mind, and food
- **🕊️ Peace**: Cultivate inner tranquility and calm

### Theme Integration
Each theme includes:
- **Intention Setting**: Clear purpose for the meal
- **Meditation Prompts**: Guided mindfulness practices
- **Breathing Exercises**: Theme-specific breathing patterns
- **Mindful Eating Tips**: Practical techniques for mindful consumption
- **Cultural Context**: Regional wisdom and traditions

## 🏮 Cultural Cuisine Integration

### Regional Coverage
- **North India**: Punjabi, Kashmiri, Rajasthani cuisines
- **South India**: Tamil, Telugu, Kannada, Malayali cuisines
- **East India**: Bengali, Odia, Assamese cuisines
- **West India**: Gujarati, Maharashtrian, Goan cuisines
- **Northeast India**: Assamese, Manipuri, Naga cuisines

### Cultural Features
- **Traditional Recipes**: Authentic regional dishes
- **Festival Integration**: Cultural celebrations and food
- **Seasonal Cooking**: Local ingredients and availability
- **Regional Stories**: Cultural heritage and wisdom
- **Cooking Methods**: Traditional techniques and tips

## 🧠 AI-Powered Features

### Intelligent Meal Planning
- **Preference Learning**: Adapts to user preferences over time
- **Nutritional Optimization**: Balances taste, health, and cultural authenticity
- **Seasonal Intelligence**: Recommends ingredients based on availability
- **Cultural Alignment**: Matches recipes to regional preferences
- **Mindfulness Integration**: Suggests appropriate themes and practices

### Recipe Recommendations
- **Multi-Factor Scoring**: Considers mindfulness, culture, health, and preferences
- **Contextual Awareness**: Adapts to time, mood, and occasion
- **Substitution Intelligence**: Suggests alternatives for unavailable ingredients
- **Cultural Authenticity**: Maintains traditional flavors and methods
- **Health Optimization**: Balances indulgence with nutritional goals

### Smart Analytics
- **User Engagement**: Tracks mindfulness practice and meal completion
- **Cultural Insights**: Analyzes regional cuisine preferences
- **Health Progress**: Monitors nutritional goals and dietary compliance
- **Seasonal Patterns**: Identifies cooking and ingredient trends
- **Mindfulness Growth**: Tracks progress in mindful eating practices

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Redis (optional, for AI response caching)

### Installation
```bash
cd backend/meal-planning-service
npm install
cp env.example .env
# Edit .env with your database credentials and AI API keys
npm run dev
```

### Environment Variables
```env
# Server
NODE_ENV=development
PORT=3004

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=app_user
DB_PASSWORD=secure_password
DB_NAME=mindfulmeals

# AI Features
ENABLE_AI_MEAL_PLANNING=true
ENABLE_MINDFULNESS_INTEGRATION=true
ENABLE_CULTURAL_INTEGRATION=true

# External APIs
OPENAI_API_KEY=your_openai_api_key_here
NUTRITIONIX_API_KEY=your_nutritionix_api_key_here
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Test AI features
npm run ai:generate
```

## 🚀 Deployment

### Docker
```bash
# Build image
docker build -t mindfulmeals-meal-planning .

# Run container
docker run -p 3004:3004 mindfulmeals-meal-planning
```

### Environment-Specific Configs
- **Development**: Local database, mock AI responses
- **Staging**: Staging database, limited AI features
- **Production**: Production database, full AI integration

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable allowed origins
- **Helmet Security**: Comprehensive security headers
- **Input Validation**: Express-validator for all inputs
- **Error Handling**: Custom error classes with AI-specific handling
- **SQL Injection Protection**: TypeORM with parameterized queries

## 📊 Analytics & Insights

### Meal Planning Analytics
- **Planning Frequency**: Daily, weekly, monthly patterns
- **Completion Rates**: Meal plan adherence and success
- **Preference Evolution**: Changing tastes and preferences over time
- **Cultural Engagement**: Regional cuisine adoption rates
- **Mindfulness Progress**: Growth in mindful eating practices

### AI Performance Metrics
- **Recommendation Accuracy**: User satisfaction with AI suggestions
- **Cultural Authenticity**: Preservation of traditional methods
- **Nutritional Balance**: Health goal achievement rates
- **Seasonal Intelligence**: Ingredient availability accuracy
- **User Engagement**: Interaction with AI features

### Cultural Insights
- **Regional Preferences**: Most popular cuisines by area
- **Festival Participation**: Cultural celebration engagement
- **Traditional Recipe Usage**: Heritage preservation metrics
- **Seasonal Cooking Patterns**: Local ingredient utilization
- **Cross-Cultural Adoption**: Fusion and innovation trends

## 🔮 Future Enhancements

### Advanced AI Features
- **Natural Language Processing**: Conversational meal planning
- **Image Recognition**: Food photo analysis and recipe matching
- **Voice Integration**: Spoken meal planning and cooking guidance
- **Predictive Analytics**: Anticipate user needs and preferences
- **Machine Learning**: Continuous improvement from user feedback

### Enhanced Mindfulness
- **Personalized Meditation**: AI-generated mindfulness practices
- **Emotional Intelligence**: Mood-based meal and practice recommendations
- **Progress Tracking**: Detailed mindfulness journey analytics
- **Community Features**: Shared mindfulness practices and experiences
- **Integration APIs**: Connect with meditation and wellness apps

### Cultural Expansion
- **Global Cuisines**: Beyond Indian regional cuisines
- **Cultural Exchange**: Cross-cultural recipe adaptations
- **Historical Context**: Traditional cooking methods and stories
- **Festival Database**: Comprehensive cultural celebration coverage
- **Language Support**: Multi-language recipe and instruction support

### Health & Wellness
- **Medical Integration**: Dietary restriction and allergy management
- **Fitness Tracking**: Exercise and meal plan synchronization
- **Mental Health**: Emotional well-being and stress management
- **Sleep Optimization**: Evening meal planning for better rest
- **Energy Management**: Meal timing for optimal performance

## 🤝 Contributing

1. Follow the existing code style and architecture
2. Add tests for new AI features and mindfulness integration
3. Update documentation for cultural and regional features
4. Ensure all tests pass and AI features work correctly
5. Consider cultural sensitivity in recipe and content additions

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for mindful, cultural, and intelligent meal planning**
