-- swasthya-food/data-pipeline/export/nutrition_data.sql

-- Database schema and data inserts for SwasthyaFood nutrition database
-- Generated: 2024-01-15T10:30:00Z
-- Sources: IFCT 2017, NIN Database, Spices Board of India
-- Compliance: Open Government Data License India

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY,
    name_english VARCHAR(200) NOT NULL,
    name_hindi VARCHAR(200),
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    nutrition_per_100g JSONB NOT NULL,
    common_measurements JSONB,
    storage_info JSONB,
    source_attribution JSONB NOT NULL,
    regional_preferences TEXT[],
    allergen_info JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY,
    name_english VARCHAR(200) NOT NULL,
    name_hindi VARCHAR(200),
    cuisine_type VARCHAR(50) NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    prep_time_minutes INTEGER,
    cook_time_minutes INTEGER,
    total_time_minutes INTEGER,
    difficulty_level VARCHAR(20),
    serves_count INTEGER,
    instructions JSONB NOT NULL,
    nutritional_info JSONB,
    dietary_info JSONB,
    cultural_context JSONB,
    source_attribution JSONB NOT NULL,
    is_user_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert ingredient data
INSERT INTO ingredients (id, name_english, name_hindi, category, subcategory, nutrition_per_100g, common_measurements, storage_info, source_attribution, regional_preferences, allergen_info) VALUES

('ing-basmati-rice', 'Basmati Rice', 'बासमती चावल', 'cereals', 'rice_varieties', 
'{"calories": 345, "protein": 7.4, "carbohydrates": 78.0, "fiber": 2.2, "iron": 1.5, "glycemic_index": 58}',
'{"cup": {"weight_grams": 195, "volume_ml": 240}, "bowl": {"weight_grams": 150, "volume_ml": 185}, "handful": {"weight_grams": 30}}',
'{"shelf_life_days": 730, "storage_conditions": "Cool, dry place", "post_cooking_life_hours": 24}',
'{"primary_source": "IFCT_2017", "verification_sources": ["NIN_Database"], "license": "Open_Government_Data"}',
'{"north_indian", "pakistani", "middle_eastern"}',
'{"gluten_free": true, "common_allergens": []}'),

('ing-turmeric-powder', 'Turmeric Powder', 'हल्दी पाउडर', 'spices', 'ground_spices',
'{"calories": 354, "protein": 7.8, "carbohydrates": 64.9, "fiber": 21.1, "curcumin": 3.14, "iron": 41.4}',
'{"tsp": {"weight_grams": 2.2}, "tbsp": {"weight_grams": 6.8}, "pinch": {"weight_grams": 0.3}}',
'{"shelf_life_days": 1095, "storage_conditions": "Airtight container, away from light", "post_cooking_life_hours": 48}',
'{"primary_source": "Spices_Board_India", "verification_sources": ["IFCT_2017"], "license": "Open_Government_Data"}',
'{"pan_indian", "south_asian"}',
'{"gluten_free": true, "common_allergens": [], "medicinal_properties": {"anti_inflammatory": true, "antioxidant": true}}'),

('ing-red-lentils-masoor', 'Red Lentils (Masoor Dal)', 'मसूर दाल', 'pulses', 'lentils',
'{"calories": 116, "protein": 9.0, "carbohydrates": 20.0, "fiber": 8.0, "folate": 181, "iron": 3.3}',
'{"cup": {"weight_grams": 192, "volume_ml": 240}, "bowl": {"weight_grams": 150}, "kg": {"weight_grams": 1000}}',
'{"shelf_life_days": 365, "storage_conditions": "Dry, airtight container", "post_cooking_life_hours": 24}',
'{"primary_source": "NIN_Database", "verification_sources": ["IFCT_2017"], "license": "Public_Domain"}',
'{"north_indian", "bengali", "punjabi"}',
'{"gluten_free": true, "common_allergens": [], "cooking_properties": {"cooking_time_minutes": 20, "soaking_required": false}}'),

('ing-onion-red', 'Red Onion', 'लाल प्याज़', 'vegetables', 'root_vegetables',
'{"calories": 40, "protein": 1.1, "carbohydrates": 9.3, "fiber": 1.7, "vitamin_c": 7.4, "quercetin": 20.0}',
'{"medium": {"weight_grams": 110}, "large": {"weight_grams": 150}, "chopped_cup": {"weight_grams": 160}}',
'{"shelf_life_days": 30, "storage_conditions": "Cool, dry, well-ventilated", "post_cooking_life_hours": 24}',
'{"primary_source": "IFCT_2017", "verification_sources": ["NIN_Database"], "license": "Open_Government_Data"}',
'{"pan_indian"}',
'{"gluten_free": true, "common_allergens": [], "seasonal_availability": {"peak_season": ["october", "november", "december"], "year_round": true}}'),

('ing-ginger-fresh', 'Fresh Ginger', 'अदरक', 'spices', 'fresh_spices',
'{"calories": 80, "protein": 1.8, "carbohydrates": 17.8, "fiber": 2.0, "gingerol": 5.0, "vitamin_c": 5.0}',
'{"inch": {"weight_grams": 6}, "tbsp_minced": {"weight_grams": 8}, "piece_small": {"weight_grams": 15}}',
'{"shelf_life_days": 21, "storage_conditions": "Refrigerated, wrapped", "post_cooking_life_hours": 48}',
'{"primary_source": "Spices_Board_India", "verification_sources": ["IFCT_2017"], "license": "Open_Government_Data"}',
'{"pan_indian", "asian"}',
'{"gluten_free": true, "common_allergens": [], "medicinal_properties": {"digestive_aid": true, "anti_nausea": true, "anti_inflammatory": true}}'),

('ing-tomato-ripe', 'Ripe Tomato', 'पका हुआ टमाटर', 'vegetables', 'fruit_vegetables',
'{"calories": 18, "protein": 0.9, "carbohydrates": 3.9, "fiber": 1.2, "vitamin_c": 13.7, "lycopene": 2.6}',
'{"medium": {"weight_grams": 123}, "large": {"weight_grams": 182}, "chopped_cup": {"weight_grams": 180}}',
'{"shelf_life_days": 7, "storage_conditions": "Room temperature, refrigerate when ripe", "post_cooking_life_hours": 24}',
'{"primary_source": "IFCT_2017", "verification_sources": ["NIN_Database"], "license": "Open_Government_Data"}',
'{"pan_indian"}',
'{"gluten_free": true, "common_allergens": ["nightshade_sensitivity"], "seasonal_availability": {"peak_season": ["december", "january", "february"], "year_round": true}}'),

('ing-cumin-seeds', 'Cumin Seeds', 'जीरा', 'spices', 'whole_spices',
'{"calories": 375, "protein": 17.8, "carbohydrates": 44.2, "fiber": 10.5, "iron": 66.4, "calcium": 931}',
'{"tsp": {"weight_grams": 2.1}, "tbsp": {"weight_grams": 6.0}, "handful": {"weight_grams": 12}}',
'{"shelf_life_days": 1095, "storage_conditions": "Airtight container, cool place", "post_cooking_life_hours": 72}',
'{"primary_source": "Spices_Board_India", "verification_sources": ["IFCT_2017"], "license": "Open_Government_Data"}',
'{"north_indian", "middle_eastern"}',
'{"gluten_free": true, "common_allergens": [], "culinary_properties": {"tempering_spice": true, "roasting_enhances_flavor": true}}'),

('ing-coriander-leaves', 'Coriander Leaves (Cilantro)', 'धनिया पत्ती', 'herbs', 'fresh_herbs',
'{"calories": 23, "protein": 2.1, "carbohydrates": 3.7, "fiber": 2.8, "vitamin_c": 27.0, "vitamin_k": 310}',
'{"bunch": {"weight_grams": 25}, "cup_chopped": {"weight_grams": 16}, "handful": {"weight_grams": 10}}',
'{"shelf_life_days": 7, "storage_conditions": "Refrigerated with stems in water", "post_cooking_life_hours": 6}',
'{"primary_source": "IFCT_2017", "verification_sources": ["NIN_Database"], "license": "Open_Government_Data"}',
'{"pan_indian", "mexican", "middle_eastern"}',
'{"gluten_free": true, "common_allergens": [], "culinary_properties": {"garnish": true, "heat_sensitive": true, "add_at_end": true}}'),

('ing-garlic-cloves', 'Garlic Cloves', 'लहसुन', 'spices', 'aromatic_vegetables',
'{"calories": 149, "protein": 6.4, "carbohydrates": 33.1, "fiber": 2.1, "allicin": 5.9, "vitamin_c": 31.2}',
'{"clove": {"weight_grams": 3}, "tbsp_minced": {"weight_grams": 8}, "head": {"weight_grams": 40}}',
'{"shelf_life_days": 90, "storage_conditions": "Cool, dry, well-ventilated", "post_cooking_life_hours": 48}',
'{"primary_source": "IFCT_2017", "verification_sources": ["Spices_Board_India"], "license": "Open_Government_Data"}',
'{"pan_indian", "mediterranean"}',
'{"gluten_free": true, "common_allergens": [], "medicinal_properties": {"antimicrobial": true, "cardiovascular_support": true, "immune_boosting": true}}'),

('ing-green-chilies', 'Green Chilies', 'हरी मिर्च', 'spices', 'hot_spices',
'{"calories": 40, "protein": 1.9, "carbohydrates": 9.5, "fiber": 4.3, "vitamin_c": 244, "capsaicin": 0.01}',
'{"piece": {"weight_grams": 4}, "chopped_tbsp": {"weight_grams": 9}, "slit": {"weight_grams": 4}}',
'{"shelf_life_days": 10, "storage_conditions": "Refrigerated in perforated bag", "post_cooking_life_hours": 24}',
'{"primary_source": "IFCT_2017", "verification_sources": ["NIN_Database"], "license": "Open_Government_Data"}',
'{"pan_indian", "thai", "mexican"}',
'{"gluten_free": true, "common_allergens": ["capsaicin_sensitivity"], "heat_level": {"scoville_units": "2500-8000", "heat_rating": "medium"}}');

-- Insert recipe data
INSERT INTO recipes (id, name_english, name_hindi, cuisine_type, meal_type, prep_time_minutes, cook_time_minutes, total_time_minutes, difficulty_level, serves_count, instructions, nutritional_info, dietary_info, cultural_context, source_attribution) VALUES

('rec-dal-tadka-001', 'Dal Tadka', 'दाल तड़का', 'north_indian', 'lunch', 10, 30, 40, 'beginner', 4,
'[
  {"step": 1, "english": "Wash and soak toor dal for 30 minutes. Cook with turmeric and 3 cups water in pressure cooker for 3-4 whistles.", "hindi": "तूर दाल को धोकर 30 मिनट भिगोएं। हल्दी और 3 कप पानी के साथ प्रेशर कुकर में 3-4 सीटी तक पकाएं।", "time_minutes": 15, "equipment": ["pressure_cooker"]},
  {"step": 2, "english": "Heat oil in a pan. Add cumin seeds and let them splutter.", "hindi": "एक पैन में तेल गरम करें। जीरा डालकर तड़काने दें।", "time_minutes": 2, "temperature": "medium_heat"},
  {"step": 3, "english": "Add chopped onions and sauté until golden brown.", "hindi": "कटे प्याज़ डालें और सुनहरा होने तक भूनें।", "time_minutes": 5, "visual_cue": "golden_brown_color"},
  {"step": 4, "english": "Add ginger-garlic paste, green chilies. Cook for 1 minute until aromatic.", "hindi": "अदरक-लहसुन का पेस्ट और हरी मिर्च डालें। 1 मिनट तक खुशबू आने तक पकाएं।", "time_minutes": 1, "sensory_cue": "aromatic"},
  {"step": 5, "english": "Add tomatoes and cook until they break down and become mushy.", "hindi": "टमाटर डालें और तब तक पकाएं जब तक वे टूटकर नरम न हो जाएं।", "time_minutes": 5, "visual_cue": "tomatoes_broken_down"},
  {"step": 6, "english": "Add cooked dal, salt, and mix well. Simmer for 5 minutes, adjusting consistency with water.", "hindi": "पकी दाल, नमक डालें और अच्छी तरह मिलाएं। 5 मिनट तक उबालें, पानी से गाढ़ाई को ठीक करें।", "time_minutes": 5, "technique": "simmering"},
  {"step": 7, "english": "Garnish with fresh coriander leaves and serve hot with rice or roti.", "hindi": "ताज़ी धनिया पत्ती से गार्निश करें और चावल या रोटी के साथ गरम परोसें।", "time_minutes": 1, "serving_suggestion": "with_rice_or_roti"}
]',
'{"per_serving": {"calories": 168, "protein": 11.2, "carbohydrates": 28.5, "fiber": 9.8, "fat": 2.1, "iron": 3.2, "folate": 85}, "health_benefits": ["High in plant protein", "Rich in dietary fiber", "Good source of folate", "Low in saturated fat"]}',
'{"vegetarian": true, "vegan": true, "gluten_free": true, "dairy_free": true, "nut_free": true, "suitable_for": ["diabetes", "heart_healthy", "weight_management"]}',
'{"origin": "North Indian", "traditional_significance": "Comfort food staple in Indian households", "festival_association": [], "regional_variations": ["Bengali style with panch phoron", "Gujarati style with jaggery", "South Indian style with curry leaves"]}',
'{"primary_source": "RecipeDB_Kaggle", "cultural_verification": "North Indian cuisine expert", "nutritional_analysis": "Certified nutritionist", "license": "CC_BY_SA_4.0"}'),

('rec-rajma-masala-002', 'Rajma Masala', 'राजमा मसाला', 'punjabi', 'lunch', 480, 45, 525, 'intermediate', 6,
'[
  {"step": 1, "english": "Soak rajma overnight in plenty of water. Drain and rinse before cooking.", "hindi": "राजमा को रात भर पानी में भिगोएं। पकाने से पहले छानकर धो लें।", "time_minutes": 480, "importance": "critical_for_texture"},
  {"step": 2, "english": "Pressure cook soaked rajma with salt and 4-5 cups water for 8-10 whistles until very soft.", "hindi": "भिगोए राजमा को नमक और 4-5 कप पानी के साथ प्रेशर कुकर में 8-10 सीटी तक बहुत नरम होने तक पकाएं।", "time_minutes": 25, "equipment": ["pressure_cooker"], "visual_cue": "beans_should_mash_easily"}
]',
'{"per_serving": {"calories": 245, "protein": 15.3, "carbohydrates": 42.1, "fiber": 13.6, "fat": 2.8, "iron": 4.1, "potassium": 658}}',
'{"vegetarian": true, "vegan": true, "gluten_free": true, "high_protein": true, "suitable_for": ["diabetes", "heart_healthy", "muscle_building"]}',
'{"origin": "Punjab", "traditional_significance": "Sunday lunch staple in Punjabi families", "best_served_with": ["steamed_rice", "jeera_rice"]}',
'{"primary_source": "NIN_Database", "cultural_verification": "Punjabi cuisine expert", "license": "Public_Domain"}'),

('rec-palak-paneer-003', 'Palak Paneer', 'पालक पनीर', 'north_indian', 'lunch', 20, 25, 45, 'intermediate', 4,
'[
  {"step": 1, "english": "Blanch spinach in boiling water for 2 minutes, then plunge in ice water to retain color.", "hindi": "पालक को उबलते पानी में 2 मिनट के लिए डालें, फिर बर्फ के पानी में डालकर रंग बनाए रखें।", "time_minutes": 5, "technique": "blanching"},
  {"step": 2, "english": "Blend blanched spinach to smooth puree without adding water.", "hindi": "ब्लांच की गई पालक को बिना पानी डाले चिकना पेस्ट बना लें।", "time_minutes": 3, "equipment": ["blender"]}
]',
'{"per_serving": {"calories": 195, "protein": 12.8, "carbohydrates": 8.9, "fat": 13.2, "calcium": 168, "iron": 3.8, "vitamin_a": 2813}, "health_benefits": ["High in calcium and protein", "Rich in iron and vitamin A", "Good for bone health", "Supports eye health"]}',
'{"vegetarian": true, "gluten_free": true, "high_protein": true, "suitable_for": ["muscle_building", "bone_health", "pregnancy"]}',
'{"origin": "North Indian", "traditional_significance": "Popular restaurant and home dish", "best_served_with": ["naan", "roti", "rice"]}',
'{"primary_source": "RecipeDB_Kaggle", "license": "CC_BY_SA_4.0"}');

-- Create indexes for performance
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_source ON ingredients USING GIN(source_attribution);
CREATE INDEX idx_recipes_cuisine_meal ON recipes(cuisine_type, meal_type);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty_level);
CREATE INDEX idx_recipes_dietary ON recipes USING GIN(dietary_info);

-- Add attribution comments
COMMENT ON TABLE ingredients IS 'Ingredient data sourced from IFCT 2017 (NIN, ICMR), Spices Board of India, and NIN Database under Open Government Data License';
COMMENT ON TABLE recipes IS 'Recipe data from community contributions (CC BY-SA 4.0), NIN Database (Public Domain), and expert curation';

-- Data quality constraints
ALTER TABLE ingredients ADD CONSTRAINT chk_nutrition_not_empty CHECK (nutrition_per_100g IS NOT NULL AND nutrition_per_100g != '{}');
ALTER TABLE ingredients ADD CONSTRAINT chk_source_attribution_required CHECK (source_attribution IS NOT NULL AND source_attribution != '{}');
ALTER TABLE recipes ADD CONSTRAINT chk_instructions_not_empty CHECK (instructions IS NOT NULL AND json_array_length(instructions) > 0);
ALTER TABLE recipes ADD CONSTRAINT chk_serves_positive CHECK (serves_count > 0);

-- Compliance tracking
CREATE TABLE data_lineage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    source_system VARCHAR(100) NOT NULL,
    ingestion_date TIMESTAMP DEFAULT NOW(),
    license_type VARCHAR(50) NOT NULL,
    attribution_text TEXT NOT NULL,
    compliance_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP
);

-- Insert lineage tracking for sample data
INSERT INTO data_lineage (table_name, record_id, source_system, license_type, attribution_text, compliance_verified, verification_date) VALUES
('ingredients', 'ing-basmati-rice', 'IFCT_2017', 'Open_Government_Data', 'Indian Food Composition Tables 2017, National Institute of Nutrition, ICMR', true, NOW()),
('ingredients', 'ing-turmeric-powder', 'Spices_Board_India', 'Open_Government_Data', 'Spice Board of India, Ministry of Commerce & Industry, Government of India', true, NOW()),
('ingredients', 'ing-red-lentils-masoor', 'NIN_Database', 'Public_Domain', 'National Institute of Nutrition Database, Indian Council of Medical Research', true, NOW()),
('recipes', 'rec-dal-tadka-001', 'RecipeDB_Kaggle', 'CC_BY_SA_4.0', 'Traditional Indian recipes dataset, Community contributions under Creative Commons Attribution-ShareAlike 4.0', true, NOW()),
('recipes', 'rec-rajma-masala-002', 'NIN_Database', 'Public_Domain', 'National Institute of Nutrition recipe collection, Public Domain', true, NOW());