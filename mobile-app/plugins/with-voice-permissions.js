const { withInfoPlist, withAndroidManifest } = require('@expo/config-plugins');

/**
 * Minimal config plugin to add microphone permission for voice features.
 */
const withVoicePermissions = (config) => {
	withInfoPlist(config, (c) => {
		const key = 'NSMicrophoneUsageDescription';
		if (!c.modResults[key]) {
			c.modResults[key] = 'Microphone access is required for voice features.';
		}
		return c;
	});

	withAndroidManifest(config, (c) => {
		const manifest = c.modResults;
		const usesPermissions = manifest.manifest['uses-permission'] ?? [];
		const hasRecordAudio = usesPermissions.some((p) => p.$['android:name'] === 'android.permission.RECORD_AUDIO');
		if (!hasRecordAudio) {
			usesPermissions.push({ $: { 'android:name': 'android.permission.RECORD_AUDIO' } });
			manifest.manifest['uses-permission'] = usesPermissions;
		}
		return c;
	});

	return config;
};

module.exports = withVoicePermissions;

