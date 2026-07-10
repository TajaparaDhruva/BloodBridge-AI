import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import { FiMenu, FiX, FiActivity, FiHeart, FiMapPin, FiChevronRight } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Hospital Partnership', href: '/hospital-partnership' },
    { label: 'For Donors', href: '#donors' },
    { label: 'Impact', href: '#impact' },
    { label: 'About Us', href: '#about-us' },
  ];

  const handleNav = (href) => {
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-nav py-3' : 'py-5 bg-transparent'
        }`}
      >
        <div className="container-bb flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group font-poppins">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-[#E11D48] flex items-center justify-center shadow-premium transition-all duration-300 group-hover:scale-105 group-hover:shadow-premium-hover text-white">
                <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z" />
                </svg>
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-darkbg animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white text-[16px] tracking-tight leading-none block">
                BloodBridge <span className="text-[#E11D48] ml-0.5">AI</span>
              </span>
              <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase mt-0.5 block">AI Platform</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.href)}
                className="btn-ghost text-[14px] font-semibold"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-ghost text-[13px]"
                >
                  <FiActivity className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={logout}
                  className="btn-secondary text-[13px] py-2 px-4"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-[13px]">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary text-[13px] py-2.5 px-5">
                  Get Started
                  <FiChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-black/08 dark:border-white/08 hover:bg-black/04 dark:hover:bg-white/04 transition-colors"
            >
              {mobileOpen ? (
                <FiX className="w-4.5 h-4.5 text-slate dark:text-white" />
              ) : (
                <FiMenu className="w-4.5 h-4.5 text-slate dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[64px] left-4 right-4 z-40 rounded-2xl glass-floating p-4 lg:hidden"
          >
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNav(link.href)}
                  className="w-full text-left px-4 py-3 rounded-xl text-[14px] font-semibold text-slate dark:text-white hover:bg-black/04 dark:hover:bg-white/05 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="pt-3 border-t border-black/05 dark:border-white/05 flex flex-col gap-2">
              {user ? (
                <>
                  <button onClick={() => { navigate('/dashboard'); setMobileOpen(false); }} className="btn-primary w-full justify-center">
                    Go to Dashboard
                  </button>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="btn-secondary w-full justify-center">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full justify-center text-center">Sign In</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
