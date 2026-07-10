import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/i18n'; // import i18n setup

const LanguageContext = createContext();

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', label: 'English' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', label: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', label: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', label: 'मराठी' }
];

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || null;
  });

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    setCurrentLanguage(langCode);
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
