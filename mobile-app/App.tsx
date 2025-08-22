import React, { useEffect } from 'react';
import { Text, View, ScrollView, SafeAreaView } from 'react-native';

console.log('=== APP.TSX START ===');
console.log('App.tsx - typeof require:', typeof require);

// Temporarily comment out all imports to isolate the issue
/*
import AppProviders from './src/providers/AppProviders';
import AppNavigator from './src/navigation/AppNavigator';
import { AdaptiveThemeProvider } from './src/theme/AdaptiveThemeProvider';
import StressDetectionService from './src/services/StressDetectionService';
import NotificationService from './src/services/NotificationService';
import MilestoneListener from './src/components/MilestoneListener';
import MindfulErrorBoundary from './src/components/MindfulErrorBoundary';
*/

const App = () => {
	console.log('App component rendering');
	
	useEffect(() => {
		console.log('App mounted');
		console.log('Environment:', process.env.EXPO_PUBLIC_ENV);
		console.log('Platform:', require('react-native').Platform.OS);
	}, []);

	// Temporary simple UI for debugging
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView contentContainerStyle={{ padding: 20 }}>
				<Text style={{ fontSize: 24, marginBottom: 20 }}>Debug Info</Text>
				<Text>typeof require: {typeof require}</Text>
				<Text>typeof global: {typeof global}</Text>
				<Text>typeof global.require: {typeof global?.require}</Text>
				<Text>typeof global.__r: {typeof global?.__r}</Text>
				<Text>Environment: {process.env.EXPO_PUBLIC_ENV || 'undefined'}</Text>
				<Text style={{ marginTop: 20, fontSize: 18 }}>
					If you see this, the app is running!
				</Text>
			</ScrollView>
		</SafeAreaView>
	);

	// Original app code - commented out for now
	/*
	return (
		<MindfulErrorBoundary>
			<AdaptiveThemeProvider>
				<AppProviders>
					<AppNavigator />
					<MilestoneListener />
				</AppProviders>
			</AdaptiveThemeProvider>
		</MindfulErrorBoundary>
	);
	*/
};

console.log('=== APP.TSX END ===');

export default App;