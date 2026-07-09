import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FiArrowRight, FiCheck } from 'react-icons/fi';

const LanguageSelect = () => {
  const navigate = useNavigate();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(currentLanguage || 'en');

  const handleSelect = (code) => {
    setSelectedLang(code);
    changeLanguage(code);
  };

  const handleContinue = () => {
    changeLanguage(selectedLang);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      
      {/* Dynamic blurred accents */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-bloodred/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-crimson/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/40 dark:border-white/5 p-8 sm:p-12 shadow-2xl relative z-10 transition-colors duration-300">
        
        {/* Brand Banner */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bloodred-light to-bloodred-dark flex items-center justify-center shadow-md">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z"
                fill="currentColor"
              />
              <path
                d="M9 14.5C10.2 13 11.4 13 12.2 14.5C13 16 14.2 16 15.4 14.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-bloodred via-crimson to-gray-800 dark:to-gray-100 bg-clip-text text-transparent">
            BloodBridge AI
          </span>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Choose Your Language
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select your preferred language to customize your emergency healthcare dashboard.
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {languages.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 text-left group overflow-hidden ${
                  isSelected
                    ? 'border-bloodred bg-bloodred/5 text-bloodred shadow-premium'
                    : 'border-gray-200/80 dark:border-gray-800 bg-white/40 dark:bg-slate-800/40 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-gray-700 hover:scale-102 hover:shadow-premium'
                }`}
              >
                {/* Background pulse effect on selection */}
                {isSelected && (
                  <div className="absolute inset-0 bg-bloodred/5 dark:bg-bloodred/5 animate-pulse -z-10"></div>
                )}
                
                <div className="flex items-center gap-4">
                  <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">{lang.flag}</span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{lang.name}</h4>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{lang.label}</span>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isSelected 
                    ? 'bg-bloodred border-bloodred text-white scale-110' 
                    : 'border-gray-300 dark:border-gray-700 bg-transparent text-transparent group-hover:border-gray-400'
                }`}>
                  <FiCheck className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-bloodred to-crimson text-white font-semibold shadow-lg hover:shadow-premium-hover hover:scale-101 active:scale-99 transition-all duration-300 group"
        >
          Continue / आगे बढ़ें / આગળ વધો / पुढे जा
          <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>

      </div>
    </div>
  );
};

export default LanguageSelect;
