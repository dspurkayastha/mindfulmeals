import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './translations/en';
import hi from './translations/hi';

const LANGUAGE_KEY = '@MindfulMeals:language';

// Temporary inline translations until we fully migrate
const legacyTranslations = {
	en: {
		common: {
			welcome: 'Welcome to MindfulMeals',
			continue: 'Continue',
		},
		pantry: {
			empty: { title: 'Pantry is empty', message: 'Add your first item', action: 'Add item' },
			filters: { all: 'All', expiring: 'Expiring', lowStock: 'Low stock' },
		},
	},
	hi: {
		common: {
			welcome: 'MindfulMeals में आपका स्वागत है',
			continue: 'जारी रखें',
		},
		pantry: {
			empty: { title: 'रसोई खाली है', message: 'अपनी पहली वस्तु जोड़ें', action: 'जोड़ें' },
			filters: { all: 'सभी', expiring: 'समाप्त हो रहे', lowStock: 'कम स्टॉक' },
		},
	},
};

// Language detection
const languageDetector = {
	type: 'languageDetector' as const,
	async: true,
	detect: async (callback: (lang: string) => void) => {
		try {
			const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
			callback(savedLanguage || 'en');
		} catch {
			callback('en');
		}
	},
	init: () => {},
	cacheUserLanguage: async (lang: string) => {
		try {
			await AsyncStorage.setItem(LANGUAGE_KEY, lang);
		} catch {
			// Silent fail
		}
	},
};

i18n
	.use(languageDetector)
	.use(initReactI18next)
	.init({
		resources: legacyTranslations, // Will switch to new translations once files are loaded
		lng: 'en',
		fallbackLng: 'en',
		compatibilityJSON: 'v3',
		interpolation: { escapeValue: false },
		react: { useSuspense: false },
	});

export default i18n;