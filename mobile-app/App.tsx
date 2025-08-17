import React, { useEffect } from 'react';
import AppProviders from './src/providers/AppProviders';
import AppNavigator from './src/navigation/AppNavigator';
import { AdaptiveThemeProvider } from './src/theme/AdaptiveThemeProvider';
import StressDetectionService from './src/services/StressDetectionService';
import NotificationService from './src/services/NotificationService';
import MilestoneListener from './src/components/MilestoneListener';
import MindfulErrorBoundary from './src/components/MindfulErrorBoundary';

const App = () => {
	useEffect(() => {
		// Initialize services on app start
		const initializeServices = async () => {
			try {
				// Configure and request permissions for notifications
				await NotificationService.getInstance().configure();
				await NotificationService.getInstance().requestPermissions();
				
				// Start stress monitoring
				StressDetectionService.getInstance().startMonitoring();
				
				console.log('Services initialized successfully');
			} catch (error) {
				console.error('Error initializing services:', error);
			}
		};

		initializeServices();

		// Cleanup on app unmount
		return () => {
			StressDetectionService.getInstance().stopMonitoring();
		};
	}, []);

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
};

export default App;