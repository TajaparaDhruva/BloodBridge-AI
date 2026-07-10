import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';

// Pages & Components
import SplashScreen from './pages/SplashScreen';
import LanguageSelect from './pages/LanguageSelect';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import HospitalPartnership from './pages/HospitalPartnership';
import { AutoTranslate } from './utils/translator';

// Route helper: redirect to splash if no language selected yet
const HomeRouteWrapper = () => {
  const isLanguageSelected = localStorage.getItem('language');
  if (!isLanguageSelected) {
    return <Navigate to="/splash" replace />;
  }
  return <LandingPage />;
};

// Simple 404 page
const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF9F6] dark:bg-[#0F172A] text-center transition-colors">
    <span className="text-7xl mb-6">🩸</span>
    <h1 className="text-4xl font-extrabold mb-3 text-gray-900 dark:text-white">404 — Page Not Found</h1>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-xs leading-relaxed">
      The healthcare AI matching gateway could not find this page.
    </p>
    <Link
      to="/"
      className="px-6 py-3 bg-[#D72638] hover:bg-[#C1121F] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all"
    >
      Return to Matching Hub
    </Link>
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LocationProvider>
          <AuthProvider>
            <BrowserRouter>
              
              <Routes>
                {/* Home — redirects to splash if no language chosen */}
                <Route path="/" element={<AutoTranslate><HomeRouteWrapper /></AutoTranslate>} />

                {/* Initial onboarding flow */}
                <Route path="/splash" element={<AutoTranslate><SplashScreen /></AutoTranslate>} />
                <Route path="/language-select" element={<AutoTranslate><LanguageSelect /></AutoTranslate>} />

                {/* Auth */}
                <Route path="/login" element={<AutoTranslate><Login /></AutoTranslate>} />
                <Route path="/signup" element={<AutoTranslate><Signup /></AutoTranslate>} />

                {/* Public pages */}
                <Route path="/hospital-partnership" element={<AutoTranslate><HospitalPartnership /></AutoTranslate>} />

                {/* Dashboard */}
                <Route path="/dashboard" element={<AutoTranslate><Dashboard /></AutoTranslate>} />

                {/* 404 Fallback */}
                <Route path="*" element={<AutoTranslate><NotFound /></AutoTranslate>} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LocationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
