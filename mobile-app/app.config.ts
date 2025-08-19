import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: 'MindfulMeals',
	slug: 'mindfulmeals',
	scheme: 'mindfulmeals',
	icon: './assets/icon.png',
	ios: {
		bundleIdentifier: 'com.mindfulmeals.app',
	},
	android: {
		package: 'com.mindfulmeals.app',
	},
	plugins: [
		'expo-build-properties',
		['expo-notifications'],
		'./plugins/with-voice-permissions',
	],
});

