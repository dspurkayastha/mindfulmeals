export const useTranslation = () => {
	const t = (key: string, vars?: Record<string, any>) => key;
	return { t, language: 'english' } as const;
};