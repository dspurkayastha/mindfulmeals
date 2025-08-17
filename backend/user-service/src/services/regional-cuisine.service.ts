import { IndianRegion } from '../entities/Household';

export interface RegionalCuisineProfile {
  region: IndianRegion;
  primaryLanguage: string;
  dominantCuisine: string;
  signatureDishes: string[];
  stapleGrains: string[];
  commonSpices: string[];
  cookingMethods: string[];
  seasonalIngredients: string[];
  festivalCuisine: string[];
  streetFood: string[];
  spiceBlends: string[];
  dietaryPreferences: string[];
  mindfulnessTraditions: string[];
}

export class RegionalCuisineService {
  private static readonly regionalProfiles: Partial<Record<IndianRegion, RegionalCuisineProfile>> = {
    // North Indian States
    [IndianRegion.PUNJAB]: {
      region: IndianRegion.PUNJAB,
      primaryLanguage: 'punjabi',
      dominantCuisine: 'Punjabi',
      signatureDishes: ['butter chicken', 'sarson da saag', 'makki di roti', 'amritsari fish', 'paneer tikka'],
      stapleGrains: ['wheat', 'corn', 'rice'],
      commonSpices: ['cumin', 'coriander', 'turmeric', 'garam masala', 'kasuri methi'],
      cookingMethods: ['tandoor', 'bhuna', 'dum', 'deep frying'],
      seasonalIngredients: ['mustard greens', 'corn', 'peas', 'carrots'],
      festivalCuisine: ['diwali', 'baisakhi', 'lohri', 'gurpurab'],
      streetFood: ['amritsari kulcha', 'chole bhature', 'lassi', 'jalebi'],
      spiceBlends: ['garam masala', 'tandoori masala', 'chaat masala'],
      dietaryPreferences: ['rich', 'buttery', 'spicy'],
      mindfulnessTraditions: ['langar seva', 'community dining', 'gratitude prayers']
    },

    [IndianRegion.KERALA]: {
      region: IndianRegion.KERALA,
      primaryLanguage: 'malayalam',
      dominantCuisine: 'Malayali',
      signatureDishes: ['appam', 'fish curry', 'puttu', 'idiyappam', 'malabar biryani'],
      stapleGrains: ['rice', 'coconut'],
      commonSpices: ['black pepper', 'cardamom', 'cinnamon', 'cloves', 'curry leaves'],
      cookingMethods: ['steaming', 'curry', 'biryani', 'coconut milk cooking'],
      seasonalIngredients: ['jackfruit', 'mango', 'banana', 'coconut', 'seafood'],
      festivalCuisine: ['onam', 'vishu', 'christmas', 'easter'],
      streetFood: ['puttu kadala', 'appam stew', 'fish fry', 'banana chips'],
      spiceBlends: ['kerala garam masala', 'fish curry masala', 'biryani masala'],
      dietaryPreferences: ['coconut-based', 'seafood', 'mildly spiced'],
      mindfulnessTraditions: ['ayurvedic principles', 'seasonal eating', 'meditation practices']
    },

    [IndianRegion.WEST_BENGAL]: {
      region: IndianRegion.WEST_BENGAL,
      primaryLanguage: 'bengali',
      dominantCuisine: 'Bengali',
      signatureDishes: ['macher jhol', 'luchi aloor dom', 'bhapa ilish', 'cholar dal', 'rosogolla'],
      stapleGrains: ['rice', 'lentils'],
      commonSpices: ['panch phoron', 'mustard', 'poppy seeds', 'nigella seeds'],
      cookingMethods: ['bhapa', 'bhuna', 'jhol', 'steaming'],
      seasonalIngredients: ['hilsa fish', 'mango', 'jackfruit', 'pumpkin'],
      festivalCuisine: ['durga puja', 'kali puja', 'poila boishakh', 'christmas'],
      streetFood: ['jhalmuri', 'phuchka', 'kathi rolls', 'tele bhaja'],
      spiceBlends: ['panch phoron', 'garam masala', 'bhaja masala'],
      dietaryPreferences: ['fish-heavy', 'rice-based', 'sweet desserts'],
      mindfulnessTraditions: ['prasad offering', 'community feasts', 'seasonal fasting']
    },

    [IndianRegion.GUJARAT]: {
      region: IndianRegion.GUJARAT,
      primaryLanguage: 'gujarati',
      dominantCuisine: 'Gujarati',
      signatureDishes: ['dhokla', 'thepla', 'khandvi', 'undhiyu', 'fafda'],
      stapleGrains: ['wheat', 'millet', 'rice'],
      commonSpices: ['ajwain', 'mustard', 'sesame', 'asafoetida'],
      cookingMethods: ['steaming', 'shallow frying', 'bhuna', 'dum'],
      seasonalIngredients: ['mango', 'pumpkin', 'bottle gourd', 'fenugreek'],
      festivalCuisine: ['navratri', 'diwali', 'uttarayan', 'janmashtami'],
      streetFood: ['dhokla', 'khandvi', 'fafda', 'jalebi'],
      spiceBlends: ['godha masala', 'dhokla masala', 'thepla masala'],
      dietaryPreferences: ['vegetarian', 'sweet-sour', 'nutritious'],
      mindfulnessTraditions: ['satvik food', 'fasting practices', 'community dining']
    },

    [IndianRegion.TAMIL_NADU]: {
      region: IndianRegion.TAMIL_NADU,
      primaryLanguage: 'tamil',
      dominantCuisine: 'Tamil',
      signatureDishes: ['idli', 'dosa', 'sambar', 'rasam', 'pongal'],
      stapleGrains: ['rice', 'lentils'],
      commonSpices: ['curry leaves', 'mustard', 'fenugreek', 'asafoetida'],
      cookingMethods: ['steaming', 'fermentation', 'tempering', 'slow cooking'],
      seasonalIngredients: ['mango', 'jackfruit', 'coconut', 'tamarind'],
      festivalCuisine: ['pongal', 'diwali', 'pongal', 'karthigai'],
      streetFood: ['idli sambar', 'masala dosa', 'vada', 'bonda'],
      spiceBlends: ['sambar powder', 'rasam powder', 'idli podi'],
      dietaryPreferences: ['fermented', 'spicy', 'coconut-based'],
      mindfulnessTraditions: ['temple food', 'seasonal eating', 'community cooking']
    },

    [IndianRegion.MAHARASHTRA]: {
      region: IndianRegion.MAHARASHTRA,
      primaryLanguage: 'marathi',
      dominantCuisine: 'Maharashtrian',
      signatureDishes: ['vada pav', 'misal pav', 'puran poli', 'bharli vangi', 'ukadiche modak'],
      stapleGrains: ['wheat', 'rice', 'jowar'],
      commonSpices: ['godha masala', 'kala masala', 'garam masala'],
      cookingMethods: ['bhuna', 'dum', 'steaming', 'deep frying'],
      seasonalIngredients: ['mango', 'jackfruit', 'pumpkin', 'coconut'],
      festivalCuisine: ['ganesh chaturthi', 'diwali', 'gudi padwa', 'makar sankranti'],
      streetFood: ['vada pav', 'misal pav', 'bhel puri', 'pani puri'],
      spiceBlends: ['godha masala', 'kala masala', 'garam masala'],
      dietaryPreferences: ['spicy', 'peanut-based', 'bread-heavy'],
      mindfulnessTraditions: ['ganesh prasad', 'community feasts', 'seasonal celebrations']
    },

    [IndianRegion.ASSAM]: {
      region: IndianRegion.ASSAM,
      primaryLanguage: 'assamese',
      dominantCuisine: 'Assamese',
      signatureDishes: ['khar', 'tenga', 'pitha', 'laksa', 'bamboo shoot curry'],
      stapleGrains: ['rice', 'bamboo'],
      commonSpices: ['bhut jolokia', 'black pepper', 'ginger', 'garlic'],
      cookingMethods: ['slow cooking', 'bamboo cooking', 'fermentation'],
      seasonalIngredients: ['bamboo shoots', 'fish', 'duck', 'wild herbs'],
      festivalCuisine: ['bihu', 'magh bihu', 'kati bihu'],
      streetFood: ['pitha', 'laksa', 'fish fry', 'bamboo rice'],
      spiceBlends: ['khar masala', 'tenga masala', 'bamboo masala'],
      dietaryPreferences: ['fermented', 'bamboo-based', 'wild ingredients'],
      mindfulnessTraditions: ['nature worship', 'seasonal rituals', 'community harmony']
    },

    // Add more regions as needed...
    [IndianRegion.DELHI]: {
      region: IndianRegion.DELHI,
      primaryLanguage: 'hindi',
      dominantCuisine: 'Mughlai',
      signatureDishes: ['butter chicken', 'seekh kebab', 'biryani', 'korma', 'shahi tukda'],
      stapleGrains: ['wheat', 'rice'],
      commonSpices: ['saffron', 'cardamom', 'cinnamon', 'cloves', 'nutmeg'],
      cookingMethods: ['dum', 'bhuna', 'tandoor', 'slow cooking'],
      seasonalIngredients: ['dry fruits', 'saffron', 'rose water', 'milk'],
      festivalCuisine: ['eid', 'diwali', 'christmas', 'republic day'],
      streetFood: ['chaat', 'kebab', 'biryani', 'jalebi'],
      spiceBlends: ['garam masala', 'biryani masala', 'kebab masala'],
      dietaryPreferences: ['rich', 'aromatic', 'mildly spiced'],
      mindfulnessTraditions: ['royal dining', 'ceremonial feasts', 'cultural celebrations']
    }
  };

  static getRegionalProfile(region: IndianRegion): RegionalCuisineProfile | null {
    return this.regionalProfiles[region] || null;
  }

  static getAllRegions(): IndianRegion[] {
    return Object.values(IndianRegion);
  }

  static getRegionsByLanguage(language: string): IndianRegion[] {
    return Object.values(this.regionalProfiles)
      .filter((profile): profile is RegionalCuisineProfile => !!profile && profile.primaryLanguage === language)
      .map(profile => profile.region);
  }

  static getSignatureDishes(region: IndianRegion): string[] {
    const profile = this.getRegionalProfile(region);
    return profile?.signatureDishes || [];
  }

  static getSeasonalIngredients(region: IndianRegion, season: 'spring' | 'summer' | 'monsoon' | 'autumn' | 'winter'): string[] {
    const profile = this.getRegionalProfile(region);
    if (!profile) return [];

    // This could be expanded with seasonal mapping
    return profile.seasonalIngredients;
  }

  static getMindfulnessTraditions(region: IndianRegion): string[] {
    const profile = this.getRegionalProfile(region);
    return profile?.mindfulnessTraditions || [];
  }

  static suggestRegionalRecipes(region: IndianRegion, dietaryRestrictions: string[]): string[] {
    const profile = this.getRegionalProfile(region);
    if (!profile) return [];

    // Filter dishes based on dietary restrictions
    let suggestions = profile.signatureDishes;
    
    if (dietaryRestrictions.includes('vegetarian')) {
      suggestions = suggestions.filter(dish => 
        !dish.includes('chicken') && !dish.includes('fish') && !dish.includes('meat')
      );
    }

    return suggestions;
  }
}
