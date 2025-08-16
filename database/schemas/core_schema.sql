-- HOUSEHOLD MANAGEMENT
CREATE TABLE households (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(50), -- 'north_indian', 'south_indian', etc.
    dietary_type VARCHAR(30), -- 'vegetarian', 'vegan', 'mixed'
    budget_monthly INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY,
    household_id UUID REFERENCES households(id),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20), -- 'primary_cook', 'family_member', 'child'
    age_group VARCHAR(20),
    dietary_restrictions TEXT[], -- ['diabetic', 'hypertension']
    health_goals TEXT[], -- ['weight_loss', 'muscle_gain']
    language_preference VARCHAR(10) DEFAULT 'hindi'
);

-- INDIAN FOOD DATA
CREATE TABLE ingredients (
    id UUID PRIMARY KEY,
    name_english VARCHAR(200) NOT NULL,
    name_hindi VARCHAR(200),
    category VARCHAR(50), -- 'cereals', 'pulses', 'vegetables', 'spices'
    nutrition_per_100g JSONB, -- IFCT data
    source_attribution VARCHAR(200), -- 'IFCT_2017', 'NIN_2020'
    common_units TEXT[] -- ['cup', 'bowl', 'piece', 'bunch']
);

CREATE TABLE recipes (
    id UUID PRIMARY KEY,
    name_english VARCHAR(200) NOT NULL,
    name_hindi VARCHAR(200),
    cuisine_type VARCHAR(50), -- 'north_indian', 'gujarati', 'bengali'
    meal_type VARCHAR(20), -- 'breakfast', 'lunch', 'dinner', 'snack'
    prep_time_minutes INTEGER,
    difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'expert'
    serves_count INTEGER,
    instructions JSONB, -- Step-by-step with Hindi translations
    nutritional_info JSONB,
    festival_tags TEXT[], -- ['diwali', 'navratri', 'karwa_chauth']
    source_attribution VARCHAR(200),
    is_user_generated BOOLEAN DEFAULT FALSE
);

-- MEAL PLANNING
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY,
    household_id UUID REFERENCES households(id),
    week_starting DATE,
    budget_allocated INTEGER,
    dietary_goals TEXT[],
    festival_considerations TEXT[],
    generated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE planned_meals (
    id UUID PRIMARY KEY,
    meal_plan_id UUID REFERENCES meal_plans(id),
    recipe_id UUID REFERENCES recipes(id),
    meal_date DATE,
    meal_type VARCHAR(20),
    serves_count INTEGER,
    estimated_cost INTEGER
);

-- INVENTORY/PANTRY
CREATE TABLE pantry_items (
    id UUID PRIMARY KEY,
    household_id UUID REFERENCES households(id),
    ingredient_id UUID REFERENCES ingredients(id),
    quantity DECIMAL(10,2),
    unit VARCHAR(20),
    purchase_date DATE,
    expiry_date DATE,
    storage_location VARCHAR(50), -- 'fridge', 'pantry', 'freezer'
    barcode VARCHAR(50),
    purchase_source VARCHAR(50) -- 'blinkit', 'zepto', 'local_store'
);

-- COMMERCE INTEGRATION
CREATE TABLE commerce_products (
    id UUID PRIMARY KEY,
    ingredient_id UUID REFERENCES ingredients(id),
    vendor VARCHAR(50), -- 'blinkit', 'zepto', 'swiggy_instamart'
    sku VARCHAR(100),
    name VARCHAR(200),
    brand VARCHAR(100),
    quantity DECIMAL(10,2),
    unit VARCHAR(20),
    price INTEGER, -- in paisa
    availability BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- COMMUNITY FEATURES  
CREATE TABLE user_recipes (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id),
    recipe_data JSONB, -- Full recipe structure
    moderation_status VARCHAR(20) DEFAULT 'pending',
    votes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE community_posts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id),
    post_type VARCHAR(20), -- 'question', 'tip', 'challenge_entry'
    content TEXT,
    media_urls TEXT[],
    tags TEXT[],
    votes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);