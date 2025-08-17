import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
	en: {
		common: {
			welcome: 'Welcome to Swasthya Food',
			continue: 'Continue',
		},
		pantry: {
			empty: { title: 'Pantry is empty', message: 'Add your first item', action: 'Add item' },
			filters: { all: 'All', expiring: 'Expiring', lowStock: 'Low stock' },
		},
	},
	hi: {
		common: {
			welcome: 'स्वास्थ्य फूड में आपका स्वागत है',
			continue: 'जारी रखें',
		},
		pantry: {
			empty: { title: 'रसोई खाली है', message: 'अपनी पहली वस्तु जोड़ें', action: 'जोड़ें' },
			filters: { all: 'सभी', expiring: 'समाप्त हो रहे', lowStock: 'कम स्टॉक' },
		},
	},
};

i18n
	.use(initReactI18next)
	.init({
		resources,
		lng: 'en',
		fallbackLng: 'en',
		compatibilityJSON: 'v3',
		interpolation: { escapeValue: false },
	});

export default i18n;