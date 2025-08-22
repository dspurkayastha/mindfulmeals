import type { ConfigContext, ExpoConfig } from '@expo/config';

const IS_DEV = process.env.EXPO_PUBLIC_ENV === 'development';
const IS_PREVIEW = process.env.EXPO_PUBLIC_ENV === 'preview';

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: IS_DEV ? 'MM Dev' : IS_PREVIEW ? 'MM Preview' : 'MindfulMeals',
	slug: 'mindfulmeals',
	scheme: 'mindfulmeals',
	version: '1.0.0',
	orientation: 'portrait',
	icon: './src/assets/icon.png',
	userInterfaceStyle: 'automatic',
	splash: {
		image: './src/assets/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff'
	},
	updates: {
		fallbackToCacheTimeout: 0,
		url: 'https://u.expo.dev/20500198-5703-48f8-9bdd-379925c60cbf'
	},
	assetBundlePatterns: ['**/*'],
	// Enable New Architecture for Reanimated 4 compatibility
	newArchEnabled: true,
	jsEngine: 'hermes',
	extra: {
		eas: {
			projectId: '20500198-5703-48f8-9bdd-379925c60cbf',
		},
		apiUrl: process.env.EXPO_PUBLIC_API_URL,
		environment: process.env.EXPO_PUBLIC_ENV,
		debug: process.env.EXPO_PUBLIC_DEBUG === 'true',
	},
	ios: {
		supportsTablet: true,
		bundleIdentifier: 'com.mindfulmeals.app',
		buildNumber: '1',
		infoPlist: {
			NSMicrophoneUsageDescription: 'MindfulMeals needs access to your microphone for voice commands and mindfulness exercises.',
			NSSpeechRecognitionUsageDescription: 'MindfulMeals uses speech recognition for voice journaling and commands.',
			UIRequiresFullScreen: true,
			// Add background modes if needed
			UIBackgroundModes: ['audio', 'fetch', 'remote-notification'],
		},
		config: {
			usesNonExemptEncryption: false,
		},
		// Ensure proper JS engine
		jsEngine: 'hermes',
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './src/assets/adaptive-icon.png',
			backgroundColor: '#ffffff',
		},
		package: 'com.mindfulmeals.app',
		versionCode: 1,
		permissions: ['RECORD_AUDIO', 'VIBRATE', 'NOTIFICATIONS'],
		// Ensure proper JS engine
		jsEngine: 'hermes',
	},
	web: {
		favicon: './src/assets/favicon.png',
	},
	plugins: [
		[
			'expo-build-properties',
			{
				ios: { 
					newArchEnabled: true, 
					deploymentTarget: '15.1',
					// Enable debugging capabilities
					...(IS_DEV && {
						flipper: true,
					}),
					// Ensure Hermes is used
					useFrameworks: 'static',
					extraPods: [
						{
							name: 'hermes-engine',
							path: '../node_modules/react-native/sdks/hermes-engine/hermes-engine.podspec',
							modular_headers: true,
						},
					],
				},
				android: { 
					newArchEnabled: true,
					// Enable debugging capabilities  
					...(IS_DEV && {
						enableProguardInReleaseBuilds: false,
						enableShrinkResourcesInReleaseBuilds: false,
					}),
					// Ensure Hermes is used
					hermesEnabled: true,
				},
			},
		],
		['expo-notifications'],
		'./plugins/with-voice-permissions',
		// Add development client plugin for better debugging
		...(IS_DEV ? ['expo-dev-client'] : []),
	],
	// Runtimeversion policy for updates
	runtimeVersion: {
		policy: 'sdkVersion',
	},
});