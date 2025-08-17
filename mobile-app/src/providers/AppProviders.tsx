import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import '../i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import queryClient from '../api/queryClient';

interface AppProvidersProps {
	children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<I18nextProvider i18n={i18n}>
				{children}
				<Toast />
			</I18nextProvider>
		</QueryClientProvider>
	);
};

export default AppProviders;