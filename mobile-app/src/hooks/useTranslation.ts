import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useTranslation() {
  const { t, i18n, ready } = useI18nTranslation();

  const changeLanguage = useCallback(async (language: 'en' | 'hi') => {
    await i18n.changeLanguage(language);
  }, [i18n]);

  return {
    t,
    language: i18n.language as 'en' | 'hi',
    changeLanguage,
    ready,
  };
}

// Re-export for convenience
export { Trans } from 'react-i18next';