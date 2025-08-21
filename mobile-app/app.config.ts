import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: 'MindfulMeals',
	slug: 'mindfulmeals',
	scheme: 'mindfulmeals',
	// Explicitly disable New Architecture at the top-level to avoid deprecation warnings
	newArchEnabled: false,
	extra: {
		eas: {
			projectId: '20500198-5703-48f8-9bdd-379925c60cbf',
		},
	},
	ios: {
		bundleIdentifier: 'com.mindfulmeals.app',
	},
	android: {
		package: 'com.mindfulmeals.app',
	},
	plugins: [
		[
			'expo-build-properties',
			{
				ios: { newArchEnabled: false, deploymentTarget: '15.1' },
				android: { newArchEnabled: false },
			},
		],
		['expo-notifications'],
		'./plugins/with-voice-permissions',
	],
});