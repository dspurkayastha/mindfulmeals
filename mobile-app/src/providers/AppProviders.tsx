import React from 'react';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { colors } from '../utils/theme';

const paperTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: colors.terracotta,
		secondary: colors.olive,
		background: colors.warmGray,
		surface: colors.softCream,
		error: colors.error,
		onPrimary: colors.textInverse,
		onSurface: colors.textPrimary,
	},
};

interface AppProvidersProps {
	children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
	return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
};

export default AppProviders;