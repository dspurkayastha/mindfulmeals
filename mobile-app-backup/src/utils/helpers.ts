// MindfulMeals Utility Functions

/**
 * Format a number as Indian currency (₹)
 */
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Calculate age from birth date
 */
export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Get age group from age
 */
export const getAgeGroup = (age: number): string => {
  if (age < 13) return 'child';
  if (age < 20) return 'teen';
  if (age < 65) return 'adult';
  return 'elder';
};

/**
 * Format date in Indian format (DD/MM/YYYY)
 */
export const formatIndianDate = (date: Date): string => {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Get meal type from time
 */
export const getMealTypeFromTime = (hour: number): string => {
  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 20) return 'dinner';
  return 'snack';
};

/**
 * Calculate calories from macros
 */
export const calculateCalories = (protein: number, carbs: number, fat: number): number => {
  return (protein * 4) + (carbs * 4) + (fat * 9);
};

/**
 * Get mindfulness tip based on meal type
 */
export const getMindfulnessTip = (mealType: string): string => {
  const tips = {
    breakfast: 'Start your day with gratitude. Take three deep breaths before eating.',
    lunch: 'Pause mid-meal to check in with your hunger levels.',
    dinner: 'Eat slowly and savor each bite. Reflect on your day.',
    snack: 'Choose snacks that nourish both body and mind.',
  };
  
  return tips[mealType as keyof typeof tips] || 'Eat mindfully and with intention.';
};

/**
 * Validate Indian phone number
 */
export const validateIndianPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Get regional greeting based on time
 */
export const getRegionalGreeting = (hour: number, language: 'hindi' | 'english' = 'english'): string => {
  if (language === 'hindi') {
    if (hour >= 5 && hour < 12) return 'सुप्रभात! (Suprabhat!)';
    if (hour >= 12 && hour < 17) return 'नमस्कार! (Namaskar!)';
    if (hour >= 17 && hour < 21) return 'सुसंध्या! (Susandhya!)';
    return 'शुभ रात्रि! (Shubh Ratri!)';
  }
  
  if (hour >= 5 && hour < 12) return 'Good Morning!';
  if (hour >= 12 && hour < 17) return 'Good Afternoon!';
  if (hour >= 17 && hour < 21) return 'Good Evening!';
  return 'Good Night!';
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate a random mindfulness quote
 */
export const getRandomMindfulnessQuote = (): string => {
    const quotes = [
      'Every meal is an opportunity to practice mindfulness.',
      'Eat with intention, not with habit.',
      'The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison.',
      'Mindful eating is a way to become reacquainted with the guidance of our internal nutritionist.',
      'When you eat, just eat. When you walk, just walk.',
      'Food is not just eating energy. It\'s an experience.',
      'The greatest wealth is health.',
      'Let food be thy medicine and medicine be thy food.',
      // Additional quotes:
      'Slow down, savor each bite, and nourish your body with presence.',
      'Gratitude transforms a simple meal into a feast for the soul.',
      'Hunger comes from the body, cravings come from the mind.',
      'Awareness at the table brings balance to life.',
      'Listen to your body, honor your hunger, respect your fullness.',
      'Wellness begins on the plate.',
      'Your body is your most priceless possession. Feed it with love.',
      'An unrushed meal is a gift to yourself.',
      'The mind digests what the body eats.',
      'Pause before you eat; appreciate what’s on your plate.',
      'True mindful eating is treating food with the respect it deserves.',
      'Celebrate nourishment, not just flavor.'
    ];
  
    return quotes[Math.floor(Math.random() * quotes.length)];
  };
  
