import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: 'MindfulMeals',
	slug: 'mindfulmeals',
	scheme: 'mindfulmeals',
	// Enable New Architecture for Reanimated 4 compatibility
	newArchEnabled: true,
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
				ios: { newArchEnabled: true, deploymentTarget: '15.1' },
				android: { newArchEnabled: true },
			},
		],
		['expo-notifications'],
		'./plugins/with-voice-permissions',
	],
});