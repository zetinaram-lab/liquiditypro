// ============================================
// Language Context Provider - IMPROVED
// ============================================

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { Language, Translations } from '@/types/trading';
import { translations } from '@/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'liquiditypro_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Inicializar desde localStorage o detectar idioma del navegador
    if (typeof window === 'undefined') return 'en';
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language;
      if (stored && (stored === 'en' || stored === 'es')) {
        return stored;
      }
    } catch (error) {
      console.error('Error reading language from localStorage:', error);
    }
    
    // Detectar idioma del navegador
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'es' ? 'es' : 'en';
  });

  const [isHydrated, setIsHydrated] = useState(false);

  // Marcar como hidratado después del primer render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'es' : 'en');
  }, [language, setLanguage]);

  const t = useMemo(() => translations[language], [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      toggleLanguage,
    }),
    [language, setLanguage, t, toggleLanguage]
  );

  // Prevenir flash de contenido sin traducir (FOUC)
  if (!isHydrated) {
    return null;
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
