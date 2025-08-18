import type { ConfigPlugin } from '@expo/config-plugins';
import { withInfoPlist, withAndroidManifest } from '@expo/config-plugins';

const withVoicePermissions: ConfigPlugin = (config) => {
	withInfoPlist(config, (c) => {
		// Ensure microphone usage string exists
		const key = 'NSMicrophoneUsageDescription';
		// @ts-ignore
		if (!c.modResults[key]) {
			// @ts-ignore
			c.modResults[key] = 'Microphone access is required for voice features.';
		}
		return c;
	});

	withAndroidManifest(config, (c) => {
		const manifest = c.modResults;
		const usesPermissions = manifest.manifest['uses-permission'] ?? [];
		const hasRecordAudio = usesPermissions.some((p: any) => p.$['android:name'] === 'android.permission.RECORD_AUDIO');
		if (!hasRecordAudio) {
			usesPermissions.push({ $: { 'android:name': 'android.permission.RECORD_AUDIO' } });
			// @ts-ignore
			manifest.manifest['uses-permission'] = usesPermissions;
		}
		return c;
	});

	return config;
};

export default withVoicePermissions;

