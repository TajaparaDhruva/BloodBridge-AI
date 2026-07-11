import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLang = languages.find(l => l.code === currentLanguage) || languages[0];

  const triggerGoogleTranslate = (langCode) => {
    const targetCode = langCode === 'en' ? 'en' : langCode;
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = targetCode;
      combo.dispatchEvent(new Event('change'));
    } else {
      // Fallback: set cookie and reload if widget not injected yet
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      window.location.reload();
    }
  };
  
  // On mount, ensure google translate matches our context
  useEffect(() => {
    const attemptSync = setInterval(() => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        if (combo.value !== (currentLanguage === 'en' ? 'en' : currentLanguage)) {
           triggerGoogleTranslate(currentLanguage || 'en');
        }
        clearInterval(attemptSync);
      }
    }, 500);
    return () => clearInterval(attemptSync);
  }, [currentLanguage]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200/60 dark:border-gray-800 bg-white/40 dark:bg-[#1E293B]/40 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-white dark:hover:bg-[#1E293B] hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 shadow-premium hover:shadow-premium-hover focus:outline-none hover:scale-102"
      >
        <span className="text-base">{activeLang.flag}</span>
        <span className="hidden sm:inline">{activeLang.label}</span>
        <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-[#1E293B] border border-gray-200/60 dark:border-gray-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                triggerGoogleTranslate(lang.code);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-3 py-2 text-left text-sm rounded-xl transition-all duration-200 ${
                currentLanguage === lang.code
                  ? 'bg-bloodred/10 text-bloodred font-semibold'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
