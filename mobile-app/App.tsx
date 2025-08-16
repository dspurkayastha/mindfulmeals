import React from 'react';
import AppProviders from './src/providers/AppProviders';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
	return (
		<AppProviders>
			<AppNavigator />
		</AppProviders>
	);
};

export default App;