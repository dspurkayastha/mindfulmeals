import React from 'react';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { colors } from '../utils/theme';
import '../i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import queryClient from '../api/queryClient';

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
	return (
		<QueryClientProvider client={queryClient}>
			<I18nextProvider i18n={i18n}>
				<PaperProvider theme={paperTheme}>
					{children}
					<Toast />
				</PaperProvider>
			</I18nextProvider>
		</QueryClientProvider>
	);
};

export default AppProviders;